(function () {
  var d = document, root = d.documentElement;
  var es = root.getAttribute('lang') !== 'en';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');
  var L = window.CP_LOTS || {};
  function fmt(n, dec) { return n.toLocaleString('en-US', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 }); }
  function money(n) { return '$' + fmt(Math.round(n)); }

  /* ---------- barra y menú ---------- */
  var bar = d.querySelector('.bar');
  var menuBtn = d.querySelector('.menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', function () {
    var o = d.body.classList.toggle('menu-open'); menuBtn.setAttribute('aria-expanded', o);
    menuBtn.textContent = o ? (es ? 'Cerrar' : 'Close') : (es ? 'Menú' : 'Menu');
  });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && d.body.classList.contains('menu-open')) menuBtn.click(); });
  var heroCopy = d.querySelector('.home .hero .copy');
  if (heroCopy && bar && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es_) { bar.classList.toggle('past', !es_[0].isIntersecting); }, { rootMargin: '-80px 0px 0px 0px' }).observe(heroCopy);
  }

  /* ---------- entradas (nunca ocultan contenido si falla el script) ---------- */
  d.querySelectorAll('.ticks, .spec, .breakdown, .other, .rules-list, .pick-list, .built-row ul, .av tbody, .mosaic').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { if (!c.classList.contains('rise')) { c.classList.add('rise'); c.style.setProperty('--i', Math.min(i, 5)); } });
  });
  var rises = d.querySelectorAll('.rise');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px 8% 0px' });
    rises.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rises.forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); }); }, 60);
  } else rises.forEach(function (el) { el.classList.add('in'); });

  /* ---------- escenario fijo: la imagen cambia con la sección ---------- */
  d.querySelectorAll('[data-stage-root]').forEach(function (rootEl) {
    var imgs = rootEl.querySelectorAll('.stage img[data-k]'), cap = rootEl.querySelector('[data-cap]');
    var secs = rootEl.querySelectorAll('[data-stage]');
    if (!imgs.length || !('IntersectionObserver' in window)) return;
    function show(k) {
      imgs.forEach(function (im) { var on = im.getAttribute('data-k') === k; if (on && im.loading === 'lazy') im.loading = 'eager'; im.classList.toggle('on', on); });
      if (cap) { var l = L[k]; cap.hidden = !l; if (l) cap.textContent = l.code; }
    }
    var obs = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) show(e.target.getAttribute('data-stage')); }); }, { rootMargin: '-45% 0px -45% 0px' });
    secs.forEach(function (s) { obs.observe(s); });
  });

  /* ---------- nombre que escala con el scroll (firma) ---------- */
  var nameEl = d.querySelector('[data-scale-name]');
  if (nameEl && !reduce && innerWidth > 900) {
    var tick = false;
    function scaleName() { tick = false; var p = Math.min(1, Math.max(0, scrollY / innerHeight)); nameEl.style.transform = 'scale(' + (1 - p * 0.07).toFixed(4) + ')'; }
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(scaleName); } }, { passive: true });
  }

  /* ---------- lightbox ---------- */
  var groups = {};
  d.querySelectorAll('[data-lb]').forEach(function (el) {
    var g = el.getAttribute('data-lb'); (groups[g] = groups[g] || []).push(el);
    el.addEventListener('click', function () { showLb(g, groups[g].indexOf(el), el); });
  });
  var lb, lbImg, lbCap, cur, curG, opener;
  var ico = { x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    l: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 4l-8 8 8 8"/></svg>',
    r: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 4l8 8-8 8"/></svg>' };
  function showLb(g, i, el) {
    opener = el;
    if (!lb) {
      lb = d.createElement('div'); lb.className = 'lb'; lb.hidden = true; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
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
  function closeLb() { lb.hidden = true; d.body.style.overflow = ''; if (opener) opener.focus(); }

  /* ---------- filtros ---------- */
  d.querySelectorAll('[data-filter-group]').forEach(function (grp) {
    var target = d.querySelector(grp.getAttribute('data-filter-group'));
    grp.querySelectorAll('[data-f]').forEach(function (b) {
      b.addEventListener('click', function () {
        grp.querySelectorAll('[data-f]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        var f = b.getAttribute('data-f');
        target.querySelectorAll('[data-cat]').forEach(function (it) { it.hidden = !(f === 'all' || it.getAttribute('data-cat').split(' ').indexOf(f) > -1); });
      });
    });
  });

  /* ---------- pestañas accesibles ---------- */
  d.querySelectorAll('[role="tablist"]').forEach(function (tl) {
    var tabs = Array.prototype.slice.call(tl.querySelectorAll('[role="tab"]'));
    function sel(t) {
      tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; var p = d.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on; });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { sel(t); });
      t.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!n) return;
        e.preventDefault(); var nt = tabs[(i + n + tabs.length) % tabs.length]; sel(nt); nt.focus();
      });
    });
  });

  /* ---------- fila arrastrable con el mouse ---------- */
  function dragScroll(el, onUse) {
    var down = false, moved = false, sx, sl;
    el.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = el.scrollLeft; });
    addEventListener('pointerup', function () { down = false; el.style.cursor = ''; });
    el.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) { moved = true; el.style.cursor = 'grabbing'; if (onUse) onUse(); } el.scrollLeft = sl - dx; });
    el.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  }
  d.querySelectorAll('[data-drag]').forEach(function (el) { dragScroll(el); });

  /* ---------- panorámica ---------- */
  d.querySelectorAll('.pano-wrap').forEach(function (wrap) {
    var p = wrap.querySelector('.pano'), img = p.querySelector('img');
    function used() { wrap.classList.add('used'); }
    function center() { p.scrollLeft = (p.scrollWidth - p.clientWidth) / 2; }
    if (img && !img.complete) img.addEventListener('load', center); else center();
    dragScroll(p, used);
    p.addEventListener('touchstart', used, { passive: true });
    p.addEventListener('wheel', used, { passive: true });
  });

  /* ---------- master plan ---------- */
  d.querySelectorAll('[data-planner]').forEach(function (pl) {
    var mode = pl.getAttribute('data-planner');
    var sel = (pl.getAttribute('data-selected') || '').split(',').filter(Boolean);
    var lots = pl.querySelectorAll('.lot'), tags = pl.querySelectorAll('.tg');
    var sc = pl.querySelector('.plan-scroll'), plan = pl.querySelector('.plan');
    if (sc) {
      sc.addEventListener('scroll', function () { if (sc.scrollLeft > 20) plan.classList.add('swiped'); }, { passive: true });
      if (mode === 'focus' && sel[0]) {
        var target = pl.querySelector('.lot[data-id="' + sel[0] + '"]');
        requestAnimationFrame(function () { if (sc.scrollWidth > sc.clientWidth && target) { var b = target.getBBox(), sv = target.ownerSVGElement, ratio = sc.scrollWidth / sv.viewBox.baseVal.width; sc.scrollLeft = (b.x + b.width / 2) * ratio - sc.clientWidth / 2; } });
      }
      dragScroll(sc, function () { plan.classList.add('swiped'); });
    }
    function paint() {
      lots.forEach(function (p) { var on = sel.indexOf(p.getAttribute('data-id')) > -1; p.classList.toggle('on', on); p.classList.toggle('dim', mode === 'focus' && !on); });
      tags.forEach(function (g) { g.classList.toggle('on', sel.indexOf(g.getAttribute('data-tag')) > -1); });
    }
    if (mode === 'focus') { paint(); return; }
    var chips = pl.querySelectorAll('.chip[data-id]'), allBtn = pl.querySelector('[data-all]');
    var priceEl = pl.querySelector('[data-sum-price]'), areaEl = pl.querySelector('[data-sum-area]'), listEl = pl.querySelector('[data-sum-list]'), go = pl.querySelector('[data-sum-go]');
    var base = pl.getAttribute('data-contact');
    var order = ['ib4', 'ib5', 'ib6', 'ib7', 'ib8'];
    function area(l) { return l.kind === 'warehouse' ? l.land : l.total; }
    function update() {
      paint();
      chips.forEach(function (c) { c.setAttribute('aria-pressed', sel.indexOf(c.getAttribute('data-id')) > -1); });
      if (allBtn) allBtn.setAttribute('aria-pressed', sel.length === order.length);
      var price = 0, a = 0, html = '';
      order.forEach(function (k) { if (sel.indexOf(k) < 0) return; var l = L[k]; price += l.price; a += area(l); html += '<li><span>' + l.code + '</span><span>' + money(l.price) + '</span></li>'; });
      priceEl.textContent = money(price);
      areaEl.textContent = sel.length ? fmt(a, 2) + ' m² ' + (es ? 'de terreno' : 'of land') + (sel.indexOf('ib5') > -1 ? (es ? ' y 5,500 m² construidos' : ' and 5,500 m² built') : '') : (es ? 'Toque una finca en el plano o en la lista' : 'Tap a lot on the plan or in the list');
      listEl.innerHTML = html;
      var q = sel.length === order.length ? '?interes=todo' : sel.length ? '?fincas=' + order.filter(function (k) { return sel.indexOf(k) > -1; }).join(',') : '';
      go.setAttribute('href', base + q);
    }
    function toggle(k) { var i = sel.indexOf(k); if (i > -1) sel.splice(i, 1); else sel.push(k); update(); }
    lots.forEach(function (p) { p.addEventListener('click', function () { toggle(p.getAttribute('data-id')); }); });
    chips.forEach(function (c) { c.addEventListener('click', function () { toggle(c.getAttribute('data-id')); }); });
    if (allBtn) allBtn.addEventListener('click', function () { sel = sel.length === order.length ? [] : order.slice(); update(); });
    var clr = pl.querySelector('[data-clear]'); if (clr) clr.addEventListener('click', function () { sel = []; update(); });
    d.querySelectorAll('[data-add]').forEach(function (a) { a.addEventListener('click', function () { var k = a.getAttribute('data-add'); if (sel.indexOf(k) < 0) sel.push(k); update(); }); });
    update();
  });

  /* ---------- formulario ---------- */
  var form = d.querySelector('#lead');
  if (form) {
    var qs = new URLSearchParams(location.search);
    var q = qs.get('interes'), fs = (qs.get('fincas') || '').split(',').filter(function (k) { return L[k]; });
    var selEl = form.querySelector('#f-int');
    if (fs.length === 1 && selEl.querySelector('option[value="' + fs[0] + '"]')) selEl.value = fs[0];
    else if (fs.length > 1) {
      selEl.value = 'varias';
      var tot = fs.reduce(function (s, k) { return s + L[k].price; }, 0);
      var msg = form.querySelector('#f-msg');
      msg.value = (es ? 'Me interesan estas fincas: ' : 'I am interested in these lots: ') + fs.map(function (k) { return L[k].code; }).join(', ') + ' (' + money(tot) + ').';
    } else if (q && selEl.querySelector('option[value="' + q + '"]')) selEl.value = q;
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var ok = true;
      form.querySelectorAll('[required]').forEach(function (i) { var bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.setAttribute('aria-invalid', bad); if (bad) ok = false; });
      form.querySelector('.err').hidden = ok; form.querySelector('.send-err').hidden = true; if (!ok) { var f1 = form.querySelector('[aria-invalid="true"]'); if (f1) f1.focus(); return; }
      var btn = form.querySelector('button[type="submit"]'), lbl = btn.firstChild, was = lbl.nodeValue; btn.disabled = true; btn.setAttribute('aria-busy', 'true'); lbl.nodeValue = (es ? 'Enviando… ' : 'Sending… ');
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (j) { if (!j.ok) throw 0; form.hidden = true; var ok2 = d.querySelector('#lead-ok'); ok2.hidden = false; ok2.focus(); })
        .catch(function () { form.querySelector('.send-err').hidden = false; btn.disabled = false; btn.removeAttribute('aria-busy'); lbl.nodeValue = was; });
    });
    form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid') === 'true') e.target.setAttribute('aria-invalid', 'false'); });
  }

  var y = d.querySelector('#yr'); if (y) y.textContent = new Date().getFullYear();
})();
