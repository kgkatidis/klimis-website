(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     CONFIGURATION — fill in after setup
     ═══════════════════════════════════════════════════════════ */
  var GA_ID        = 'G-8RHQ23TV7P';           // Google Analytics Measurement ID
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
     2. VIBER BUTTON
     ═══════════════════════════════════════════════════════════ */
  function initViber() {
    var style = document.createElement('style');
    style.textContent = [
      '#viber-btn {',
      '  position: fixed; bottom: 100px; left: 28px; z-index: 9999;',
      '  width: 60px; height: 60px; border-radius: 50%;',
      '  background: #7360f2;',
      '  box-shadow: 0 4px 18px rgba(115,96,242,0.45), 0 2px 6px rgba(0,0,0,0.12);',
      '  display: flex; align-items: center; justify-content: center;',
      '  text-decoration: none; transition: transform 0.25s, box-shadow 0.25s;',
      '  animation: viber-pulse 3.5s ease-in-out infinite;',
      '}',
      '#viber-btn:hover { transform: scale(1.1); box-shadow: 0 6px 24px rgba(115,96,242,0.55); animation: none; }',
      '#viber-btn svg { width: 32px; height: 32px; fill: #fff; }',
      '@keyframes viber-pulse {',
      '  0%,100% { box-shadow: 0 4px 18px rgba(115,96,242,0.45), 0 0 0 0 rgba(115,96,242,0.3); }',
      '  50%     { box-shadow: 0 4px 18px rgba(115,96,242,0.45), 0 0 0 11px rgba(115,96,242,0); }',
      '}',
      '#viber-tooltip {',
      '  position: fixed; bottom: 110px; left: 98px; z-index: 9999;',
      '  background: #fff; color: #1a1a1a; font-size: 13px;',
      '  padding: 8px 14px; border-radius: 20px;',
      '  box-shadow: 0 4px 16px rgba(0,0,0,0.13);',
      '  white-space: nowrap; pointer-events: none;',
      '  opacity: 0; transition: opacity 0.25s;',
      '  font-family: Roboto, sans-serif;',
      '}',
      '#viber-btn:hover + #viber-tooltip { opacity: 1; }',
      '@media (max-width: 420px) { #viber-btn { left: 16px; bottom: 88px; } #viber-tooltip { display: none; } }'
    ].join('\n');
    document.head.appendChild(style);

    var btn = document.createElement('a');
    btn.id = 'viber-btn';
    btn.href = 'viber://chat?number=%2B306948071449';
    btn.setAttribute('aria-label', 'Επικοινωνία μέσω Viber');
    btn.innerHTML = '<svg viewBox="0 0 512 512"><path d="M444 49.9C431.3 38.2 379.9.9 265.3.4c0 0-135.1-8.1-200.9 52.3C27.8 89.3 14.9 143 13.5 209.5c-1.4 66.5-3.1 191.1 116.9 224.9h.1l-.1 51.4s-.8 20.8 12.9 25c16.6 5.2 26.4-10.7 42.3-27.8 8.7-9.4 20.7-23.2 29.8-33.7 82.2 6.9 145.3-8.9 152.5-11.2 16.6-5.4 110.5-17.4 125.7-142 15.8-128.6-7.6-209.8-49.6-246.2zm-86.9 229.1c-3.2 8.3-9.3 15-17.2 19-4.1 2.1-8.6 3.3-13.2 3.6-3.4.2-6.8-.3-9.9-1.5-10.5-3.8-20.4-8.8-29.4-15-9.2-6.3-17.5-13.8-24.6-22.3a122 122 0 01-16.5-29.6c-2.6-7.1-3.9-14.6-3.7-22.1.2-7.2 2.3-14.2 6.1-20.3 3.2-5.2 7.6-9.5 12.9-12.6 2.4-1.4 5.1-2.2 7.9-2.2 2.3 0 4.5.5 6.5 1.5 2 1 3.7 2.5 5 4.3l17.2 24.4c1.4 2 2.1 4.4 2 6.8-.1 2.5-.9 4.9-2.5 6.8l-6.7 8.2c-.9 1.1-1.3 2.5-1.1 3.9.6 3.4 2.9 7.8 6.9 13.4 4 5.7 8.3 10.1 12.9 13.2 3.2 2.1 5.9 2.6 8.1 1.5l8.9-4.7c2.1-1.1 4.5-1.4 6.8-.9 2.3.5 4.4 1.8 5.8 3.7l15.5 21.9c1.3 1.8 2 3.9 2 6.1-.1 2.4-.8 4.8-2.1 6.9zm-24.7-85.6c-1.7-15.8-8.8-29.4-21.1-40.7-12-11-26.5-17.1-43.2-18.2v-15.1c20.5 1.2 38.4 8.7 53.2 22.3 14.9 13.8 23.5 31.1 25.6 51.7h-14.5zm-30.5 0c-1.1-8.8-4.7-16.3-10.9-22.4-6-5.9-13.5-9.4-22.3-10.5v-15c12.4 1.3 23.1 6.2 31.8 14.7 8.9 8.7 14.1 19.4 15.6 32.1l-.4.4-13.8.7zm-29.3 0c-.5-3.9-2.1-7.3-4.8-10-2.7-2.7-6.2-4.3-10.1-4.6v-15.1c7.9.5 14.7 3.5 20.2 9 5.3 5.3 8.4 11.9 9.3 19.8l-14.6.9z"/></svg>';
    document.body.appendChild(btn);

    var tooltip = document.createElement('div');
    tooltip.id = 'viber-tooltip';
    tooltip.textContent = 'Στείλε μήνυμα Viber';
    document.body.appendChild(tooltip);
  }

  /* ═══════════════════════════════════════════════════════════
     3. GOOGLE ANALYTICS 4 (loads only after consent)
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
      '  padding: 0;',
      '  box-shadow: 0 -4px 24px rgba(0,0,0,0.25);',
      '  font-family: Roboto, sans-serif; font-size: 13.5px; line-height: 1.55;',
      '}',
      '#kg-cookie-top {',
      '  display: flex; align-items: center; gap: 20px; flex-wrap: wrap;',
      '  padding: 16px 24px;',
      '}',
      '#kg-cookie-top p { margin: 0; flex: 1; min-width: 220px; }',
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
      '#kg-ai-disclosure {',
      '  border-top: 1px solid rgba(255,255,255,0.08);',
      '  background: rgba(0,0,0,0.25);',
      '  padding: 12px 24px;',
      '  font-size: 11.5px; color: #9090a8; line-height: 1.6;',
      '}',
      '#kg-ai-disclosure strong { color: #b8b8d0; }',
      '@media (max-width: 500px) {',
      '  #kg-cookie-top { flex-direction: column; text-align: center; }',
      '  #kg-cookie-btns { justify-content: center; }',
      '  #kg-ai-disclosure { text-align: left; }',
      '}'
    ].join('\n');
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'kg-cookie';
    banner.innerHTML =
      '<div id="kg-cookie-top">' +
        '<p>Χρησιμοποιούμε cookies για ανάλυση επισκεψιμότητας (Google Analytics) ώστε να βελτιώνουμε το περιεχόμενο. ' +
        'Διαβάστε την <a href="/privacy.html">Πολιτική Απορρήτου</a> μας.</p>' +
        '<div id="kg-cookie-btns">' +
          '<button id="kg-accept">Αποδοχή</button>' +
          '<button id="kg-reject">Μόνο απαραίτητα</button>' +
        '</div>' +
      '</div>' +
      '<div id="kg-ai-disclosure">' +
        '<strong>Σημείωση για το περιεχόμενο του Blog:</strong> ' +
        'Ορισμένα άρθρα του ιστολογίου αυτής της ιστοσελίδας έχουν δημιουργηθεί με τη βοήθεια τεχνητής νοημοσύνης (AI) και αποσκοπούν αποκλειστικά στην παροχή γενικής ψυχοεκπαιδευτικής πληροφόρησης. ' +
        'Τα άρθρα που <strong>δεν φέρουν την υπογραφή του Ψυχολόγου Κλήμη Γιαμουρίδη</strong> είναι δημιουργήματα τεχνητής νοημοσύνης, είναι απλά ενημερωτικά και <strong>δεν αποτελούν επαγγελματική ψυχολογική γνωμάτευση, διάγνωση ή θεραπευτική σύσταση</strong>. ' +
        'Αν αντιμετωπίζετε δυσκολίες ψυχικής υγείας, παρακαλούμε να απευθυνθείτε σε εξειδικευμένο επαγγελματία υγείας.' +
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
     4. CALL BUTTON — floating click-to-call
     ═══════════════════════════════════════════════════════════ */
  function initCallButton() {
    var style = document.createElement('style');
    style.textContent = [
      '#call-btn {',
      '  position: fixed; bottom: 28px; right: 28px; z-index: 9999;',
      '  width: 60px; height: 60px; border-radius: 50%;',
      '  background: #F96D00;',
      '  box-shadow: 0 4px 18px rgba(249,109,0,0.45), 0 2px 6px rgba(0,0,0,0.12);',
      '  display: flex; align-items: center; justify-content: center;',
      '  text-decoration: none; transition: transform 0.25s, box-shadow 0.25s;',
      '  animation: call-pulse 3.5s ease-in-out infinite;',
      '}',
      '#call-btn:hover { transform: scale(1.1); box-shadow: 0 6px 24px rgba(249,109,0,0.55); animation: none; }',
      '#call-btn svg { width: 28px; height: 28px; fill: #fff; }',
      '@keyframes call-pulse {',
      '  0%,100% { box-shadow: 0 4px 18px rgba(249,109,0,0.45), 0 0 0 0 rgba(249,109,0,0.3); }',
      '  50%     { box-shadow: 0 4px 18px rgba(249,109,0,0.45), 0 0 0 11px rgba(249,109,0,0); }',
      '}',
      '#call-tooltip {',
      '  position: fixed; bottom: 38px; right: 98px; z-index: 9999;',
      '  background: #fff; color: #1a1a1a; font-size: 13px;',
      '  padding: 8px 14px; border-radius: 20px;',
      '  box-shadow: 0 4px 16px rgba(0,0,0,0.13);',
      '  white-space: nowrap; pointer-events: none;',
      '  opacity: 0; transition: opacity 0.25s;',
      '  font-family: Roboto, sans-serif;',
      '}',
      '#call-btn:hover ~ #call-tooltip { opacity: 1; }',
      '@media (max-width: 420px) { #call-btn { right: 16px; bottom: 16px; } #call-tooltip { display: none; } }'
    ].join('\n');
    document.head.appendChild(style);

    var btn = document.createElement('a');
    btn.id = 'call-btn';
    btn.href = 'tel:+306948071449';
    btn.setAttribute('aria-label', 'Καλέστε τον Κλήμη Γιαμουρίδη');
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>';
    document.body.appendChild(btn);

    var tooltip = document.createElement('div');
    tooltip.id = 'call-tooltip';
    tooltip.textContent = 'Καλέστε τώρα';
    document.body.appendChild(tooltip);
  }

  /* ═══════════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════════ */
  function run() {
    initWhatsApp();
    initViber();
    initCookieBanner();
    initCallButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
