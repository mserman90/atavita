/**
 * AtaVita (atavita.com.tr) - API & Veri Entegrasyon Mimarisi
 * Teyzelerin Mutfak Panosu
 * 
 * Kesin Yazılım & Mimari Standartları:
 * 1. Kurgusal Veri (Mock Data) Yasaktır: Hata durumunda uydurma veri üretilmez, "Veri mevcut değil" döndürülür.
 * 2. API ve Kota Yönetimi: Sayaçlar tutulur, %80 limitinde sistem uyarısı üretilir. X-RateLimit-Remaining varsa parse edilir.
 * 3. IETF Standartları & RFC 6585: 429 Too Many Requests ve Retry-After başlığı kuralına göre işlenir.
 * 4. Üstel Geri Çekilme (Exponential Backoff): 1s, 2s, 4s... katlanarak artan bekleme + Jitter.
 * 5. RSS Entegrasyonu: https://api.rss2json.com/v1/api.json?rss_url=TARGET_RSS
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const api = factory();
    root.AtaVitaAPI = api;
    root.AnneMenuAPI = api;
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ------------------------------------------------------------------------
   * 1. Kota Yönetimi (Quota Manager)
   * ------------------------------------------------------------------------ */
  class QuotaManager {
    constructor(options = {}) {
      this.maxQuota = options.maxQuota || 50; // Oturum/varsayılan kota limiti
      this.requestCount = 0;
      this.warningThresholdRatio = 0.80; // %80 eşiği
      this.warningTriggered = false;
      this.remainingFromHeader = null;
      this.limitFromHeader = null;
      this.listeners = [];
    }

    /**
     * Kota durumu değişikliklerini dinlemek için abone ol
     */
    subscribe(callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback);
      }
    }

    /**
     * Durum değişikliği bildir
     */
    notify(eventData) {
      this.listeners.forEach(cb => {
        try {
          cb(eventData);
        } catch (e) {
          console.error('[QuotaManager] Dinleyici hatası:', e);
        }
      });
    }

    /**
     * İstek yapıldığında sayaç artır ve limitleri kontrol et
     */
    recordRequest() {
      this.requestCount++;
      const currentQuotaLimit = this.limitFromHeader || this.maxQuota;
      const usageRatio = this.requestCount / currentQuotaLimit;
      const isOverThreshold = usageRatio >= this.warningThresholdRatio;

      const state = {
        requestCount: this.requestCount,
        maxQuota: currentQuotaLimit,
        usageRatio: usageRatio,
        percent: Math.min(100, Math.round(usageRatio * 100)),
        isOverThreshold: isOverThreshold,
        remainingFromHeader: this.remainingFromHeader
      };

      // %80 eşiğine ulaşıldığında sistem uyarısı logla/bildir
      if (isOverThreshold && !this.warningTriggered) {
        this.warningTriggered = true;
        console.warn(
          `[KOTA UYARISI] API kotasının %${state.percent}'ine ulaşıldı! ` +
          `(Kullanılan: ${this.requestCount} / ${currentQuotaLimit}). Lütfen istek sıklığını optimize edin.`
        );
        this.notify({ type: 'QUOTA_THRESHOLD_WARNING', state });
      }

      this.notify({ type: 'QUOTA_UPDATED', state });
      return state;
    }

    /**
     * API sağlayıcısının X-RateLimit başlıklarını parse et.
     * Varsa okunur, yoksa varlığı varsayılmaz (kesin kural).
     */
    parseRateLimitHeaders(headers) {
      if (!headers || typeof headers.get !== 'function') return;

      const remainingHeader = headers.get('x-ratelimit-remaining');
      const limitHeader = headers.get('x-ratelimit-limit');

      let headersFound = false;

      if (remainingHeader !== null && remainingHeader !== '') {
        const parsedRemaining = parseInt(remainingHeader, 10);
        if (!isNaN(parsedRemaining)) {
          this.remainingFromHeader = parsedRemaining;
          headersFound = true;
        }
      }

      if (limitHeader !== null && limitHeader !== '') {
        const parsedLimit = parseInt(limitHeader, 10);
        if (!isNaN(parsedLimit)) {
          this.limitFromHeader = parsedLimit;
          headersFound = true;
        }
      }

      if (headersFound) {
        this.notify({
          type: 'HEADERS_PARSED',
          state: {
            remaining: this.remainingFromHeader,
            limit: this.limitFromHeader
          }
        });
      }
    }

    getState() {
      const currentQuotaLimit = this.limitFromHeader || this.maxQuota;
      const usageRatio = this.requestCount / currentQuotaLimit;
      return {
        requestCount: this.requestCount,
        maxQuota: currentQuotaLimit,
        usageRatio: usageRatio,
        percent: Math.min(100, Math.round(usageRatio * 100)),
        isOverThreshold: usageRatio >= this.warningThresholdRatio,
        remainingFromHeader: this.remainingFromHeader,
        limitFromHeader: this.limitFromHeader
      };
    }
  }

  /* ------------------------------------------------------------------------
   * 2. HTTP Durum Kodları (IETF Standartları & RFC 6585)
   * ------------------------------------------------------------------------ */
  class HttpError extends Error {
    constructor(status, statusText, retryAfterMs = null, headers = null) {
      super(`HTTP ${status} - ${statusText}`);
      this.name = 'HttpError';
      this.status = status;
      this.statusText = statusText;
      this.retryAfterMs = retryAfterMs;
      this.headers = headers;
    }
  }

  /**
   * RFC 6585 ve RFC 7231 uyumlu Retry-After başlığı ayrıştırıcı.
   * Format 1: Saniye (örn: "120")
   * Format 2: HTTP Tarihi (örn: "Wed, 21 Oct 2026 07:28:00 GMT")
   */
  function parseRetryAfterHeader(headerValue) {
    if (!headerValue) return null;

    const trimmed = String(headerValue).trim();

    // 1. Durum: Saniye cinsinden tam sayı
    if (/^\d+$/.test(trimmed)) {
      const seconds = parseInt(trimmed, 10);
      return Math.max(0, seconds * 1000);
    }

    // 2. Durum: HTTP Date
    const parsedTimestamp = Date.parse(trimmed);
    if (!isNaN(parsedTimestamp)) {
      const diffMs = parsedTimestamp - Date.now();
      return Math.max(0, diffMs);
    }

    return null;
  }

  /* ------------------------------------------------------------------------
   * 3. Üstel Geri Çekilme (Exponential Backoff with Full Jitter)
   * ------------------------------------------------------------------------ */
  /**
   * Belirtilen milisaniye kadar bekletir
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Exponential backoff + full jitter hesaplar
   * Delay = (baseDelay * 2^attempt) + jitter (0 - 500ms arası rastgelelik)
   */
  function calculateBackoffDelay(attempt, baseDelayMs = 1000, maxDelayMs = 16000) {
    const exponential = baseDelayMs * Math.pow(2, attempt);
    // Çakışmaları (thundering herd) önlemek için rastgelelik (jitter) eklenir
    const jitter = Math.floor(Math.random() * 500);
    const total = exponential + jitter;
    return Math.min(total, maxDelayMs);
  }

  /**
   * Üstel geri çekilme algoritmasıyla fetch isteği yürütür
   */
  async function fetchWithExponentialBackoff(url, options = {}, config = {}) {
    const maxRetries = config.maxRetries !== undefined ? config.maxRetries : 3;
    const baseDelayMs = config.baseDelayMs || 1000;
    const quotaManager = config.quotaManager || null;
    const onRetry = config.onRetry || null;
    const onStatusUpdate = config.onStatusUpdate || null;

    let attempt = 0;

    while (attempt <= maxRetries) {
      if (quotaManager) {
        quotaManager.recordRequest();
      }

      try {
        if (onStatusUpdate) {
          onStatusUpdate({ status: 'FETCHING', attempt });
        }

        const response = await fetch(url, options);

        // API sağlayıcısının RateLimit başlıklarını işle (kesin kural: varsayma, varsa parse et)
        if (quotaManager && response.headers) {
          quotaManager.parseRateLimitHeaders(response.headers);
        }

        // IETF Standartları Kontrolü
        if (response.ok) {
          if (onStatusUpdate) {
            onStatusUpdate({ status: 'SUCCESS', code: response.status, statusText: response.statusText });
          }
          return response;
        }

        // RFC 6585: 429 Too Many Requests kontrolü
        if (response.status === 429) {
          let retryAfterMs = null;
          const retryAfterHeader = response.headers ? response.headers.get('retry-after') : null;

          if (retryAfterHeader) {
            retryAfterMs = parseRetryAfterHeader(retryAfterHeader);
          }

          // Eğer Retry-After başlığı yoksa veya geçersizse backoff süresini kullan
          const waitTimeMs = retryAfterMs !== null 
            ? retryAfterMs + Math.floor(Math.random() * 300) 
            : calculateBackoffDelay(attempt, baseDelayMs);

          console.warn(
            `[IETF 429 Too Many Requests] RFC 6585 gereğince bekleniyor: ${waitTimeMs}ms. ` +
            `Retry-After: ${retryAfterHeader || 'Mevcut Değil'}. Deneme: ${attempt + 1}/${maxRetries}`
          );

          if (attempt >= maxRetries) {
            throw new HttpError(response.status, response.statusText, retryAfterMs, response.headers);
          }

          if (onRetry) {
            onRetry({
              attempt: attempt + 1,
              maxRetries,
              status: 429,
              delayMs: waitTimeMs,
              reason: '429_TOO_MANY_REQUESTS'
            });
          }

          await sleep(waitTimeMs);
          attempt++;
          continue;
        }

        // 5xx Sunucu Hataları (500, 502, 503, 504) için de geri çekilme uygulanır
        if (response.status >= 500 && response.status <= 504) {
          const waitTimeMs = calculateBackoffDelay(attempt, baseDelayMs);
          console.warn(`[HTTP ${response.status}] Sunucu hatası. ${waitTimeMs}ms sonra tekrar denenecek. Deneme: ${attempt + 1}/${maxRetries}`);

          if (attempt >= maxRetries) {
            throw new HttpError(response.status, response.statusText, null, response.headers);
          }

          if (onRetry) {
            onRetry({
              attempt: attempt + 1,
              maxRetries,
              status: response.status,
              delayMs: waitTimeMs,
              reason: 'SERVER_ERROR'
            });
          }

          await sleep(waitTimeMs);
          attempt++;
          continue;
        }

        // 4xx istemci hataları (400, 401, 403, 404) tekrar denenmez
        throw new HttpError(response.status, response.statusText, null, response.headers);

      } catch (err) {
        // Ağ (Network) kopması veya geçici hatalar
        if (err instanceof HttpError && (err.status < 500 && err.status !== 429)) {
          // İstemci hatalarında döngüyü kır
          throw err;
        }

        if (attempt >= maxRetries) {
          throw err;
        }

        const waitTimeMs = calculateBackoffDelay(attempt, baseDelayMs);
        console.warn(`[Ağ Hatası] İstek başarısız: ${err.message}. ${waitTimeMs}ms sonra tekrar denenecek. Deneme: ${attempt + 1}/${maxRetries}`);

        if (onRetry) {
          onRetry({
            attempt: attempt + 1,
            maxRetries,
            status: err.status || 'NETWORK_ERROR',
            delayMs: waitTimeMs,
            reason: 'NETWORK_FAILURE'
          });
        }

        await sleep(waitTimeMs);
        attempt++;
      }
    }
  }

  /* ------------------------------------------------------------------------
   * 4. RSS Entegrasyon Servisi (rss2json Standardı)
   * ------------------------------------------------------------------------ */
  class RssFeedService {
    constructor(quotaManager) {
      this.quotaManager = quotaManager || new QuotaManager();
      this.apiBase = 'https://api.rss2json.com/v1/api.json?rss_url=';
    }

    /**
     * Hedef RSS URL'sini rss2json servisi üzerinden çeker
     * Kural: Kurgusal veri kesinlikle üretilmez; veri yoksa boş liste döner
     */
    async fetchFeed(targetRssUrl, eventCallbacks = {}) {
      if (!targetRssUrl || typeof targetRssUrl !== 'string' || targetRssUrl.trim() === '') {
        throw new Error('HEDEF_RSS_YOK');
      }

      const fullUrl = `${this.apiBase}${encodeURIComponent(targetRssUrl.trim())}`;

      const response = await fetchWithExponentialBackoff(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }, {
        maxRetries: 3,
        baseDelayMs: 1000,
        quotaManager: this.quotaManager,
        onRetry: eventCallbacks.onRetry,
        onStatusUpdate: eventCallbacks.onStatusUpdate
      });

      const data = await response.json();

      if (data && data.status === 'ok' && Array.isArray(data.items)) {
        return {
          status: 'ok',
          feed: data.feed || {},
          items: data.items
        };
      }

      // API başarılı 200 dönse bile rss2json hata payload'u döndürebilir
      if (data && data.status === 'error') {
        const errorMsg = data.message || 'RSS kaynağı okunamadı';
        throw new Error(errorMsg);
      }

      // Herhangi bir veri bulunamadıysa
      return {
        status: 'empty',
        feed: {},
        items: []
      };
    }
  }

  return {
    QuotaManager,
    HttpError,
    parseRetryAfterHeader,
    calculateBackoffDelay,
    fetchWithExponentialBackoff,
    RssFeedService
  };
}));
