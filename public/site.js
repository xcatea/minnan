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
  var map = {
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
