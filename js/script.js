/* ==========================================================================
   NOVA UNISEX GYM — interactions
   ========================================================================== */
(function(){
  "use strict";

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     PRELOADER
  --------------------------------------------------------------------- */
  (function preloader(){
    var el = document.getElementById('preloader');
    if(!el) return;
    var minDelay = reducedMotion ? 200 : 1900;
    var start = Date.now();
    function hide(){
      var elapsed = Date.now() - start;
      var wait = Math.max(0, minDelay - elapsed);
      setTimeout(function(){
        el.classList.add('hidden');
        document.body.classList.remove('lock-scroll');
      }, wait);
    }
    if(document.readyState === 'complete'){ hide(); }
    else { window.addEventListener('load', hide); }
  })();

  /* ---------------------------------------------------------------------
     CUSTOM CURSOR (desktop / fine-pointer only)
  --------------------------------------------------------------------- */
  (function cursor(){
    if(!window.matchMedia('(pointer:fine)').matches) return;
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if(!dot || !ring) return;

    var mx=0, my=0, rx=0, ry=0, active=false;

    window.addEventListener('mousemove', function(e){
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx+'px'; dot.style.top = my+'px';
      if(!active){ active = true; document.body.classList.add('cursor-active'); }
    });

    function loop(){
      rx += (mx-rx)*0.16; ry += (my-ry)*0.16;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
      requestAnimationFrame(loop);
    }
    loop();

    var hoverables = 'a, button, .gallery-item, .price-card, .trainer-card, input, textarea, select';
    document.addEventListener('mouseover', function(e){
      if(e.target.closest(hoverables)) ring.classList.add('hover');
    });
    document.addEventListener('mouseout', function(e){
      if(e.target.closest(hoverables)) ring.classList.remove('hover');
    });
  })();

  /* ---------------------------------------------------------------------
     NAVBAR SCROLL STATE + BACK-TO-TOP
  --------------------------------------------------------------------- */
  var navbar = document.getElementById('navbar');
  var backToTop = document.getElementById('backToTop');

  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    if(navbar) navbar.classList.toggle('scrolled', y > 30);
    if(backToTop) backToTop.classList.toggle('show', y > 700);
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  if(backToTop){
    backToTop.addEventListener('click', function(){
      window.scrollTo({ top:0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------------------
     MOBILE MENU
  --------------------------------------------------------------------- */
  (function mobileMenu(){
    var btn = document.getElementById('hamburger');
    var menu = document.getElementById('mobileMenu');
    if(!btn || !menu) return;

    function close(){
      btn.classList.remove('open'); btn.setAttribute('aria-expanded','false');
      menu.classList.remove('open');
    }
    btn.addEventListener('click', function(){
      var open = menu.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', close); });
  })();

  /* ---------------------------------------------------------------------
     SCROLLSPY — active nav link
  --------------------------------------------------------------------- */
  (function scrollspy(){
    var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id], .hero[id]'));
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link[data-link]'));
    if(!sections.length || !links.length) return;

    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        var id = entry.target.id;
        links.forEach(function(l){
          l.classList.toggle('active', l.getAttribute('href') === '#'+id);
        });
      });
    }, { rootMargin:'-45% 0px -50% 0px', threshold:0 });

    sections.forEach(function(s){ spy.observe(s); });
  })();

  /* ---------------------------------------------------------------------
     AUTO-STAGGER grid children (--d) for reveal-up cards
  --------------------------------------------------------------------- */
  ['.trainer-grid', '.gallery-grid', '.pricing-grid'].forEach(function(sel){
    var parent = document.querySelector(sel);
    if(!parent) return;
    Array.prototype.forEach.call(parent.children, function(child, i){
      if(child.classList.contains('reveal-up') && !child.style.getPropertyValue('--d')){
        child.style.setProperty('--d', i);
      }
    });
  });

  /* ---------------------------------------------------------------------
     SCROLL REVEAL (IntersectionObserver)
  --------------------------------------------------------------------- */
  (function reveal(){
    var els = document.querySelectorAll('.reveal-up');
    if(!els.length) return;

    if(reducedMotion){
      els.forEach(function(el){ el.classList.add('in-view'); });
      return;
    }

    var obs = new IntersectionObserver(function(entries, observer){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });

    els.forEach(function(el){ obs.observe(el); });
  })();

  /* ---------------------------------------------------------------------
     COUNT-UP STATS
  --------------------------------------------------------------------- */
  (function counters(){
    var grid = document.querySelector('.hero-stats-grid');
    var nums = document.querySelectorAll('.stat-num');
    if(!grid || !nums.length) return;

    function run(){
      nums.forEach(function(num){
        var target = parseInt(num.getAttribute('data-count'), 10) || 0;
        if(reducedMotion){ num.textContent = target; return; }
        var startTime = null, duration = 1600;
        function step(ts){
          if(!startTime) startTime = ts;
          var p = Math.min((ts-startTime)/duration, 1);
          var eased = 1 - Math.pow(1-p, 3);
          num.textContent = Math.round(eased * target);
          if(p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }

    var obs = new IntersectionObserver(function(entries, observer){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ run(); observer.disconnect(); }
      });
    }, { threshold:0.4 });
    obs.observe(grid);
  })();

  /* ---------------------------------------------------------------------
     PROGRAMS — TAB SWITCHER
  --------------------------------------------------------------------- */
  (function programTabs(){
    var tabsWrap = document.querySelector('.tabs');
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.tab-panel'));
    var indicator = document.querySelector('.tab-indicator');
    if(!tabsWrap || !buttons.length || !indicator) return;

    function moveIndicator(btn){
      indicator.style.width = btn.offsetWidth + 'px';
      indicator.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
    }

    function activate(btn, focus){
      buttons.forEach(function(b){ b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', b === btn ? 'true':'false'); });
      panels.forEach(function(p){ p.classList.toggle('active', p.dataset.panel === btn.dataset.tab); });
      moveIndicator(btn);
    }

    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){ activate(btn); });
    });

    window.addEventListener('resize', function(){
      var active = document.querySelector('.tab-btn.active');
      if(active) moveIndicator(active);
    });

    // init after fonts/layout settle
    window.addEventListener('load', function(){ moveIndicator(buttons[0]); });
    setTimeout(function(){ moveIndicator(buttons[0]); }, 50);
  })();

  /* ---------------------------------------------------------------------
     MEMBERSHIP — BILLING TOGGLE
  --------------------------------------------------------------------- */
  (function billingToggle(){
    var wrap = document.querySelector('.billing-toggle');
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.billing-btn'));
    var indicator = document.querySelector('.billing-indicator');
    var values = Array.prototype.slice.call(document.querySelectorAll('.price-value'));
    var periods = document.querySelectorAll('.price-period');
    if(!wrap || !buttons.length || !indicator) return;

    var labels = { monthly:'/ mo', quarterly:'/ qtr', annual:'/ yr' };

    function moveIndicator(btn){
      indicator.style.width = btn.offsetWidth + 'px';
      indicator.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
    }

    function setPeriod(period){
      values.forEach(function(v){
        var val = v.getAttribute('data-'+period);
        if(val == null) return;
        v.classList.add('swap');
        setTimeout(function(){
          v.textContent = Number(val).toLocaleString('en-IN');
          v.classList.remove('swap');
        }, 150);
      });
      periods.forEach(function(p){ p.textContent = labels[period] || '/ mo'; });
    }

    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){
        buttons.forEach(function(b){ b.classList.toggle('active', b===btn); });
        moveIndicator(btn);
        setPeriod(btn.dataset.period);
      });
    });

    window.addEventListener('resize', function(){
      var active = document.querySelector('.billing-btn.active');
      if(active) moveIndicator(active);
    });
    window.addEventListener('load', function(){ moveIndicator(buttons[0]); });
    setTimeout(function(){ moveIndicator(buttons[0]); }, 50);
  })();

  /* ---------------------------------------------------------------------
     GALLERY LIGHTBOX
  --------------------------------------------------------------------- */
  (function lightbox(){
    var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
    var box = document.getElementById('lightbox');
    var img = document.getElementById('lightboxImg');
    var caption = document.getElementById('lightboxCaption');
    var closeBtn = document.getElementById('lightboxClose');
    var prevBtn = document.getElementById('lightboxPrev');
    var nextBtn = document.getElementById('lightboxNext');
    if(!items.length || !box) return;

    var index = 0;

    function show(i){
      index = (i + items.length) % items.length;
      var item = items[index];
      img.src = item.getAttribute('data-full');
      img.alt = item.querySelector('img').alt || '';
      caption.textContent = item.getAttribute('data-caption') || '';
    }
    function open(i){
      show(i);
      box.classList.add('open');
      box.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    }
    function close(){
      box.classList.remove('open');
      box.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    }

    items.forEach(function(item, i){
      item.addEventListener('click', function(){ open(i); });
    });
    closeBtn.addEventListener('click', close);
    box.addEventListener('click', function(e){ if(e.target === box) close(); });
    prevBtn.addEventListener('click', function(){ show(index-1); });
    nextBtn.addEventListener('click', function(){ show(index+1); });
    document.addEventListener('keydown', function(e){
      if(!box.classList.contains('open')) return;
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowLeft') show(index-1);
      if(e.key === 'ArrowRight') show(index+1);
    });
  })();

  /* ---------------------------------------------------------------------
     TESTIMONIAL SLIDER
  --------------------------------------------------------------------- */
  (function testimonials(){
    var track = document.getElementById('testiTrack');
    var dotsWrap = document.getElementById('testiDots');
    var prevBtn = document.getElementById('testiPrev');
    var nextBtn = document.getElementById('testiNext');
    if(!track || !dotsWrap) return;

    var cards = Array.prototype.slice.call(track.children);
    var index = 0, timer;

    cards.forEach(function(_, i){
      var dot = document.createElement('span');
      if(i===0) dot.classList.add('active');
      dot.addEventListener('click', function(){ go(i); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function go(i){
      index = (i + cards.length) % cards.length;
      track.style.transform = 'translateX(-' + (index*100) + '%)';
      dots.forEach(function(d,di){ d.classList.toggle('active', di===index); });
      restart();
    }
    function restart(){
      clearInterval(timer);
      timer = setInterval(function(){ go(index+1); }, 6000);
    }

    prevBtn.addEventListener('click', function(){ go(index-1); });
    nextBtn.addEventListener('click', function(){ go(index+1); });
    track.parentElement.addEventListener('mouseenter', function(){ clearInterval(timer); });
    track.parentElement.addEventListener('mouseleave', restart);

    restart();
  })();

  /* ---------------------------------------------------------------------
     CONTACT FORM (demo — no real submission)
  --------------------------------------------------------------------- */
  (function contactForm(){
    var form = document.getElementById('contactForm');
    var toast = document.getElementById('toast');
    if(!form || !toast) return;

    var toastTimer;
    function showToast(msg){
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function(){ toast.classList.remove('show'); }, 3800);
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      showToast('Thanks! This is a demo form — no message was actually sent.');
      form.reset();
    });
  })();

  /* ---------------------------------------------------------------------
     FOOTER YEAR
  --------------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

})();
