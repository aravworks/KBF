document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  const barFill = document.querySelector('.preloader-bar-fill');
  let pct = 0;
  const loadTimer = setInterval(() => {
    pct = Math.min(pct + Math.random() * 18, 100);
    barFill.style.width = pct + '%';
    if (pct >= 100) clearInterval(loadTimer);
  }, 140);

  window.addEventListener('load', () => {
    setTimeout(() => {
      barFill.style.width = '100%';
      setTimeout(() => {
        preloader.classList.add('done');
        document.body.style.overflow = '';
        ScrollTrigger.refresh();
        playHeroIntro();
      }, 350);
    }, 500);
  });
  document.body.style.overflow = 'hidden';
  // Safety fallback in case 'load' is slow/blocked
  setTimeout(() => { if (!preloader.classList.contains('done')) { preloader.classList.add('done'); document.body.style.overflow=''; playHeroIntro(); } }, 4000);

  /* ---------- Hero intro ---------- */
  function playHeroIntro() {
    gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } })
      .to('.hero-title .line', { opacity: 1, y: 0, stagger: 0.14 })
      .to('.hero-sub', { opacity: 1, y: 0 }, '-=0.6')
      .to('.hero-cta', { opacity: 1, y: 0 }, '-=0.6')
      .to('#hero .eyebrow', { opacity: 1, y: 0 }, '-=1.1');
  }

  /* ---------- Progress bar ---------- */
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('site-header');
  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    onUpdate: (self) => header.classList.toggle('scrolled', self.scroll() > 80)
  });

  /* ---------- Custom cursor ---------- */
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (window.matchMedia('(hover:hover)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; dot.style.left = mx+'px'; dot.style.top = my+'px'; });
    gsap.ticker.add(() => {
      rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    });
    document.querySelectorAll('a, button, .why-card, .product-card, .gallery-item').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.width='54px'; ring.style.height='54px'; ring.style.borderColor='rgba(181,69,27,.9)'; });
      el.addEventListener('mouseleave', () => { ring.style.width='34px'; ring.style.height='34px'; ring.style.borderColor='rgba(181,69,27,.5)'; });
    });
  }

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  navToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    navToggle.classList.toggle('active');
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

  /* ---------- Generic scroll reveals ---------- */
  gsap.utils.toArray('.reveal-up').forEach(el => {
    if (el.closest('#hero')) return; // hero handled separately
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.to(el, { opacity: 1, x: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.to(el, { opacity: 1, x: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });

  /* Stagger children that share a parent + start point (cards, grids) */
  document.querySelectorAll('.why-grid, .product-grid, .cert-grid, .gallery-grid, .export-list').forEach(group => {
    const items = group.querySelectorAll(':scope > .reveal-up');
    if (!items.length) return;
    gsap.set(items, { opacity: 0, y: 46 });
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: group, start: 'top 85%' }
    });
  });

  /* ---------- Hero parallax bricks ---------- */
  gsap.utils.toArray('.hb-row').forEach(row => {
    const speed = parseFloat(row.dataset.speed) || 0.4;
    gsap.to(row, {
      y: () => -120 * speed,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  });

  /* ---------- Stat counters ---------- */
  gsap.utils.toArray('.stat-num').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target, duration: 1.8, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.floor(obj.val) + suffix; }
        });
      }
    });
  });

  /* ---------- Horizontal process scroll ---------- */
  const track = document.querySelector('.process-track');
  if (track) {
    const getScrollAmount = () => track.scrollWidth - window.innerWidth + 100;
    let tween = gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.process-pin',
        start: 'top top',
        end: () => '+=' + getScrollAmount(),
        scrub: 0.6,
        pin: true,
        invalidateOnRefresh: true
      }
    });
  }

  /* ---------- Brick life-cycle animation (synced to the process scroll) ---------- */
  const brickLabel = document.getElementById('brick-life-label');
  if (brickLabel && track) {
    const getScrollAmount = () => track.scrollWidth - window.innerWidth + 100;
    const stages = [
      { at: 0.00, label: 'Raw Clay & Dust' },
      { at: 0.16, label: 'Moulded' },
      { at: 0.36, label: 'Naturally Dried' },
      { at: 0.55, label: 'Fired in the Kiln' },
      { at: 0.80, label: 'Solid Brick, Ready to Export' }
    ];

    const brickTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.process-pin',
        start: 'top top',
        end: () => '+=' + getScrollAmount(),
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          let current = stages[0];
          for (const s of stages) { if (self.progress >= s.at) current = s; }
          if (brickLabel.textContent !== current.label) brickLabel.textContent = current.label;
        }
      }
    });

    brickTl
      .set('#bl-brick', { backgroundColor: '#8d7c67', borderRadius: '50%', scale: 0.35, opacity: 0.6 })
      .set('#bl-dust', { opacity: 1 })
      .set('#bl-embers', { opacity: 0 })
      // Moulded: dust settles, block takes brick shape
      .to('#bl-dust', { opacity: 0, duration: 1 }, 0.5)
      .to('#bl-brick', { backgroundColor: '#7a6248', borderRadius: '10px', scale: 1, opacity: 1, duration: 1.4 }, 0.6)
      // Naturally dried: lighter, drier tan
      .to('#bl-brick', { backgroundColor: '#c98a4f', duration: 1.2 }, 2.4
      )
      // Fired in the kiln: glows hot, embers rise
      .to('#bl-brick', { backgroundColor: '#e2531f', boxShadow: '0 0 44px 14px rgba(255,120,40,.75)', duration: 1.3 }, 3.6)
      .to('#bl-embers', { opacity: 1, duration: 0.5 }, 3.8)
      .to('#bl-embers', { opacity: 0, duration: 0.6 }, 5.4)
      // Final solid brick: cooled, deep fired red, shine sweep
      .to('#bl-brick', { backgroundColor: '#8a3316', boxShadow: '0 14px 26px -10px rgba(0,0,0,.55)', duration: 1.2 }, 5.6
      )
      .fromTo('#bl-shine', { xPercent: -180 }, { xPercent: 260, duration: 0.9, ease: 'power1.inOut' }, 6.6);
  }

  /* ---------- Testimonials auto-scroll ---------- */
  const testiTrack = document.querySelector('.testi-track');
  if (testiTrack) {
    const cards = testiTrack.querySelectorAll('.testi-card');
    cards.forEach(c => testiTrack.appendChild(c.cloneNode(true)));
    gsap.to(testiTrack, {
      x: () => -(testiTrack.scrollWidth / 2),
      duration: 22, ease: 'none', repeat: -1
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Contact form (front-end only demo) ---------- */
  const form = document.getElementById('quote-form');
  const status = document.getElementById('form-status');
  if (form) {
    form.querySelectorAll('select').forEach(sel => {
      sel.addEventListener('change', () => sel.classList.toggle('filled', !!sel.value));
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.classList.add('loading');
      status.textContent = '';
      setTimeout(() => {
        btn.classList.remove('loading');
        status.textContent = "Thanks — your enquiry details are ready. Connect this form to an email service (e.g. Formspree) or a backend endpoint to actually send it.";
        form.reset();
      }, 1100);
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
});
