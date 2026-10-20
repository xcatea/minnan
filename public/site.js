// minnan.org — small site behaviours. No framework, no tracking.

// Mobile menu
(function () {
  var btn = document.querySelector('.menu-btn');
  var menu = document.querySelector('.nav-links');
  if (!btn || !menu) return;
  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

// Chhun-hong letter sign-up: submit in place, fall back to a normal POST without JS.
(function () {
  var MESSAGES = {
    ok: 'You’re on the list. The next Chhun-hong letter will come to your inbox.',
    already: 'This address is already on the list. The next letter will reach you.',
    invalid: 'That email address doesn’t look complete. Check it and try again.',
    closed: 'Sign-ups open shortly. Please try again in a few days.',
    error: 'The sign-up didn’t go through. Try again in a moment.',
  };
  document.querySelectorAll('form[data-subscribe]').forEach(function (form) {
    var status = form.parentElement.querySelector('.sub-status');
    var button = form.querySelector('button');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      button.disabled = true;
      fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })
        .then(function (r) { return r.json().catch(function () { return { status: 'error' }; }); })
        .catch(function () { return { status: 'error' }; })
        .then(function (data) {
          var key = MESSAGES[data.status] ? data.status : 'error';
          if (status) {
            status.textContent = MESSAGES[key];
            status.dataset.tone = key === 'ok' || key === 'already' ? 'ok' : 'error';
          }
          if (key === 'ok' || key === 'already') form.reset();
          button.disabled = false;
        });
    });
  });
})();

// Wordbook: filter by port and search.
(function () {
  var table = document.querySelector('[data-wordbook]');
  if (!table) return;
  var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
  var buttons = document.querySelectorAll('[data-port-filter]');
  var search = document.querySelector('[data-word-search]');
  var count = document.querySelector('[data-word-count]');
  var port = 'all';
  function apply() {
    var q = (search && search.value || '').trim().toLowerCase();
    var shown = 0;
    rows.forEach(function (row) {
      var inPort = port === 'all' || row.dataset.ports.split(' ').indexOf(port) !== -1;
      var inText = !q || row.textContent.toLowerCase().indexOf(q) !== -1;
      row.hidden = !(inPort && inText);
      if (!row.hidden) shown++;
    });
    if (count) count.textContent = shown === 1 ? '1 word' : shown + ' words';
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      port = b.dataset.portFilter;
      buttons.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      apply();
    });
  });
  if (search) search.addEventListener('input', apply);
  apply();
})();

// Thanks page: show the result of a no-JS sign-up.
(function () {
  var el = document.querySelector('[data-thanks]');
  if (!el) return;
  var s = new URLSearchParams(location.search).get('s');
  var ref = new URLSearchParams(location.search).get('ref');
  var map = {
    order: ['Request ' + (ref || '') + ' received.', 'We will write to you within 24 hours to confirm, then send the PayPal link.'],
    ok: ['You’re on the list.', 'The next Chhun-hong letter will come to your inbox.'],
    already: ['You’re already on the list.', 'The next letter will reach you.'],
    invalid: ['That address didn’t work.', 'Go back, check the email address, and try again.'],
    closed: ['Sign-ups open shortly.', 'Please try again in a few days.'],
    error: ['The sign-up didn’t go through.', 'Go back and try again in a moment.'],
  };
  var m = map[s] || map.ok;
  el.querySelector('h1').textContent = m[0];
  el.querySelector('p').textContent = m[1];
})();

// Order requests on item pages.
(function () {
  document.querySelectorAll('form[data-order]').forEach(function (form) {
    var status = form.querySelector('.order-status');
    var button = form.querySelector('button[type=submit]');
    var wa = document.querySelector('[data-wa-base]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      button.disabled = true;
      status.textContent = '';
      fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        .then(function (r) { return r.json().catch(function () { return { status: 'error' }; }); })
        .catch(function () { return { status: 'error' }; })
        .then(function (d) {
          button.disabled = false;
          status.innerHTML = '';
          var strong = document.createElement('strong');
          var p = document.createElement('span');
          if (d.status === 'ok') {
            strong.textContent = 'Request ' + d.ref + ' received.';
            p.textContent = ' We will write to you within 24 hours to confirm, then send the PayPal link.';
            status.dataset.tone = 'ok';
            form.querySelectorAll('input:not([type=hidden]),textarea').forEach(function (el) { el.value = ''; });
          } else if (d.status === 'invalid') {
            strong.textContent = 'Check the form.';
            p.textContent = ' ' + (d.message || 'Your name, a valid email and a country are needed.');
            status.dataset.tone = 'error';
          } else {
            strong.textContent = 'The request didn’t go through.';
            p.textContent = wa ? ' Message us on WhatsApp instead — the button is just below.' : ' Email us instead, or try again in a moment.';
            status.dataset.tone = 'error';
          }
          status.appendChild(strong);
          status.appendChild(p);
        });
    });
  });
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      try { navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'Copied'; } catch (e) {}
    });
  });
})();

