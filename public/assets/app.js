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
  function setMenu(o) { d.body.classList.toggle('menu-open', o); if (burger) burger.setAttribute('aria-expanded', o); d.body.style.overflow = o ? 'hidden' : ''; }
  if (burger) burger.addEventListener('click', function () { setMenu(!d.body.classList.contains('menu-open')); });
  d.querySelectorAll('.mnav a').forEach(function (a, i) { a.style.setProperty('--i', i); a.addEventListener('click', function () { setMenu(false); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && d.body.classList.contains('menu-open')) { setMenu(false); burger.focus(); } });

  /* ---------- movimiento ---------- */
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Aparición al desplazarse: una sola vez por elemento, escalonada entre hermanos.
     Solo se ocultan elementos que aún están fuera de pantalla: nada visible desaparece. */
  if ('IntersectionObserver' in window && !RM) {
    var groups2 = ['.sec-head', '.split2 > *', '.loc-grid > *', '.cards > .card', '.specs > .spec', '.feat > li', '.bundle-g > *', '.price-rules > div',
      '.block', '.tbl-wrap', '.gal-strip', '.masonry figure', '.access > div', '.cta-band .wrap > *', '.cta-strip', '.paths .path .in', '.sec.dark > .wrap > .plan-wrap'];
    var seen = [];
    groups2.forEach(function (sel) { d.querySelectorAll(sel).forEach(function (el) { if (seen.indexOf(el) < 0) { seen.push(el); el.classList.add('rv'); } }); });
    d.querySelectorAll('.rv .rv').forEach(function (el) { el.classList.remove('rv'); });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; el.classList.remove('pre'); io.unobserve(el);
        setTimeout(function () { el.classList.remove('rv'); el.style.removeProperty('--rd'); }, 1300);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    d.querySelectorAll('.rv').forEach(function (el) {
      if (el.getBoundingClientRect().top < innerHeight * 0.92) { el.classList.remove('rv'); return; }
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      if (el.matches('.card, .spec, .feat > li, .masonry figure, .access > div, .price-rules > div')) el.style.setProperty('--rd', Math.min(sib, 5) * 0.07 + 's');
      el.classList.add('pre'); io.observe(el);
    });
    d.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top < innerHeight * 0.92) return;
      el.classList.add('pre'); io.observe(el);
    });
  }

  /* Contadores: una vez, al entrar en pantalla; el valor final exacto ya está en el HTML. */
  if (!RM && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var el = e.target, end = parseFloat(el.getAttribute('data-count')), dec = +(el.getAttribute('data-dec') || 0), t0 = null, dur = 1100;
        var fin = el.textContent;
        function f(n) { return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
        function step(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / dur), v = end * (1 - Math.pow(1 - k, 3)); el.textContent = k < 1 ? f(v) : fin; if (k < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    d.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  /* Parallax sutil: solo en escritorio con puntero fino, en imágenes seleccionadas. */
  if (!RM && FINE && innerWidth > 900) {
    var pars = [];
    d.querySelectorAll('.hero-bg img, .phero-bg img, .paths .path img, .cta-band > img').forEach(function (img) {
      var host = img.closest('.hero, .phero, .path, .cta-band'); if (!host) return;
      var k = img.closest('.hero, .phero') ? 0.22 : 0.06;
      if (!img.closest('.hero, .phero')) img.style.scale = img.style.scale || '';
      pars.push({ img: img, host: host, k: k, on: false });
    });
    if (pars.length) {
      var pio = new IntersectionObserver(function (en) { en.forEach(function (e) { pars.forEach(function (p) { if (p.host === e.target) p.on = e.isIntersecting; }); }); });
      pars.forEach(function (p) { pio.observe(p.host); });
      var ticking = false;
      function upd() {
        ticking = false; var vh = innerHeight;
        pars.forEach(function (p) {
          if (!p.on) return; var r = p.host.getBoundingClientRect();
          var y = p.img.closest('.hero, .phero') ? Math.max(0, -r.top) * p.k : ((r.top + r.height / 2) - vh / 2) * -p.k;
          p.img.style.translate = '0 ' + y.toFixed(1) + 'px';
        });
      }
      window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
      upd();
    }
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
  var lb, lbImg, lbCap, cur, curG, opener;
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
    opener = d.activeElement; curG = groups[g]; cur = i; lbRender(); lb.hidden = false; d.body.style.overflow = 'hidden'; lb.querySelector('.x').focus();
  }
  function visible() { return curG.filter(function (el) { return !el.closest('[hidden]'); }); }
  function lbRender() { var el = curG[cur]; lbImg.src = el.getAttribute('data-full'); var c = el.getAttribute('data-cap') || ''; lbCap.textContent = c; lbImg.alt = c; }
  function step(s) { var v = visible(); var k = v.indexOf(curG[cur]); k = (k + s + v.length) % v.length; cur = curG.indexOf(v[k]); lbRender(); }
  function closeLb() { lb.hidden = true; d.body.style.overflow = ''; if (opener && opener.focus) opener.focus(); }

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
    var qs = new URLSearchParams(location.search), q = qs.get('interes'), tq = qs.get('tipo');
    var selF = form.querySelector('#f-int'), tsF = form.querySelector('input[name="ts"]'); if (tsF) tsF.value = Date.now();
    if (q === 'bodega' && tq === 'alquiler') q = 'bodega-alquiler';
    if (q === 'bodega-alquiler' && !tq) tq = 'alquiler';
    if (q && selF && selF.querySelector('option[value="' + q + '"]')) selF.value = q;
    if (tq) { var r = form.querySelector('input[name="tipo"][value="' + tq + '"]'); if (r) r.checked = true; }
    form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid') === 'true') e.target.setAttribute('aria-invalid', 'false'); });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var ok = true;
      form.querySelectorAll('[required]').forEach(function (i) { var bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.setAttribute('aria-invalid', bad); if (bad) ok = false; });
      form.querySelector('.err').hidden = ok; form.querySelector('.send-err').hidden = true;
      if (!ok) { var f1 = form.querySelector('[aria-invalid="true"]'); if (f1) f1.focus(); return; }
      var btn = form.querySelector('button[type="submit"]'), lbl = btn.querySelector('.lbl'), was = lbl.textContent;
      btn.disabled = true; btn.setAttribute('aria-busy', 'true'); lbl.textContent = es ? 'Enviando…' : 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (j) { if (!j.ok) throw 0; form.hidden = true; var okb = d.querySelector('#lead-ok'); okb.hidden = false; okb.focus(); })
        .catch(function () { form.querySelector('.send-err').hidden = false; btn.disabled = false; btn.removeAttribute('aria-busy'); lbl.textContent = was; });
    });
  }

  /* ---------- panorámica: arrastre e indicador ---------- */
  d.querySelectorAll('.pano-wrap').forEach(function (wrap) {
    var p = wrap.querySelector('.pano'), img = p.querySelector('img');
    var down = false, sx, sl;
    function used() { wrap.classList.add('used'); }
    function center() { p.scrollLeft = (p.scrollWidth - p.clientWidth) / 2; }
    if (img && !img.complete) img.addEventListener('load', center); else center();
    p.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = p.scrollLeft; p.style.cursor = 'grabbing'; used(); });
    window.addEventListener('pointerup', function () { down = false; p.style.cursor = ''; });
    p.addEventListener('pointermove', function (e) { if (down) p.scrollLeft = sl - (e.clientX - sx); });
    p.addEventListener('touchstart', used, { passive: true });
    p.addEventListener('scroll', function () { if (Math.abs(p.scrollLeft - (p.scrollWidth - p.clientWidth) / 2) > 20) used(); }, { passive: true });
    p.addEventListener('wheel', used, { passive: true });

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
        rows += '<dt>' + (es ? 'Terreno (catastro)' : 'Land (cadastral)') + '</dt><dd>' + fmt(x.land, 2) + ' m²</dd>';
        rows += '<dt>' + (es ? 'Alquiler' : 'Lease') + '</dt><dd>$' + x.rent + '/m² + ' + (es ? 'IVA' : 'VAT') + '</dd>';
        rows += '<dt>' + (es ? 'Mantenimiento' : 'Maintenance') + '</dt><dd>$' + x.fee + '/m²</dd>';
      } else {
        if (x.kind === 'house') rows += '<dt>' + (es ? 'Área del terreno' : 'Land area') + '</dt><dd>' + fmt(x.total, 2) + ' m²</dd>';
        else {
          rows += '<dt>' + (es ? 'Área útil de la finca' : 'Usable lot area') + '</dt><dd>' + fmt(x.lot, 2) + ' m²</dd>';
          rows += '<dt>' + (es ? 'Zona verde A.C.L.R.' : 'A.C.L.R. green zone') + '</dt><dd>' + fmt(x.green, 2) + ' m²</dd>';
          rows += '<dt>' + (es ? 'Área total' : 'Total area') + '</dt><dd>' + fmt(x.total, 2) + ' m²</dd>';
        }
        rows += '<dt>' + (x.kind === 'house' ? (es ? 'Terreno por m²' : 'Land per m²') : (es ? 'Precio por m² (área total)' : 'Price per m² (total area)')) + '</dt><dd>$' + fmt(x.rate) + '</dd>';
        if (x.kind === 'house') rows += '<dt>' + (es ? 'Casa existente' : 'Existing house') + '</dt><dd>$' + fmt(x.price - x.rate * x.total) + '</dd>';
      }
      var cur = plan.getAttribute('data-current');
      var ct = (es ? '/contacto/' : '/en/contact/') + '?interes=' + (sel === 'ib5' ? 'bodega' : sel) + '&tipo=info#formulario';
      var arrow = ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
      card.innerHTML = '<div class="id">' + x.code + ' · ' + (es ? x.status_es : x.status_en) + '</div><p class="ttl">' + (x.kind === 'house' ? (es ? 'Terreno con casa existente' : 'Land with existing house') : (es ? x.name_es : x.name_en)) + '</p><dl>' + rows + '</dl>' +
        '<div class="pr"><small>' + (x.kind === 'warehouse' ? (es ? 'Precio global terreno + bodega' : 'Package price, land + warehouse') : x.kind === 'house' ? (es ? 'Precio total terreno + casa' : 'Total price, land + house') : (es ? 'Precio de venta' : 'Sale price')) + '</small>$' + fmt(x.price) + ' <span style="font-size:.4em;letter-spacing:.1em">USD</span></div>' +
        '<div class="acts">' + (cur === sel ? '' : '<a class="btn btn-red" href="' + x.url + '">' + (es ? 'Ver ficha completa' : 'View full details') + arrow + '</a>') +
        '<a class="btn btn-ghost" href="' + ct + '">' + (es ? 'Solicitar información' : 'Request information') + '</a></div>';
    }
    var sc = plan.querySelector('.plan-scroll');
    function center(id) {
      if (!sc || sc.scrollWidth <= sc.clientWidth + 4) return;
      var poly = plan.querySelector('.lot[data-id="' + id + '"]'); if (!poly) return;
      var r = poly.getBoundingClientRect(), sr = sc.getBoundingClientRect();
      var target = sc.scrollLeft + (r.left + r.width / 2) - (sr.left + sr.width / 2);
      sc.scrollTo({ left: Math.max(0, target), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
    function pick(id, c) { if (id === sel && card && card.innerHTML) return; sel = id; render(); if (c) center(id); }
    plan.querySelectorAll('.lot').forEach(function (p) {
      var id = p.getAttribute('data-id');
      p.addEventListener('mouseenter', function () { if (matchMedia('(hover: hover)').matches) pick(id); });
      p.addEventListener('click', function () { pick(id); });
      p.addEventListener('focus', function () { pick(id); });
      p.addEventListener('keydown', function (e) { if (e.key === 'Enter') location.href = L[id].url; });
    });
    d.querySelectorAll('.chip[data-id]').forEach(function (c) { c.addEventListener('click', function () { pick(c.getAttribute('data-id'), true); }); });
    render();
    if (sc) setTimeout(function () { center(sel); }, 400);
    if (sc) sc.addEventListener('scroll', function () {
      if (sc.scrollLeft > 20) plan.classList.add('swiped');
      plan.classList.toggle('at-end', sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 4);
    }, { passive: true });
  }

  var y = d.querySelector('#yr'); if (y) y.textContent = new Date().getFullYear();
})();
