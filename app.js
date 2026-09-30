/**
 * Anne Menü (annemenu.com.tr) - Teyzelerin Mutfak Panosu
 * UI & Etkileşim Yönetimi (Sıfır Komisyon, Doğrudan Teyze İletişimi)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Mobil Menü & Navigasyon Yönetimi
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileToggle.classList.toggle('active', !isExpanded);
      mobileNav.classList.toggle('open', !isExpanded);
      mobileNav.setAttribute('aria-hidden', isExpanded);
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('active');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ==========================================================================
     2. Örnek Fit Menü Verileri (Etik Kural: Tahmini Makrolar & Alerjen Beyanı)
     ========================================================================== */
  const weeklyFitMenuData = {
    pazartesi: {
      dayTitle: 'Pazartesi Fit İlanı',
      chefTag: 'Ev Mutfağı &bull; Tahmini Değerler',
      courses: [
        {
          badge: 'Ana Yemek',
          title: 'Anne Usulü Fırın Hindi But',
          desc: 'Taze kekik ve hafif sarımsak ile marine edilmiş fırın hindi but & Siyez bulguru pilavı.',
          allergens: 'Alerjen: Gluten (Siyez bulguru)'
        },
        {
          badge: 'Eşlikçi',
          title: 'Zeytinyağlı Çıtır Taze Fasulye',
          desc: 'Soğuk sıkım Ayvalık sızma zeytinyağı ve domates sosu ile taze pişirilir.',
          allergens: 'Alerjen: Yok (Temiz içerik)'
        },
        {
          badge: 'Yan Lezzet',
          title: 'Nane & Salatalıklı Süzme Yoğurt',
          desc: 'Geleneksel mayalanmış süzme köy yoğurdu, nane ve taze ceviz içi.',
          allergens: 'Alerjen: Süt ürünü (Laktoz), Ceviz'
        }
      ],
      macros: {
        protein: '~46g',
        carb: '~42g',
        fat: '~18g',
        calories: '~570 kcal'
      }
    },
    sali: {
      dayTitle: 'Salı Fit İlanı',
      chefTag: 'Ev Mutfağı &bull; Tahmini Değerler',
      courses: [
        {
          badge: 'Ana Yemek',
          title: 'Yağsız Dana Anne Köftesi (5 Adet)',
          desc: 'Kıyması az yağlı dana buttan çekilmiş, unsuz ve ekmeksiz anne köftesi & fırınlanmış tatlı patates.',
          allergens: 'Alerjen: Yumurta (Köfte harcında)'
        },
        {
          badge: 'Eşlikçi',
          title: 'Köz Kırmızı Biber & Roka Salatası',
          desc: 'Odun ateşinde közlenmiş kapya biber, organik roka, nar ekşisi ve keten tohumu.',
          allergens: 'Alerjen: Yok (Temiz içerik)'
        },
        {
          badge: 'Yan Lezzet',
          title: 'Fırınlanmış Tarçınlı Elma Kompostosu',
          desc: 'Şekersiz, karanfil ve çubuk tarçınla demlenmiş Amasya elması.',
          allergens: 'Alerjen: Yok'
        }
      ],
      macros: {
        protein: '~44g',
        carb: '~45g',
        fat: '~19g',
        calories: '~595 kcal'
      }
    },
    carsamba: {
      dayTitle: 'Çarşamba Fit İlanı',
      chefTag: 'Ev Mutfağı &bull; Tahmini Değerler',
      courses: [
        {
          badge: 'Ana Yemek',
          title: 'İlikli Kemik Suyunda Kuru Fasulye & Izgara Tavuk',
          desc: 'Kısık ateşte kemik suyunda pişmiş İspir kuru fasulyesi ve dilimlenmiş ızgara tavuk fileto.',
          allergens: 'Alerjen: Kereviz (Kemik suyunda aroma)'
        },
        {
          badge: 'Eşlikçi',
          title: 'Tereyağlı Karabuğday (Greçka)',
          desc: 'Glutensiz, zengin lifli karabuğday pilavı.',
          allergens: 'Alerjen: Süt ürünü (Tereyağı)'
        },
        {
          badge: 'Yan Lezzet',
          title: 'Ev Yapımı Probiyotik Turşu & Çoban Salata',
          desc: 'Kaya tuzu ve fermente elma sirkesiyle hazırlanmış mor lahana ve kornişon.',
          allergens: 'Alerjen: Doğal sirke'
        }
      ],
      macros: {
        protein: '~51g',
        carb: '~52g',
        fat: '~15g',
        calories: '~610 kcal'
      }
    },
    persembe: {
      dayTitle: 'Perşembe Fit İlanı',
      chefTag: 'Ev Mutfağı &bull; Tahmini Değerler',
      courses: [
        {
          badge: 'Ana Yemek',
          title: 'Fırında Somon Fileto / Levrek',
          desc: 'Taze biberiye ve limon marinasyonlu fırın balık fileto & buharda brokoli ve havuç.',
          allergens: 'Alerjen: Balık'
        },
        {
          badge: 'Eşlikçi',
          title: 'Nar Taneli Kinoa & Yeşil Mercimek',
          desc: 'Yeşil mercimek, kinoa, taze nane ve taze soğan salatası.',
          allergens: 'Alerjen: Yok (Glutensiz tahıl)'
        },
        {
          badge: 'Yan Lezzet',
          title: 'Tahinli Limonlu Ev Sosu',
          desc: 'Saf susam tahini, taze limon suyu ve ezilmiş sarımsak.',
          allergens: 'Alerjen: Susam (Tahin)'
        }
      ],
      macros: {
        protein: '~43g',
        carb: '~34g',
        fat: '~22g',
        calories: '~540 kcal'
      }
    },
    cuma: {
      dayTitle: 'Cuma Fit İlanı',
      chefTag: 'Ev Mutfağı &bull; Tahmini Değerler',
      courses: [
        {
          badge: 'Ana Yemek',
          title: 'Sebzeli Anne Tas Kebabı (Dana But)',
          desc: 'Kısık ateşte arpacık soğan ve taze sebzelerle pişen dana but & arpa şehriyeli bulgur.',
          allergens: 'Alerjen: Gluten (Arpa şehriye & bulgur)'
        },
        {
          badge: 'Eşlikçi',
          title: 'Zeytinyağlı Enginar Kalbi & Dereotu',
          desc: 'Taze enginar, bezelye, havuç ve bol dereotu.',
          allergens: 'Alerjen: Yok'
        },
        {
          badge: 'Yan Lezzet',
          title: 'Köz Patlıcanlı Süzme Haydari',
          desc: 'Közlenmiş patlıcan, süzme yoğurt, nane ve sızma zeytinyağı.',
          allergens: 'Alerjen: Süt ürünü (Laktoz)'
        }
      ],
      macros: {
        protein: '~47g',
        carb: '~40g',
        fat: '~18g',
        calories: '~585 kcal'
      }
    }
  };

  const dayTabs = document.querySelectorAll('.day-tab');
  const activeMenuCard = document.getElementById('active-menu-card');

  function renderDayMenu(dayKey) {
    const data = weeklyFitMenuData[dayKey];
    if (!data || !activeMenuCard) return;

    activeMenuCard.innerHTML = `
      <div class="menu-card-banner">
        <div class="banner-day-title">${data.dayTitle}</div>
        <div class="banner-chef-tag">${data.chefTag}</div>
      </div>

      <div class="menu-items-grid">
        ${data.courses.map(course => `
          <div class="menu-course-item">
            <span class="course-badge">${course.badge}</span>
            <h4 class="course-title">${course.title}</h4>
            <p class="course-detail">${course.desc}</p>
            <div style="font-size: 0.6875rem; color: #C2410C; font-weight: 600; margin-top: 0.25rem;">
              ⚠️ ${course.allergens}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="menu-card-macros-footer">
        <div class="macros-footer-title">Tahmini Porsiyon Besin Değerleri (Laboratuvar Ölçümü Değildir)</div>
        <div class="macros-stats-grid">
          <div class="macro-box macro-box-highlight">
            <span class="macro-box-val">${data.macros.protein}</span>
            <span class="macro-box-lbl">Tahmini Protein</span>
          </div>
          <div class="macro-box">
            <span class="macro-box-val">${data.macros.carb}</span>
            <span class="macro-box-lbl">Tahmini Karb</span>
          </div>
          <div class="macro-box">
            <span class="macro-box-val">${data.macros.fat}</span>
            <span class="macro-box-lbl">Tahmini Yağ</span>
          </div>
          <div class="macro-box">
            <span class="macro-box-val">${data.macros.calories}</span>
            <span class="macro-box-lbl">Tahmini Kalori</span>
          </div>
        </div>
      </div>
    `;
  }

  // İlk yüklemede Pazartesi menüsünü göster
  renderDayMenu('pazartesi');

  // Gün sekmesi tıklamaları
  dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dayTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const selectedDay = tab.getAttribute('data-day');
      renderDayMenu(selectedDay);
    });
  });

  /* ==========================================================================
     3. Sıkça Sorulan Sorular (FAQ) Akordiyon Mantığı
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherTrigger = otherItem.querySelector('.faq-trigger');
            const otherContent = otherItem.querySelector('.faq-content');
            if (otherTrigger) {
              otherTrigger.setAttribute('aria-expanded', 'false');
              const icon = otherTrigger.querySelector('.faq-icon');
              if (icon) icon.innerHTML = '+';
            }
            if (otherContent) otherContent.hidden = true;
          }
        });

        trigger.setAttribute('aria-expanded', !isExpanded);
        item.classList.toggle('active', !isExpanded);
        content.hidden = isExpanded;
        const icon = trigger.querySelector('.faq-icon');
        if (icon) {
          icon.innerHTML = !isExpanded ? '&minus;' : '+';
        }
      });
    }
  });

  /* ==========================================================================
     4. API, Kota Yönetimi ve Dinamik RSS Entegrasyon Alanı
     ========================================================================== */
  const quotaProgressBar = document.getElementById('quota-progress-bar');
  const quotaUsageText = document.getElementById('quota-usage-text');
  const quotaStatusBadge = document.getElementById('quota-status-badge');
  const ietfStatusDisplay = document.getElementById('ietf-status-display');
  const ratelimitHeaderInfo = document.getElementById('ratelimit-header-info');
  const backoffStatusDisplay = document.getElementById('backoff-status-display');
  const quotaWarningBanner = document.getElementById('quota-warning-banner');
  const quotaWarningMessage = document.getElementById('quota-warning-message');

  const rssUrlInput = document.getElementById('rss-url-input');
  const btnFetchFeed = document.getElementById('btn-fetch-feed');
  const feedResultsContainer = document.getElementById('feed-results-container');

  const quotaManager = new AnneMenuAPI.QuotaManager({ maxQuota: 50 });
  const rssService = new AnneMenuAPI.RssFeedService(quotaManager);

  quotaManager.subscribe((event) => {
    const state = quotaManager.getState();

    if (quotaProgressBar) {
      quotaProgressBar.style.width = `${state.percent}%`;
      if (state.percent >= 80) {
        quotaProgressBar.style.backgroundColor = '#DC2626';
      } else if (state.percent >= 60) {
        quotaProgressBar.style.backgroundColor = '#D97706';
      } else {
        quotaProgressBar.style.backgroundColor = '#2D8A61';
      }
    }

    if (quotaUsageText) {
      quotaUsageText.textContent = `${state.requestCount} / ${state.maxQuota} İstek (%${state.percent})`;
    }

    if (quotaStatusBadge) {
      if (state.percent >= 80) {
        quotaStatusBadge.textContent = 'Kritik (%80+)';
        quotaStatusBadge.className = 'quota-badge danger';
      } else if (state.percent >= 60) {
        quotaStatusBadge.textContent = 'Uyarı';
        quotaStatusBadge.className = 'quota-badge warning';
      } else {
        quotaStatusBadge.textContent = 'Normal';
        quotaStatusBadge.className = 'quota-badge';
      }
    }

    if (event.type === 'QUOTA_THRESHOLD_WARNING' && quotaWarningBanner) {
      quotaWarningBanner.style.display = 'flex';
      if (quotaWarningMessage) {
        quotaWarningMessage.textContent = `API kotasının %${state.percent}'ine ulaşıldı! (Kullanılan: ${state.requestCount}/${state.maxQuota}).`;
      }
    }

    if (event.type === 'HEADERS_PARSED' && ratelimitHeaderInfo) {
      ratelimitHeaderInfo.textContent = `Kalan: ${event.state.remaining !== null ? event.state.remaining : 'N/A'}`;
    }
  });

  /**
   * KESİN KURAL: Kurgusal Veri (Mock Data) Yasaktır!
   */
  function renderEmptyState(customMessage = null) {
    if (!feedResultsContainer) return;
    const message = customMessage || 'Şu anda gösterilecek aktif haber veya bülten akışı bulunmamaktadır. Dinamik veri kaynağı yapılandırılmamış veya yanıt vermemektedir.';
    
    feedResultsContainer.innerHTML = `
      <div class="empty-state-card" role="status">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3 class="empty-state-title">Veri mevcut değil</h3>
        <p class="empty-state-desc">${message}</p>
      </div>
    `;
  }

  function renderFeedItems(items, feedInfo) {
    if (!feedResultsContainer) return;

    if (!items || items.length === 0) {
      renderEmptyState('Belirtilen RSS kaynağında yayınlanmış içerik bulunamadı.');
      return;
    }

    const itemsHtml = items.slice(0, 4).map(item => {
      const pubDate = item.pubDate ? new Date(item.pubDate).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Tarih belirtilmedi';

      const cleanTitle = item.title || 'Başlıksız Yazı';
      const itemLink = item.link || '#';

      return `
        <article class="feed-article-card">
          <div>
            <div class="feed-article-date">${pubDate}</div>
            <h4 class="feed-article-title">${cleanTitle}</h4>
          </div>
          <a href="${itemLink}" target="_blank" rel="noopener noreferrer" class="feed-article-link">
            Yazıyı Oku &rarr;
          </a>
        </article>
      `;
    }).join('');

    feedResultsContainer.innerHTML = `
      <div class="feed-items-grid">
        ${itemsHtml}
      </div>
    `;
  }

  if (btnFetchFeed) {
    btnFetchFeed.addEventListener('click', async () => {
      const targetUrl = rssUrlInput ? rssUrlInput.value.trim() : '';

      if (!targetUrl) {
        if (ietfStatusDisplay) ietfStatusDisplay.textContent = 'Hedef URL Boş';
        renderEmptyState('Lütfen sorgulamak istediğiniz geçerli bir RSS kaynağı URL\'si giriniz.');
        return;
      }

      btnFetchFeed.disabled = true;
      btnFetchFeed.innerHTML = '<span>Sorgulanıyor...</span>';

      try {
        const result = await rssService.fetchFeed(targetUrl, {
          onStatusUpdate: (info) => {
            if (ietfStatusDisplay) {
              if (info.status === 'FETCHING') {
                ietfStatusDisplay.textContent = `İstek Gönderiliyor (Deneme: ${info.attempt + 1})`;
              } else if (info.status === 'SUCCESS') {
                ietfStatusDisplay.textContent = `${info.code} ${info.statusText}`;
              }
            }
          },
          onRetry: (retryInfo) => {
            if (backoffStatusDisplay) {
              backoffStatusDisplay.textContent = `Bekleniyor: ${retryInfo.delayMs}ms (${retryInfo.attempt}/${retryInfo.maxRetries})`;
            }
            if (ietfStatusDisplay) {
              ietfStatusDisplay.textContent = `Geri Çekilme: HTTP ${retryInfo.status}`;
            }
          }
        });

        if (backoffStatusDisplay) {
          backoffStatusDisplay.textContent = 'Normal (0ms)';
        }

        if (result && result.items && result.items.length > 0) {
          renderFeedItems(result.items, result.feed);
        } else {
          renderEmptyState('RSS kaynağında gösterilecek girdi bulunmamaktadır.');
        }

      } catch (err) {
        console.error('[AnneMenu] API veya Besleme Hatası:', err);
        if (ietfStatusDisplay) {
          ietfStatusDisplay.textContent = err.status ? `HTTP ${err.status}` : 'Bağlantı Hatası';
        }
        renderEmptyState(`Veri kaynağına bağlanılamadı (${err.message || 'Bilinmeyen hata'}).`);
      } finally {
        btnFetchFeed.disabled = false;
        btnFetchFeed.innerHTML = '<span>Akışı Yenile</span>';
      }
    });
  }

  // Varsayılan durumda katı kural gereği kurgusal veri üretilmez, boş durum render edilir
  renderEmptyState('Şu anda dinamik bir RSS kaynağı bağlanmamıştır. Yukarıdaki alana geçerli bir RSS adresi girerek canlı akışı test edebilirsiniz.');

});