// 問 · Ask: the assistant panel.
(function () {
  var root = document.querySelector('[data-ask]');
  if (!root) return;
  var fab = root.querySelector('.ask-fab');
  var panel = root.querySelector('.ask-panel');
  var log = root.querySelector('[data-ask-log]');
  var chips = root.querySelector('[data-ask-chips]');
  var form = root.querySelector('[data-ask-form]');
  var input = form.querySelector('textarea');
  var send = form.querySelector('button');
  var waBase = (root.querySelector('[data-wa-base]') || {}).dataset;
  waBase = waBase && waBase.waBase;
  var KEY = 'minnan-ask-v1';
  var history = [];
  try { history = JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch (e) { history = []; }

  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(history.slice(-16))); } catch (e) {} }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function format(text) {
    return esc(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s<)&]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/(^|[\s(])(\/(?:shop|tongue|roots|faith|taste|houses|letters|stories|contact|ports|about)\/[a-z0-9\-\/#]*)/g, '$1<a href="$2">minnan.org$2</a>')
      .split(/\n{2,}/).map(function (p) { return '<p>' + p.replace(/\n/g, '<br>') + '</p>'; }).join('');
  }
  function add(role, text, actions) {
    var div = document.createElement('div');
    div.className = 'msg ' + (role === 'user' ? 'me' : 'bot');
    div.innerHTML = role === 'user' ? '<p>' + esc(text) + '</p>' : format(text);
    if (actions && actions.length) {
      var a = document.createElement('div');
      a.className = 'acts';
      actions.forEach(function (x) {
        var l = document.createElement('a');
        l.href = x.href; l.textContent = x.label;
        if (/^https?:/.test(x.href)) { l.target = '_blank'; l.rel = 'noopener'; }
        a.appendChild(l);
      });
      div.appendChild(a);
    }
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }
  history.forEach(function (m) { add(m.role, m.content, m.actions); });
  if (history.length) chips.hidden = true;

  function open(state) {
    panel.hidden = !state;
    fab.setAttribute('aria-expanded', String(state));
    if (state) { input.focus(); log.scrollTop = log.scrollHeight; }
  }
  fab.addEventListener('click', function () { open(panel.hidden); });
  root.querySelector('.ask-close').addEventListener('click', function () { open(false); fab.focus(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { open(false); fab.focus(); } });

  function ask(q) {
    q = q.trim();
    if (!q) return;
    chips.hidden = true;
    add('user', q);
    history.push({ role: 'user', content: q });
    save();
    input.value = '';
    send.disabled = true;
    var wait = add('bot', '…');
    wait.classList.add('wait');
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ messages: history.map(function (m) { return { role: m.role, content: m.content }; }), page: location.pathname }),
    })
      .then(function (r) { return r.json(); })
      .catch(function () { return { reply: 'The connection dropped. Try again, or message a person below.' }; })
      .then(function (d) {
        wait.remove();
        var actions = (d.actions || []).slice();
        if (d.handoff && waBase) {
          actions.push({ label: 'Continue on WhatsApp', href: 'https://wa.me/' + waBase + '?text=' + encodeURIComponent('Hello minnan.org, ' + q) });
        }
        var text = d.reply || 'Sorry, I could not answer that. A person can — use the buttons below.';
        add('bot', text, actions);
        history.push({ role: 'assistant', content: text, actions: actions });
        save();
        send.disabled = false;
        input.focus();
      });
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(input.value); }
  });
  chips.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { ask(b.textContent); }); });
})();
