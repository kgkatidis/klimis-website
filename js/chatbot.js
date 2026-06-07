(function () {
  'use strict';

  var WORKER_URL = 'https://klimis-chatbot.kgkatidis.workers.dev';

  var SUGGESTIONS = [
    'Τι είναι η ΓΣΘ;',
    'Πώς κλείνω ραντεβού;',
    'Τι είναι η EMDR;',
    'Πού βρίσκεστε;'
  ];

  var WELCOME = 'Γεια σας! Είμαι ο AI βοηθός του Κλήμη Γιαμουρίδη. Μπορώ να απαντήσω σε ερωτήσεις για τις υπηρεσίες, τη θεραπεία ή πώς να κλείσετε ραντεβού. Πώς μπορώ να βοηθήσω;';

  var css = [
    /* === FAB button === */
    '#kg-fab {',
    '  position: fixed; bottom: 28px; right: 28px;',
    '  width: 60px; height: 60px; border-radius: 50%;',
    '  background: linear-gradient(135deg, #F96D00, #d95c00);',
    '  border: none; cursor: pointer;',
    '  box-shadow: 0 4px 18px rgba(249,109,0,0.45), 0 2px 6px rgba(0,0,0,0.12);',
    '  z-index: 9999; display: flex; align-items: center; justify-content: center;',
    '  transition: transform 0.25s, box-shadow 0.25s;',
    '  animation: kg-pulse 3.5s ease-in-out infinite;',
    '}',
    '#kg-fab:hover { transform: scale(1.1); box-shadow: 0 6px 24px rgba(249,109,0,0.55); animation: none; }',
    '#kg-fab svg { width: 27px; height: 27px; fill: #fff; }',
    '@keyframes kg-pulse {',
    '  0%,100% { box-shadow: 0 4px 18px rgba(249,109,0,0.45), 0 0 0 0 rgba(249,109,0,0.25); }',
    '  50%     { box-shadow: 0 4px 18px rgba(249,109,0,0.45), 0 0 0 11px rgba(249,109,0,0); }',
    '}',

    /* === Panel === */
    '#kg-panel {',
    '  position: fixed; bottom: 102px; right: 28px;',
    '  width: 330px;',
    '  background: #f5f9f7; border-radius: 22px;',
    '  box-shadow: 0 16px 48px rgba(30,60,50,0.16), 0 2px 10px rgba(30,60,50,0.08);',
    '  z-index: 9998; display: none; flex-direction: column;',
    '  overflow: hidden; font-family: Roboto, sans-serif;',
    '  opacity: 0; transform: translateY(18px);',
    '  transition: opacity 0.3s ease, transform 0.3s ease;',
    '}',
    '#kg-panel.kg-open { display: flex; opacity: 1; transform: translateY(0); }',

    /* === Header === */
    '#kg-hdr {',
    '  background: linear-gradient(135deg, #234d42 0%, #3a7566 100%);',
    '  color: #fff; padding: 15px 16px;',
    '  display: flex; align-items: center; gap: 12px; flex-shrink: 0;',
    '}',
    '#kg-avatar { position: relative; flex-shrink: 0; }',
    '#kg-hdr img {',
    '  width: 40px; height: 40px; border-radius: 50%;',
    '  object-fit: cover; border: 2px solid rgba(255,255,255,0.35);',
    '}',
    '#kg-dot {',
    '  position: absolute; bottom: 1px; right: 1px;',
    '  width: 11px; height: 11px; border-radius: 50%;',
    '  background: #6ee7b7; border: 2px solid #234d42;',
    '  animation: kg-dot-pulse 2.8s ease-in-out infinite;',
    '}',
    '@keyframes kg-dot-pulse {',
    '  0%,100% { opacity: 1; transform: scale(1); }',
    '  50%     { opacity: 0.6; transform: scale(0.88); }',
    '}',
    '#kg-hdr-text { flex: 1; }',
    '#kg-hdr-name { font-weight: 600; font-size: 14px; letter-spacing: 0.2px; }',
    '#kg-hdr-sub  { font-size: 11px; color: rgba(255,255,255,0.7); margin-top: 2px; }',
    '#kg-x {',
    '  background: rgba(255,255,255,0.12); border: none; color: #fff;',
    '  cursor: pointer; width: 30px; height: 30px; border-radius: 50%;',
    '  display: flex; align-items: center; justify-content: center;',
    '  font-size: 19px; line-height: 1; padding: 0;',
    '  transition: background 0.2s; flex-shrink: 0;',
    '}',
    '#kg-x:hover { background: rgba(255,255,255,0.25); }',

    /* === Messages area === */
    '#kg-msgs {',
    '  flex: 1; overflow-y: auto; padding: 18px 14px 10px;',
    '  display: flex; flex-direction: column; gap: 12px;',
    '  max-height: 320px;',
    '  scrollbar-width: thin; scrollbar-color: #b5d4ca transparent;',
    '}',
    '#kg-msgs::-webkit-scrollbar { width: 4px; }',
    '#kg-msgs::-webkit-scrollbar-track { background: transparent; }',
    '#kg-msgs::-webkit-scrollbar-thumb { background: #b5d4ca; border-radius: 4px; }',

    /* === Message bubbles === */
    '.kg-m {',
    '  max-width: 84%; padding: 11px 15px;',
    '  border-radius: 18px; font-size: 13.5px; line-height: 1.65;',
    '  animation: kg-fadein 0.28s ease;',
    '}',
    '@keyframes kg-fadein {',
    '  from { opacity: 0; transform: translateY(7px); }',
    '  to   { opacity: 1; transform: translateY(0); }',
    '}',
    '.kg-m.kg-bot {',
    '  background: #ffffff; color: #253d35;',
    '  align-self: flex-start; border-bottom-left-radius: 5px;',
    '  box-shadow: 0 2px 10px rgba(35,77,66,0.09);',
    '}',
    '.kg-m.kg-usr {',
    '  background: linear-gradient(135deg, #F96D00, #d95e00);',
    '  color: #fff; align-self: flex-end; border-bottom-right-radius: 5px;',
    '  box-shadow: 0 2px 10px rgba(249,109,0,0.28);',
    '}',

    /* === Typing indicator === */
    '#kg-typing {',
    '  display: flex; gap: 5px; align-items: center;',
    '  padding: 12px 16px; background: #fff;',
    '  border-radius: 18px; border-bottom-left-radius: 5px;',
    '  align-self: flex-start;',
    '  box-shadow: 0 2px 10px rgba(35,77,66,0.09);',
    '  animation: kg-fadein 0.28s ease;',
    '}',
    '#kg-typing span {',
    '  width: 7px; height: 7px; background: #8abfb2;',
    '  border-radius: 50%; animation: kg-b 1.4s ease-in-out infinite;',
    '}',
    '#kg-typing span:nth-child(2) { animation-delay: 0.22s; }',
    '#kg-typing span:nth-child(3) { animation-delay: 0.44s; }',
    '@keyframes kg-b {',
    '  0%,60%,100% { transform: translateY(0); opacity: 0.5; }',
    '  30% { transform: translateY(-7px); opacity: 1; }',
    '}',

    /* === Quick reply chips === */
    '#kg-chips { padding: 4px 14px 10px; display: flex; flex-wrap: wrap; gap: 7px; }',
    '.kg-chip {',
    '  background: #fff; border: 1.5px solid #7ab5a8;',
    '  color: #2c6b5a; border-radius: 20px;',
    '  padding: 6px 13px; font-size: 12px; cursor: pointer;',
    '  transition: all 0.2s; font-family: inherit;',
    '  box-shadow: 0 1px 4px rgba(35,77,66,0.07);',
    '}',
    '.kg-chip:hover { background: #3a7566; color: #fff; border-color: #3a7566; }',

    /* === Input row === */
    '#kg-row {',
    '  display: flex; padding: 10px 12px 14px; gap: 8px;',
    '  background: #fff; border-top: 1px solid #deeee9; flex-shrink: 0;',
    '}',
    '#kg-inp {',
    '  flex: 1; border: 1.5px solid #c0d9d1; border-radius: 22px;',
    '  padding: 9px 16px; font-size: 13px; outline: none;',
    '  font-family: inherit; background: #f5f9f7; color: #253d35;',
    '  transition: border-color 0.2s, background 0.2s;',
    '}',
    '#kg-inp:focus { border-color: #3a7566; background: #fff; }',
    '#kg-inp::placeholder { color: #9bbdb5; }',
    '#kg-btn {',
    '  width: 38px; height: 38px;',
    '  background: linear-gradient(135deg, #3a7566, #234d42);',
    '  border: none; border-radius: 50%; cursor: pointer;',
    '  display: flex; align-items: center; justify-content: center;',
    '  flex-shrink: 0; transition: transform 0.2s, opacity 0.2s;',
    '  box-shadow: 0 2px 8px rgba(35,77,66,0.3);',
    '}',
    '#kg-btn:hover { transform: scale(1.08); }',
    '#kg-btn svg { width: 16px; height: 16px; fill: #fff; }',
    '#kg-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }',

    /* === Mobile === */
    '@media (max-width: 420px) {',
    '  #kg-panel { width: calc(100vw - 24px); right: 12px; bottom: 88px; }',
    '  #kg-fab   { right: 16px; bottom: 16px; }',
    '}'
  ].join('\n');

  /* ------------------------------------------------------------------ */
  /* DOM                                                                  */
  /* ------------------------------------------------------------------ */

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
    panel.setAttribute('aria-label', 'AI Βοηθός Κλήμης Γιαμουρίδης');
    panel.innerHTML =
      '<div id="kg-hdr">' +
        '<div id="kg-avatar">' +
          '<img src="images/logo_50x50.png" alt="Κλήμης Γιαμουρίδης">' +
          '<span id="kg-dot"></span>' +
        '</div>' +
        '<div id="kg-hdr-text">' +
          '<div id="kg-hdr-name">Βοηθός Κλήμη Γιαμουρίδη</div>' +
          '<div id="kg-hdr-sub">Ψυχολόγος Θεσσαλονίκη · Διαθέσιμος</div>' +
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

  /* ------------------------------------------------------------------ */
  /* Logic                                                                */
  /* ------------------------------------------------------------------ */

  function init() {
    buildUI();

    var panel  = document.getElementById('kg-panel');
    var msgs   = document.getElementById('kg-msgs');
    var inp    = document.getElementById('kg-inp');
    var btn    = document.getElementById('kg-btn');
    var chips  = document.getElementById('kg-chips');
    var fab    = document.getElementById('kg-fab');
    var closeX = document.getElementById('kg-x');
    var history = [];
    var opened  = false;

    function toggle() {
      opened = !opened;
      panel.classList.toggle('kg-open', opened);
      if (opened && msgs.children.length === 0) {
        addMsg('bot', WELCOME);
        showChips();
      }
      if (opened) { setTimeout(function() { inp.focus(); }, 320); }
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
      xhr.send(JSON.stringify({ message: text, history: history.slice(-8) }));
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
