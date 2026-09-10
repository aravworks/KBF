document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById("preloader");
  const barFill = document.querySelector(".preloader-bar-fill");
  let pct = 0;
  const loadTimer = setInterval(() => {
    pct = Math.min(pct + Math.random() * 18, 100);
    barFill.style.width = pct + "%";
    if (pct >= 100) clearInterval(loadTimer);
  }, 140);

  window.addEventListener("load", () => {
    setTimeout(() => {
      barFill.style.width = "100%";
      setTimeout(() => {
        preloader.classList.add("done");
        document.body.style.overflow = "";
        ScrollTrigger.refresh();
        playHeroIntro();
      }, 350);
    }, 500);
  });
  document.body.style.overflow = "hidden";
  // Safety fallback in case 'load' is slow/blocked
  setTimeout(() => {
    if (!preloader.classList.contains("done")) {
      preloader.classList.add("done");
      document.body.style.overflow = "";
      ScrollTrigger.refresh();
      playHeroIntro();
    }
  }, 4000);

  /* ---------- Hero intro ---------- */
  function playHeroIntro() {
    gsap
      .timeline({ defaults: { ease: "power3.out", duration: 1 } })
      .to(".hero-title .line", { opacity: 1, y: 0, stagger: 0.14 })
      .to(".hero-sub", { opacity: 1, y: 0 }, "-=0.6")
      .to(".hero-cta", { opacity: 1, y: 0 }, "-=0.6")
      .to("#hero .eyebrow", { opacity: 1, y: 0 }, "-=1.1");
  }

  /* ---------- Progress bar ---------- */
  const progressBar = document.getElementById("progress-bar");
  window.addEventListener(
    "scroll",
    () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      progressBar.style.width = scrolled + "%";
    },
    { passive: true },
  );

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById("site-header");
  ScrollTrigger.create({
    start: "top -80",
    end: 99999,
    onUpdate: (self) => header.classList.toggle("scrolled", self.scroll() > 80),
  });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  navToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
    navToggle.classList.toggle("active");
  });
  mobileNav
    .querySelectorAll("a")
    .forEach((a) =>
      a.addEventListener("click", () => mobileNav.classList.remove("open")),
    );

  /* ---------- Generic scroll reveals ---------- */
  gsap.utils.toArray(".reveal-up").forEach((el) => {
    if (el.closest("#hero")) return; // hero handled separately
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });
  gsap.utils.toArray(".reveal-left").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
  gsap.utils.toArray(".reveal-right").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  /* Stagger children that share a parent + start point (cards, grids) */
  document
    .querySelectorAll(
      ".why-grid, .cert-grid, .info-grid, .gallery-grid, .export-list",
    )
    .forEach((group) => {
      const items = group.querySelectorAll(":scope > .reveal-up");
      if (!items.length) return;
      gsap.set(items, { opacity: 0, y: 46 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: group, start: "top 85%" },
      });
    });

  /* ---------- Stat counters ---------- */
  gsap.utils.toArray(".stat-num").forEach((el) => {
    if (!el.dataset.count) return; // static stats (e.g. a checkmark) skip the counter
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent =
              (decimals ? obj.val.toFixed(decimals) : Math.floor(obj.val)) +
              suffix;
          },
        });
      },
    });
  });

  /* ---------- Cursor tracking (internal/headless - not visible on frontend) ---------- */
  window.cursorPosition = { x: 0, y: 0 };
  window.addEventListener(
    "mousemove",
    (e) => {
      window.cursorPosition.x = e.clientX;
      window.cursorPosition.y = e.clientY;
    },
    { passive: true },
  );

  /* ---------- Process: smooth horizontal scroll through 5 cards ---------- */
  const processSection = document.getElementById("process");
  const processTrack = document.querySelector(".process-track");
  const processPin = document.querySelector(".process-pin");
  const progressFill = document.querySelector(".process-progress-fill");

  if (processSection && processTrack && processPin) {
    // Add offset so card 5 clears the container padding and isn't cut off on the right
    const getScrollAmount = () =>
      Math.max(0, processTrack.scrollWidth - processPin.clientWidth + 80);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: processSection,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressFill) {
            // Reaches 100% when card 5 fully arrives (at 80% of total scroll)
            progressFill.style.transform = `scaleX(${Math.min(1, self.progress / 0.8)})`;
          }
        },
      },
    });

    // Animate across cards to card 5 across the first 80% of scroll
    tl.to(
      processTrack,
      {
        x: () => -getScrollAmount(),
        ease: "none",
        duration: 0.8,
      },
      0,
    );

    // Subtle gap: hold card 5 resting firmly in view for the final 20% so it cannot be scrolled away too quickly
    tl.to({}, { duration: 0.2 });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((other) => {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      item.classList.toggle("open", !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + "px" : null;
    });
  });

  /* ---------- Contact form → Google Sheets ---------- */
  const SHEET_URL =
    "https://script.google.com/macros/s/AKfycbwTWYr-ubFtn5p_W2ZadmtAcWLifnvthMh4LCxloiOFEjnoTQ8RfFlAICSDB8LfAov7/exec";
  const form = document.getElementById("quote-form");
  const status = document.getElementById("form-status");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector(".form-submit");
      btn.classList.add("loading");
      status.textContent = "";
      status.style.color = "var(--gold-light)";

      const data = {
        name: form.name.value,
        company: form.company.value,
        email: form.email.value,
        phone: form.phone.value,
        city: form.city.value,
        country: form.country.value,
        volume: form.volume.value,
        message: form.message.value,
        timestamp: new Date().toISOString(),
      };

      fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(() => {
          btn.classList.remove("loading");
          status.textContent =
            "Thanks! We've received your enquiry and will email you a formal quote shortly.";
          form.reset();
        })
        .catch(() => {
          btn.classList.remove("loading");
          status.style.color = "#ff6b6b";
          status.textContent =
            "Something went wrong. Please try again or email us directly.";
        });
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});
