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

  /* ---------- Contact form → Searchable Comboboxes & Validation ---------- */
  const SHEET_URL =
    "https://script.google.com/macros/s/AKfycbwTWYr-ubFtn5p_W2ZadmtAcWLifnvthMh4LCxloiOFEjnoTQ8RfFlAICSDB8LfAov7/exec";
  const form = document.getElementById("quote-form");
  const status = document.getElementById("form-status");

  // Comprehensive Country list
  const COUNTRIES = [
    "India",
    "United Arab Emirates",
    "Saudi Arabia",
    "Qatar",
    "Oman",
    "Kuwait",
    "Bahrain",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Singapore",
    "Malaysia",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "South Africa",
    "Nepal",
    "Bangladesh",
    "Sri Lanka",
    "Other Country (Type your own)"
  ];

  // Dynamic Cities per Country
  const CITIES_BY_COUNTRY = {
    India: [
      "Kanpur",
      "Lucknow",
      "Unnao",
      "Prayagraj (Allahabad)",
      "Varanasi",
      "Agra",
      "Noida / Greater Noida",
      "Ghaziabad",
      "Delhi / NCR",
      "Bareilly",
      "Meerut",
      "Gorakhpur",
      "Jhansi",
      "Aligarh",
      "Ayodhya",
      "Mathura",
      "Moradabad",
      "Saharanpur",
      "Mumbai",
      "Pune",
      "Bengaluru",
      "Kolkata",
      "Hyderabad",
      "Ahmedabad",
      "Surat",
      "Chennai",
      "Jaipur",
      "Chandigarh",
      "Patna",
      "Bhopal",
      "Indore",
      "Other City (Type your own)"
    ],
    "United Arab Emirates": [
      "Dubai",
      "Abu Dhabi",
      "Sharjah",
      "Ajman",
      "Ras Al Khaimah",
      "Fujairah",
      "Umm Al Quwain",
      "Other City (UAE)"
    ],
    "Saudi Arabia": [
      "Riyadh",
      "Jeddah",
      "Dammam",
      "Mecca",
      "Medina",
      "Khobar",
      "Tabuk",
      "Jubail",
      "Other City (Saudi Arabia)"
    ],
    Qatar: ["Doha", "Al Rayyan", "Al Wakrah", "Al Khor", "Other City (Qatar)"],
    Oman: ["Muscat", "Salalah", "Sohar", "Nizwa", "Other City (Oman)"],
    Kuwait: ["Kuwait City", "Al Ahmadi", "Hawalli", "Salmiya", "Other City (Kuwait)"],
    Bahrain: ["Manama", "Riffa", "Muharraq", "Hamad Town", "Other City (Bahrain)"],
    "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Dallas", "Miami", "San Francisco", "Other City (USA)"],
    "United Kingdom": ["London", "Birmingham", "Manchester", "Glasgow", "Leeds", "Other City (UK)"],
    Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Other City (Canada)"],
    Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Other City (Australia)"],
    Other: ["Major City", "Other International City (Type your own)"]
  };

  const countryInput = document.getElementById("country");
  const countryWrap = document.getElementById("country-combobox");
  const countryDropdown = document.getElementById("country-dropdown");

  const cityInput = document.getElementById("city");
  const cityWrap = document.getElementById("city-combobox");
  const cityDropdown = document.getElementById("city-dropdown");

  function getCitiesForCurrentCountry() {
    const c = (countryInput ? countryInput.value : "").trim();
    return CITIES_BY_COUNTRY[c] || CITIES_BY_COUNTRY["Other"];
  }

  // Setup generic filter-as-you-type combobox
  function setupCombobox(wrap, input, dropdown, getList, onSelect) {
    if (!wrap || !input || !dropdown) return;

    function render(filter = "") {
      const q = filter.trim().toLowerCase();
      const list = getList();
      const matches = q
        ? list.filter((item) => item.toLowerCase().includes(q))
        : list;

      dropdown.innerHTML = "";

      if (!matches.length) {
        const emptyLi = document.createElement("li");
        emptyLi.className = "combobox-item other-item";
        emptyLi.textContent = `Use "${filter}" (Type custom name)`;
        emptyLi.addEventListener("mousedown", (e) => {
          e.preventDefault();
          select(filter);
        });
        dropdown.appendChild(emptyLi);
      } else {
        matches.forEach((item) => {
          const li = document.createElement("li");
          li.className = "combobox-item";
          if (item.toLowerCase().includes("other")) {
            li.classList.add("other-item");
          }
          li.textContent = item;
          li.addEventListener("mousedown", (e) => {
            e.preventDefault();
            select(item);
          });
          dropdown.appendChild(li);
        });
      }

      wrap.classList.add("open");
    }

    function select(item) {
      if (item.toLowerCase().includes("other") && item.toLowerCase().includes("type")) {
        // User clicked "Other (Type your own)" -> clear to allow free typing
        input.value = "";
        input.placeholder = "Type your custom " + (input.id === "country" ? "country" : "city");
        input.focus();
      } else {
        input.value = item;
        input.placeholder = " ";
      }
      wrap.classList.remove("open");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      if (onSelect) onSelect(input.value);
    }

    input.addEventListener("focus", () => {
      render(input.value);
    });

    input.addEventListener("input", () => {
      render(input.value);
    });

    input.addEventListener("blur", () => {
      setTimeout(() => wrap.classList.remove("open"), 180);
    });

    const chevron = wrap.querySelector(".combobox-chevron");
    if (chevron) {
      chevron.style.cursor = "pointer";
      chevron.style.pointerEvents = "auto";
      chevron.addEventListener("click", (e) => {
        e.stopPropagation();
        if (wrap.classList.contains("open")) {
          wrap.classList.remove("open");
        } else {
          input.focus();
          render(input.value);
        }
      });
    }
  }

  // Initialize Searchable Dropdowns
  if (countryInput && cityInput) {
    // Defaults: India & Kanpur
    countryInput.value = "India";
    cityInput.value = "Kanpur";

    setupCombobox(
      countryWrap,
      countryInput,
      countryDropdown,
      () => COUNTRIES,
      (selectedCountry) => {
        // When country changes, clear city and show relevant suggestions
        cityInput.value = "";
        cityInput.placeholder = "Type or select city";
        cityInput.focus();
      }
    );

    setupCombobox(
      cityWrap,
      cityInput,
      cityDropdown,
      getCitiesForCurrentCountry
    );
  }

  // Floating label helper to keep labels consistently elevated when inputs contain values
  function updateFloatingLabels() {
    form?.querySelectorAll(".form-field input, .form-field textarea").forEach((el) => {
      const parent = el.closest(".form-field");
      if (el.value.trim().length > 0) {
        parent?.classList.add("has-value");
      } else {
        parent?.classList.remove("has-value");
      }
    });
  }
  form?.addEventListener("input", updateFloatingLabels);
  updateFloatingLabels();

  // Form submission handler
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Reset previous error indicators
      form.querySelectorAll(".form-field").forEach((f) => f.classList.remove("has-error"));
      status.textContent = "";

      const name = (form.name.value || "").trim();
      const company = (form.company.value || "").trim();
      const email = (form.email.value || "").trim();
      const phone = (form.phone.value || "").trim();
      const country = (form.country.value || "").trim();
      const city = (form.city.value || "").trim();
      const volumeStr = (form.volume.value || "").trim();
      const message = (form.message.value || "").trim();

      const setError = (fieldId, msg) => {
        const input = document.getElementById(fieldId);
        if (input) {
          input.closest(".form-field").classList.add("has-error");
          input.focus();
        }
        status.style.color = "#ff6b6b";
        status.textContent = msg;
      };

      // 1. Full Name validation (min 2, max 60, letters/spaces/punctuation)
      if (name.length < 2 || name.length > 60 || !/^[a-zA-Z\s.'-]+$/.test(name)) {
        setError("name", "Please enter a valid full name (letters and spaces only).");
        return;
      }

      // 2. Company validation (max 80)
      if (company.length > 80) {
        setError("company", "Company name cannot exceed 80 characters.");
        return;
      }

      // 3. Email validation (RFC standard)
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email || !emailRegex.test(email) || email.length > 80) {
        setError("email", "Please provide a valid email address (e.g. name@domain.com).");
        return;
      }

      // 4. Phone validation (international standard, 7 to 15 digits)
      const digitsOnly = phone.replace(/[^0-9]/g, "");
      if (digitsOnly.length < 7 || digitsOnly.length > 15 || !/^\+?[0-9\s\-]{7,16}$/.test(phone)) {
        setError("phone", "Please provide a valid phone number with country code (7 to 15 digits).");
        return;
      }

      // 5. Country and City validation
      if (!country || country.toLowerCase().includes("select country")) {
        setError("country", "Please enter or select your country.");
        return;
      }
      if (!city || city.toLowerCase().includes("select city")) {
        setError("city", "Please enter or select your city.");
        return;
      }

      // 6. Volume validation (strictly an integer >= 100)
      const volumeInt = parseInt(volumeStr, 10);
      if (!Number.isInteger(volumeInt) || volumeInt < 100 || volumeInt > 10000000) {
        setError("volume", "Please enter a valid estimated volume (minimum 100 bricks).");
        return;
      }

      // 7. Message validation (max 500 chars)
      if (message.length > 500) {
        setError("message", "Project description cannot exceed 500 characters.");
        return;
      }

      // Validation passed - proceed with submission
      const btn = form.querySelector(".form-submit");
      btn.classList.add("loading");
      status.style.color = "var(--gold-light)";
      status.textContent = "Submitting your enquiry...";

      const data = {
        name,
        company: company || "N/A",
        email,
        phone,
        city,
        country,
        volume: volumeInt, // Sent as pure integer
        message: message || "N/A",
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
          status.style.color = "var(--gold-light)";
          status.textContent =
            "Thanks! We've received your enquiry and will email you a formal quote shortly.";
          form.reset();
          if (countryInput && cityInput) {
            countryInput.value = "India";
            cityInput.value = "Kanpur";
          }
          updateFloatingLabels();
        })
        .catch(() => {
          btn.classList.remove("loading");
          status.style.color = "#ff6b6b";
          status.textContent =
            "Something went wrong. Please try again or email us directly.";
        });
    });

    // Clear error highlights as user modifies inputs
    form.querySelectorAll("input, select, textarea").forEach((el) => {
      el.addEventListener("input", () => {
        el.closest(".form-field").classList.remove("has-error");
        if (status.style.color === "rgb(255, 107, 107)" || status.style.color === "#ff6b6b") {
          status.textContent = "";
        }
      });
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});
