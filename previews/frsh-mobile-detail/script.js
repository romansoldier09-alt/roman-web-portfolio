/* ============================================================
   FRSH Mobile Detail — script.js
   Features: Sticky nav, mobile menu, scroll reveal,
             FAQ accordion, smooth scroll
   ============================================================ */

'use strict';

/* ---- NAVBAR SCROLL STATE ---- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load
})();


/* ---- MOBILE MENU ---- */
const navToggle   = document.getElementById('navToggle');
const mobileMenu  = document.getElementById('mobileMenu');

function closeMobileMenu() {
  if (!navToggle || !mobileMenu) return;
  navToggle.classList.remove('open');
  mobileMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

(function initMobileMenu() {
  if (!navToggle || !mobileMenu) return;

  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
})();

// Expose to inline onclick handlers in HTML
window.closeMobileMenu = closeMobileMenu;


/* ---- SCROLL REVEAL ---- */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
})();


/* ---- FAQ ACCORDION ---- */
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherButton = other.querySelector('.faq-question');
          if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle this item
      item.classList.toggle('active', !isActive);
      question.setAttribute('aria-expanded', String(!isActive));
    });
  });
})();


/* ---- SMOOTH SCROLL for anchor links ---- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });

      // Close mobile menu if open
      closeMobileMenu();
    });
  });
})();


/* ---- FORM VALIDATION (quote form) ---- */
(function initForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    // Basic HTML5 validation handles required fields.
    // Add custom logic below if needed.

    // REPLACE: To integrate with a real backend (Formspree, Netlify, etc.),
    //          change form action and optionally handle via fetch() here.
    //          Example with Formspree:
    //
    //   e.preventDefault();
    //   const data = new FormData(form);
    //   fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //     method: 'POST',
    //     body: data,
    //     headers: { 'Accept': 'application/json' }
    //   }).then(r => {
    //     if (r.ok) window.location.href = 'thank-you.html';
    //   });
  });
})();


/* ---- ACTIVE NAV LINK on scroll ---- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollY = window.scrollY + 120;

    sections.forEach((section) => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ---- PHONE NUMBER FORMATTING ---- */
(function initPhoneFormat() {
  const phoneInput = document.getElementById('phone');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', function () {
    let value = this.value.replace(/\D/g, '').slice(0, 10);
    if (value.length >= 6) {
      value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
    } else if (value.length >= 3) {
      value = `(${value.slice(0,3)}) ${value.slice(3)}`;
    }
    this.value = value;
  });
})();
