(function () {
  'use strict';

  // Replace with your Cloudflare Worker URL after deployment
  var WORKER_URL = 'https://klimis-chatbot.kgkatidis.workers.dev';

  var ACCENT = '#F96D00';
  var DARK   = '#343a40';

  var SUGGESTIONS = [
    'Τι είναι η ΓΣΘ;',
    'Πώς κλείνω ραντεβού;',
    'Τι είναι η EMDR;',
    'Πού βρίσκεστε;'
  ];

  var WELCOME = 'Γεια σας! Είμαι ο AI βοηθός του Κλήμη Γιαμουρίδη. Μπορώ να απαντήσω σε ερωτήσεις για τις υπηρεσίες, τη θεραπεία ή πώς να κλείσετε ραντεβού. Πώς μπορώ να βοηθήσω;';

  var css = '\
    #kg-fab {\
      position: fixed; bottom: 24px; right: 24px;\
      width: 56px; height: 56px; border-radius: 50%;\
      background: ' + ACCENT + '; border: none; cursor: pointer;\
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);\
      z-index: 9999; display: flex; align-items: center; justify-content: center;\
      transition: transform 0.2s;\
    }\
    #kg-fab:hover { transform: scale(1.08); }\
    #kg-fab svg { width: 26px; height: 26px; fill: #fff; }\
    #kg-panel {\
      position: fixed; bottom: 92px; right: 24px;\
      width: 320px; height: 460px;\
      background: #fff; border-radius: 16px;\
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);\
      z-index: 9998; display: none; flex-direction: column;\
      overflow: hidden; font-family: Roboto, sans-serif;\
    }\
    #kg-panel.kg-open { display: flex; }\
    #kg-hdr {\
      background: ' + DARK + '; color: #fff;\
      padding: 12px 14px; display: flex; align-items: center; gap: 10px;\
    }\
    #kg-hdr img { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; }\
    #kg-hdr-text { flex: 1; }\
    #kg-hdr-name { font-weight: 600; font-size: 14px; }\
    #kg-hdr-sub  { font-size: 11px; color: rgba(255,255,255,0.65); }\
    #kg-x { background: none; border: none; color: #fff; cursor: pointer; font-size: 22px; line-height: 1; padding: 0; }\
    #kg-msgs {\
      flex: 1; overflow-y: auto; padding: 14px 12px;\
      display: flex; flex-direction: column; gap: 10px;\
    }\
    .kg-m {\
      max-width: 82%; padding: 9px 13px;\
      border-radius: 14px; font-size: 13px; line-height: 1.55;\
    }\
    .kg-m.kg-bot { background: #f0f2f5; color: #222; align-self: flex-start; border-bottom-left-radius: 4px; }\
    .kg-m.kg-usr { background: ' + ACCENT + '; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }\
    #kg-typing {\
      display: flex; gap: 4px; align-items: center;\
      padding: 10px 14px; background: #f0f2f5;\
      border-radius: 14px; border-bottom-left-radius: 4px;\
      align-self: flex-start;\
    }\
    #kg-typing span {\
      width: 7px; height: 7px; background: #aaa;\
      border-radius: 50%; animation: kg-b 1.2s infinite;\
    }\
    #kg-typing span:nth-child(2) { animation-delay: 0.2s; }\
    #kg-typing span:nth-child(3) { animation-delay: 0.4s; }\
    @keyframes kg-b {\
      0%,60%,100% { transform: translateY(0); }\
      30% { transform: translateY(-6px); }\
    }\
    #kg-chips { padding: 0 12px 8px; display: flex; flex-wrap: wrap; gap: 6px; }\
    .kg-chip {\
      background: #fff; border: 1px solid ' + ACCENT + ';\
      color: ' + ACCENT + '; border-radius: 16px;\
      padding: 5px 11px; font-size: 12px; cursor: pointer;\
      transition: background 0.15s; font-family: inherit;\
    }\
    .kg-chip:hover { background: ' + ACCENT + '; color: #fff; }\
    #kg-row {\
      display: flex; padding: 10px 12px;\
      border-top: 1px solid #eee; gap: 8px;\
    }\
    #kg-inp {\
      flex: 1; border: 1px solid #ddd; border-radius: 20px;\
      padding: 8px 14px; font-size: 13px; outline: none;\
      font-family: inherit;\
    }\
    #kg-inp:focus { border-color: ' + ACCENT + '; }\
    #kg-btn {\
      width: 36px; height: 36px; background: ' + ACCENT + ';\
      border: none; border-radius: 50%; cursor: pointer;\
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\
    }\
    #kg-btn svg { width: 16px; height: 16px; fill: #fff; }\
    #kg-btn:disabled { background: #ccc; cursor: not-allowed; }\
    @media (max-width: 400px) {\
      #kg-panel { width: calc(100vw - 20px); right: 10px; bottom: 82px; }\
      #kg-fab   { right: 14px; bottom: 14px; }\
    }\
  ';

  function buildUI() {
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);

    var fab = document.createElement('button');
    fab.id = 'kg-fab';
    fab.setAttribute('aria-label', 'Άνοιγμα βοηθού');
    fab.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>';
    document.body.appendChild(fab);

    var panel = document.createElement('div');
    panel.id = 'kg-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'AI Βοηθός');
    panel.innerHTML =
      '<div id="kg-hdr">' +
        '<img src="images/logo_50x50.png" alt="Κλήμης Γιαμουρίδης">' +
        '<div id="kg-hdr-text">' +
          '<div id="kg-hdr-name">AI Βοηθός</div>' +
          '<div id="kg-hdr-sub">Κλήμης Γιαμουρίδης, Ψυχολόγος</div>' +
        '</div>' +
        '<button id="kg-x" aria-label="Κλείσιμο">&times;</button>' +
      '</div>' +
      '<div id="kg-msgs" role="log" aria-live="polite"></div>' +
      '<div id="kg-chips"></div>' +
      '<div id="kg-row">' +
        '<input id="kg-inp" type="text" placeholder="Γράψε την ερώτησή σου…" autocomplete="off" maxlength="300">' +
        '<button id="kg-btn" aria-label="Αποστολή"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>' +
      '</div>';
    document.body.appendChild(panel);
  }

  function init() {
    buildUI();

    var panel   = document.getElementById('kg-panel');
    var msgs    = document.getElementById('kg-msgs');
    var inp     = document.getElementById('kg-inp');
    var btn     = document.getElementById('kg-btn');
    var chips   = document.getElementById('kg-chips');
    var fab     = document.getElementById('kg-fab');
    var closeX  = document.getElementById('kg-x');
    var history = [];
    var opened  = false;

    function toggle() {
      opened = !opened;
      panel.classList.toggle('kg-open', opened);
      if (opened && msgs.children.length === 0) {
        addMsg('bot', WELCOME);
        showChips();
      }
      if (opened) inp.focus();
    }

    function addMsg(who, text) {
      var d = document.createElement('div');
      d.className = 'kg-m ' + (who === 'bot' ? 'kg-bot' : 'kg-usr');
      d.textContent = text;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function showTyping() {
      var d = document.createElement('div');
      d.id = 'kg-typing';
      d.innerHTML = '<span></span><span></span><span></span>';
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function hideTyping() {
      var t = document.getElementById('kg-typing');
      if (t) t.parentNode.removeChild(t);
    }

    function showChips() {
      chips.innerHTML = '';
      SUGGESTIONS.forEach(function (s) {
        var c = document.createElement('button');
        c.className = 'kg-chip';
        c.textContent = s;
        c.addEventListener('click', function () {
          chips.innerHTML = '';
          send(s);
        });
        chips.appendChild(c);
      });
    }

    function send(text) {
      text = (text || inp.value).trim();
      if (!text) return;
      inp.value = '';
      btn.disabled = true;
      chips.innerHTML = '';
      addMsg('user', text);
      history.push({ role: 'user', content: text });
      showTyping();

      var payload = JSON.stringify({ message: text, history: history.slice(-8) });

      var xhr = new XMLHttpRequest();
      xhr.open('POST', WORKER_URL, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        hideTyping();
        try {
          var data = JSON.parse(xhr.responseText);
          addMsg('bot', data.reply);
          history.push({ role: 'assistant', content: data.reply });
        } catch (e) {
          addMsg('bot', 'Παρουσιάστηκε σφάλμα. Καλέστε στο +30 69 48 071 449.');
        }
        btn.disabled = false;
        inp.focus();
      };
      xhr.onerror = function () {
        hideTyping();
        addMsg('bot', 'Δεν ήταν δυνατή η σύνδεση. Καλέστε στο +30 69 48 071 449.');
        btn.disabled = false;
      };
      xhr.send(payload);
    }

    fab.addEventListener('click', toggle);
    closeX.addEventListener('click', toggle);
    btn.addEventListener('click', function () { send(); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
