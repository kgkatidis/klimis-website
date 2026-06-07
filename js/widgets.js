(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     CONFIGURATION — fill in after setup
     ═══════════════════════════════════════════════════════════ */
  var GA_ID        = 'G-6G9VV14V5E';           // Google Analytics Measurement ID
  var CALENDLY_URL = 'https://calendly.com/kgkatidis/60min';    // Calendly URL
  var WHATSAPP_NUM = '306948071449';
  var WHATSAPP_MSG = encodeURIComponent('Γεια σας, θα ήθελα να κλείσω ένα ραντεβού.');

  /* ═══════════════════════════════════════════════════════════
     1. WHATSAPP BUTTON
     ═══════════════════════════════════════════════════════════ */
  function initWhatsApp() {
    var style = document.createElement('style');
    style.textContent = [
      '#wa-btn {',
      '  position: fixed; bottom: 28px; left: 28px; z-index: 9999;',
      '  width: 60px; height: 60px; border-radius: 50%;',
      '  background: #25D366;',
      '  box-shadow: 0 4px 18px rgba(37,211,102,0.45), 0 2px 6px rgba(0,0,0,0.12);',
      '  display: flex; align-items: center; justify-content: center;',
      '  text-decoration: none; transition: transform 0.25s, box-shadow 0.25s;',
      '  animation: wa-pulse 3.5s ease-in-out infinite;',
      '}',
      '#wa-btn:hover { transform: scale(1.1); box-shadow: 0 6px 24px rgba(37,211,102,0.55); animation: none; }',
      '#wa-btn svg { width: 32px; height: 32px; fill: #fff; }',
      '@keyframes wa-pulse {',
      '  0%,100% { box-shadow: 0 4px 18px rgba(37,211,102,0.45), 0 0 0 0 rgba(37,211,102,0.3); }',
      '  50%     { box-shadow: 0 4px 18px rgba(37,211,102,0.45), 0 0 0 11px rgba(37,211,102,0); }',
      '}',
      '#wa-tooltip {',
      '  position: fixed; bottom: 38px; left: 98px; z-index: 9999;',
      '  background: #fff; color: #1a1a1a; font-size: 13px;',
      '  padding: 8px 14px; border-radius: 20px;',
      '  box-shadow: 0 4px 16px rgba(0,0,0,0.13);',
      '  white-space: nowrap; pointer-events: none;',
      '  opacity: 0; transition: opacity 0.25s;',
      '  font-family: Roboto, sans-serif;',
      '}',
      '#wa-btn:hover + #wa-tooltip { opacity: 1; }',
      '@media (max-width: 420px) { #wa-btn { left: 16px; bottom: 16px; } #wa-tooltip { display: none; } }'
    ].join('\n');
    document.head.appendChild(style);

    var btn = document.createElement('a');
    btn.id = 'wa-btn';
    btn.href = 'https://wa.me/' + WHATSAPP_NUM + '?text=' + WHATSAPP_MSG;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.setAttribute('aria-label', 'Επικοινωνία μέσω WhatsApp');
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
    document.body.appendChild(btn);

    var tooltip = document.createElement('div');
    tooltip.id = 'wa-tooltip';
    tooltip.textContent = 'Στείλε μήνυμα WhatsApp';
    document.body.appendChild(tooltip);
  }

  /* ═══════════════════════════════════════════════════════════
     2. GOOGLE ANALYTICS 4 (loads only after consent)
     ═══════════════════════════════════════════════════════════ */
  function loadGA() {
    if (GA_ID === 'G-XXXXXXXXXX') return; // not configured yet
    if (document.getElementById('ga-script')) return; // already loaded
    var s = document.createElement('script');
    s.id = 'ga-script';
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  /* ═══════════════════════════════════════════════════════════
     3. COOKIE CONSENT BANNER
     ═══════════════════════════════════════════════════════════ */
  var COOKIE_KEY = 'kg_cookie_consent';

  function getConsent() { return localStorage.getItem(COOKIE_KEY); }
  function setConsent(val) {
    localStorage.setItem(COOKIE_KEY, val);
    var exp = new Date();
    exp.setFullYear(exp.getFullYear() + 1);
    document.cookie = COOKIE_KEY + '=' + val + '; expires=' + exp.toUTCString() + '; path=/; SameSite=Lax';
  }

  function initCookieBanner() {
    var consent = getConsent();
    if (consent === 'accepted') { loadGA(); return; }
    if (consent === 'rejected') { return; }

    var style = document.createElement('style');
    style.textContent = [
      '#kg-cookie {',
      '  position: fixed; bottom: 0; left: 0; right: 0; z-index: 99999;',
      '  background: #1e1e2e; color: #e8e8f0;',
      '  padding: 18px 24px; display: flex; align-items: center;',
      '  gap: 20px; flex-wrap: wrap;',
      '  box-shadow: 0 -4px 24px rgba(0,0,0,0.25);',
      '  font-family: Roboto, sans-serif; font-size: 13.5px; line-height: 1.55;',
      '}',
      '#kg-cookie p { margin: 0; flex: 1; min-width: 220px; }',
      '#kg-cookie a { color: #7ab5a8; text-decoration: underline; }',
      '#kg-cookie-btns { display: flex; gap: 10px; flex-shrink: 0; }',
      '#kg-accept {',
      '  background: #F96D00; color: #fff; border: none;',
      '  padding: 9px 20px; border-radius: 20px; cursor: pointer;',
      '  font-size: 13px; font-weight: 600; font-family: inherit;',
      '  transition: background 0.2s;',
      '}',
      '#kg-accept:hover { background: #d95e00; }',
      '#kg-reject {',
      '  background: transparent; color: #b0b0c0;',
      '  border: 1px solid #444; padding: 9px 18px;',
      '  border-radius: 20px; cursor: pointer;',
      '  font-size: 13px; font-family: inherit; transition: color 0.2s;',
      '}',
      '#kg-reject:hover { color: #fff; border-color: #777; }',
      '@media (max-width: 500px) {',
      '  #kg-cookie { flex-direction: column; text-align: center; }',
      '  #kg-cookie-btns { justify-content: center; }',
      '}'
    ].join('\n');
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'kg-cookie';
    banner.innerHTML =
      '<p>Χρησιμοποιούμε cookies για ανάλυση επισκεψιμότητας (Google Analytics) ώστε να βελτιώνουμε το περιεχόμενο. ' +
      'Διαβάστε την <a href="/privacy.html">Πολιτική Απορρήτου</a> μας.</p>' +
      '<div id="kg-cookie-btns">' +
        '<button id="kg-accept">Αποδοχή</button>' +
        '<button id="kg-reject">Μόνο απαραίτητα</button>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('kg-accept').addEventListener('click', function () {
      setConsent('accepted');
      loadGA();
      banner.remove();
    });
    document.getElementById('kg-reject').addEventListener('click', function () {
      setConsent('rejected');
      banner.remove();
    });
  }

  /* ═══════════════════════════════════════════════════════════
     4. CALENDLY — popup για "Κλείσε ραντεβού" buttons
     ═══════════════════════════════════════════════════════════ */
  function initCalendly() {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(link);

    var script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = function () {
      Calendly.initBadgeWidget({
        url: CALENDLY_URL,
        text: 'Κλείσε Ραντεβού',
        color: '#0069ff',
        textColor: '#ffffff',
        branding: true
      });
    };
    document.head.appendChild(script);
  }

  /* ═══════════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════════ */
  function run() {
    initWhatsApp();
    initCookieBanner();
    initCalendly();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
