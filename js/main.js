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
  document.querySelectorAll('.why-grid, .cert-grid, .info-grid, .gallery-grid, .export-list').forEach(group => {
    const items = group.querySelectorAll(':scope > .reveal-up');
    if (!items.length) return;
    gsap.set(items, { opacity: 0, y: 46 });
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: group, start: 'top 85%' }
    });
  });

  /* ---------- Stat counters ---------- */
  gsap.utils.toArray('.stat-num').forEach(el => {
    if (!el.dataset.count) return; // static stats (e.g. a checkmark) skip the counter
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target, duration: 1.8, ease: 'power2.out',
          onUpdate: () => {
            el.textContent = (decimals ? obj.val.toFixed(decimals) : Math.floor(obj.val)) + suffix;
          }
        });
      }
    });
  });

  /* ---------- Process: track + progress line animate with vertical scroll ---------- */
  const processTrack = document.querySelector('.process-track');
  const processPin = document.querySelector('.process-pin');
  const progressFill = document.querySelector('.process-progress-fill');
  if (processTrack && processPin) {
    const getScrollAmount = () => Math.max(0, processTrack.scrollWidth - processPin.clientWidth);
    gsap.timeline({
      scrollTrigger: {
        trigger: '#process',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
        invalidateOnRefresh: true
      }
    })
      .to(processTrack, { x: () => -getScrollAmount(), ease: 'none' }, 0)
      .to(progressFill, { scaleX: 1, ease: 'none' }, 0);
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
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.classList.add('loading');
      status.textContent = '';
      setTimeout(() => {
        btn.classList.remove('loading');
        status.textContent = "Thanks! We've received your enquiry and will email you a formal quote shortly.";
        form.reset();
      }, 1100);
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
});
