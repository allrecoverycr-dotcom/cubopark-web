(function () {
  var d = document, root = d.documentElement;
  var lang = root.getAttribute('lang') === 'en' ? 'en' : 'es';
  var es = lang === 'es';
  root.classList.add('js');

  /* ---------- header ---------- */
  var hdr = d.querySelector('.hdr');
  function onScroll() { hdr.classList.toggle('solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var burger = d.querySelector('.burger');
  if (burger) burger.addEventListener('click', function () {
    var o = d.body.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', o);
  });

  /* ---------- reveal (solo desplazamiento, nunca oculta contenido) ---------- */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    d.querySelectorAll('.rv').forEach(function (el) { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('pre'); io.observe(el); } });
  }

  /* ---------- lightbox ---------- */
  var groups = {};
  d.querySelectorAll('[data-lb]').forEach(function (el) {
    var g = el.getAttribute('data-lb'); (groups[g] = groups[g] || []).push(el);
    el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button');
    function open() { showLb(g, groups[g].indexOf(el)); }
    el.addEventListener('click', open);
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); open(); } });
  });
  var lb, lbImg, lbCap, cur, curG;
  var ico = { x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    l: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 4l-8 8 8 8"/></svg>',
    r: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 4l8 8-8 8"/></svg>' };
  function showLb(g, i) {
    if (!lb) {
      lb = d.createElement('div'); lb.className = 'lb'; lb.hidden = true;
      lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
      lb.innerHTML = '<img alt=""><button class="x" aria-label="' + (es ? 'Cerrar' : 'Close') + '">' + ico.x + '</button><button class="pv" aria-label="' + (es ? 'Anterior' : 'Previous') + '">' + ico.l + '</button><button class="nx" aria-label="' + (es ? 'Siguiente' : 'Next') + '">' + ico.r + '</button><div class="cap"></div>';
      d.body.appendChild(lb); lbImg = lb.querySelector('img'); lbCap = lb.querySelector('.cap');
      lb.querySelector('.x').onclick = closeLb; lb.querySelector('.pv').onclick = function () { step(-1); }; lb.querySelector('.nx').onclick = function () { step(1); };
      lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
      d.addEventListener('keydown', function (e) { if (lb.hidden) return; if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
    }
    curG = groups[g]; cur = i; render(); lb.hidden = false; d.body.style.overflow = 'hidden'; lb.querySelector('.x').focus();
  }
  function visible() { return curG.filter(function (el) { return !el.closest('[hidden]'); }); }
  function render() { var el = curG[cur]; lbImg.src = el.getAttribute('data-full'); var c = el.getAttribute('data-cap') || ''; lbCap.textContent = c; lbImg.alt = c; }
  function step(s) { var v = visible(); var k = v.indexOf(curG[cur]); k = (k + s + v.length) % v.length; cur = curG.indexOf(v[k]); render(); }
  function closeLb() { lb.hidden = true; d.body.style.overflow = ''; }

  /* ---------- filtros galería / tabla ---------- */
  d.querySelectorAll('[data-filter-group]').forEach(function (grp) {
    var target = d.querySelector(grp.getAttribute('data-filter-group'));
    grp.querySelectorAll('[data-f]').forEach(function (b) {
      b.addEventListener('click', function () {
        grp.querySelectorAll('[data-f]').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
        var f = b.getAttribute('data-f');
        target.querySelectorAll('[data-cat]').forEach(function (it) { it.hidden = !(f === 'all' || it.getAttribute('data-cat').split(' ').indexOf(f) > -1); });
      });
    });
  });

  /* ---------- pestañas bodega ---------- */
  d.querySelectorAll('[data-tabs]').forEach(function (t) {
    t.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        t.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
        d.querySelectorAll('[data-pane]').forEach(function (p) { p.hidden = p.getAttribute('data-pane') !== b.getAttribute('data-t'); });
      });
    });
  });

  /* ---------- formulario de contacto ---------- */
  var form = d.querySelector('#lead');
  if (form) {
    var q = new URLSearchParams(location.search).get('interes');
    var sel = form.querySelector('#f-int'); if (q && sel && sel.querySelector('option[value="' + q + '"]')) sel.value = q;
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var ok = true;
      form.querySelectorAll('[required]').forEach(function (i) { var bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.setAttribute('aria-invalid', bad); if (bad) ok = false; });
      form.querySelector('.err').hidden = ok; form.querySelector('.send-err').hidden = true; if (!ok) return;
      var btn = form.querySelector('button[type="submit"]'); btn.disabled = true;
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (j) { if (!j.ok) throw 0; form.hidden = true; d.querySelector('#lead-ok').hidden = false; })
        .catch(function () { form.querySelector('.send-err').hidden = false; btn.disabled = false; });
    });
  }

  /* ---------- panorámica arrastrable ---------- */
  d.querySelectorAll('.pano').forEach(function (p) {
    var down = false, sx, sl;
    p.addEventListener('pointerdown', function (e) { down = true; sx = e.clientX; sl = p.scrollLeft; p.style.cursor = 'grabbing'; });
    window.addEventListener('pointerup', function () { down = false; p.style.cursor = ''; });
    p.addEventListener('pointermove', function (e) { if (down) p.scrollLeft = sl - (e.clientX - sx); });
    var img = p.querySelector('img');
    function center() { p.scrollLeft = (p.scrollWidth - p.clientWidth) / 2; }
    if (img && !img.complete) img.addEventListener('load', center); else center();
  });

  /* ---------- master plan interactivo ---------- */
  var plan = d.querySelector('[data-plan]');
  if (plan && window.CP_LOTS) {
    var L = window.CP_LOTS, sel = plan.getAttribute('data-plan') || 'ib7';
    var card = d.querySelector('#plan-card');
    function fmt(n, dec) { return n.toLocaleString('en-US', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 }); }
    function render() {
      var x = L[sel];
      plan.querySelectorAll('.lot').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-id') === sel); });
      plan.querySelectorAll('.tg').forEach(function (g) { g.classList.toggle('on', g.getAttribute('data-tag') === sel); });
      d.querySelectorAll('.chip[data-id]').forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-id') === sel); c.setAttribute('aria-pressed', c.getAttribute('data-id') === sel); });
      if (!card) return;
      var rows = '';
      if (x.kind === 'warehouse') {
        rows += '<dt>' + (es ? 'Construcción' : 'Building area') + '</dt><dd>' + fmt(x.built) + ' m²</dd>';
        rows += '<dt>' + (es ? 'Terreno (catastro)' : 'Land (cadastral)') + '</dt><dd>' + fmt(x.land) + ' m²</dd>';
        rows += '<dt>' + (es ? 'Alquiler' : 'Lease') + '</dt><dd>$' + x.rent + '/m² + ' + (es ? 'IVA' : 'VAT') + '</dd>';
        rows += '<dt>' + (es ? 'Mantenimiento' : 'Maintenance') + '</dt><dd>$' + x.fee + '/m²</dd>';
      } else {
        rows += '<dt>' + (es ? 'Área de la finca' : 'Lot area') + '</dt><dd>' + fmt(x.lot, 2) + ' m²</dd>';
        if (x.green) rows += '<dt>' + (es ? 'Zona verde A.C.L.R.' : 'A.C.L.R. green zone') + '</dt><dd>' + fmt(x.green, 2) + ' m²</dd>';
        rows += '<dt>' + (es ? 'Área total' : 'Total area') + '</dt><dd>' + fmt(x.total, 2) + ' m²</dd>';
        rows += '<dt>' + (es ? 'Precio por m²' : 'Price per m²') + '</dt><dd>$' + fmt(x.price / x.total) + '</dd>';
      }
      card.innerHTML = '<div class="id">' + x.code + ' · ' + (es ? x.status_es : x.status_en) + '</div><h3>' + (es ? x.name_es : x.name_en) + '</h3><dl>' + rows + '</dl>' +
        '<div class="pr"><small>' + (es ? 'Precio de venta' : 'Sale price') + '</small>$' + fmt(x.price) + ' <span style="font-size:.4em;letter-spacing:.1em">USD</span></div>' +
        '<a class="btn btn-red" href="' + x.url + '">' + (es ? 'Ver ficha completa' : 'View full details') + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></a>';
    }
    function pick(id) { sel = id; render(); }
    plan.querySelectorAll('.lot').forEach(function (p) {
      var id = p.getAttribute('data-id');
      p.addEventListener('mouseenter', function () { pick(id); });
      p.addEventListener('click', function () { pick(id); });
      p.addEventListener('focus', function () { pick(id); });
      p.addEventListener('keydown', function (e) { if (e.key === 'Enter') location.href = L[id].url; });
    });
    d.querySelectorAll('.chip[data-id]').forEach(function (c) { c.addEventListener('click', function () { pick(c.getAttribute('data-id')); }); });
    render();
    var sc = plan.querySelector('.plan-scroll');
    if (sc) sc.addEventListener('scroll', function () {
      if (sc.scrollLeft > 20) plan.classList.add('swiped');
      plan.classList.toggle('at-end', sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 4);
    }, { passive: true });
  }

  var y = d.querySelector('#yr'); if (y) y.textContent = new Date().getFullYear();
})();
