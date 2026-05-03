// Language toggle
const languageToggle = document.querySelector('.lang-toggle');
const languageCurrent = document.querySelector('.lang-current');
const translatableElements = document.querySelectorAll('[data-en][data-es]');
const translatableMeta = document.querySelectorAll('[data-en-content][data-es-content]');
const htmlElement = document.documentElement;
const scrambleEl = document.getElementById('scramble-text');

let currentLanguage = localStorage.getItem('siteLanguage') || 'en';

function setLanguage(language) {
  currentLanguage = language;
  localStorage.setItem('siteLanguage', language);
  htmlElement.setAttribute('lang', language);

  translatableElements.forEach((element) => {
    const translation = element.dataset[language];
    if (translation) {
      element.innerHTML = translation;
    }
  });

  translatableMeta.forEach((element) => {
    const translation = element.dataset[`${language}Content`];
    if (translation) {
      element.setAttribute('content', translation);
    }
  });

  // Handle placeholders
  document.querySelectorAll('[data-en-placeholder][data-es-placeholder]').forEach((el) => {
    el.placeholder = el.dataset[`${language}Placeholder`] || el.placeholder;
  });

  if (languageCurrent) {
    languageCurrent.textContent = language.toUpperCase();
  }

  if (languageToggle) {
    languageToggle.setAttribute('aria-pressed', language === 'es' ? 'true' : 'false');
  }

  updateScrambleWords(language);
}

if (languageToggle) {
  languageToggle.addEventListener('click', () => {
    setLanguage(currentLanguage === 'en' ? 'es' : 'en');
  });
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
    });
  });
}

// Canvas particle background
const canvas = document.getElementById('canvas-bg');
const ctx = canvas ? canvas.getContext('2d') : null;

let W;
let H;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

function initParticles() {
  if (!canvas) return;

  particles = [];
  const cols = Math.max(6, Math.floor(W / 65));
  const rows = Math.max(6, Math.floor(H / 65));

  for (let i = 0; i <= cols; i++) {
    for (let j = 0; j <= rows; j++) {
      particles.push({
        x: i * (W / cols),
        y: j * (H / rows),
        ox: i * (W / cols),
        oy: j * (H / rows),
        vx: 0,
        vy: 0,
        size: Math.random() * 1.2 + 0.35
      });
    }
  }
}

let mouseX = 0;
let mouseY = 0;

if (canvas && ctx) {
  resizeCanvas();
  initParticles();

  mouseX = W / 2;
  mouseY = H / 2;

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
  });

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((particle) => {
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = Math.max(0, 90 - distance) / 90;

      particle.vx += (-dx / distance) * force * 1.2;
      particle.vy += (-dy / distance) * force * 1.2;

      particle.vx += (particle.ox - particle.x) * 0.035;
      particle.vy += (particle.oy - particle.y) * 0.035;

      particle.vx *= 0.9;
      particle.vy *= 0.9;

      particle.x += particle.vx;
      particle.y += particle.vy;

      const brightness = Math.min(1, force * 2.5 + 0.12);

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,217,163,${brightness})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);

        if (d < 78) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,217,163,${(1 - d / 78) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  drawParticles();
}

// Hero word swap
let scrambleWords = [];
let wordIndex = 0;
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function updateScrambleWords(language) {
  if (!scrambleEl) return;

  const wordsAttribute = language === 'es' ? 'wordsEs' : 'wordsEn';
  scrambleWords = (scrambleEl.dataset[wordsAttribute] || scrambleEl.dataset.wordsEn || 'websites')
    .split(',')
    .map((word) => word.trim());

  wordIndex = 0;
  scrambleEl.textContent = scrambleWords[0];
}

function scramble(target) {
  if (!scrambleEl) return;

  let iteration = 0;

  const interval = setInterval(() => {
    scrambleEl.textContent = target
      .split('')
      .map((_, index) => {
        return index < iteration ? target[index] : chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');

    if (iteration >= target.length) clearInterval(interval);
    iteration += 0.5;
  }, 35);
}

updateScrambleWords(currentLanguage);

setInterval(() => {
  if (!scrambleWords.length) return;
  wordIndex = (wordIndex + 1) % scrambleWords.length;
  scramble(scrambleWords[wordIndex]);
}, 3000);

// Start with saved language
setLanguage(currentLanguage);

// ─── Lead form handling ────────────────────────────────────────────────────────
// FormSubmit.co does a real HTTP POST and redirects the browser to _next.
// We do NOT preventDefault — we let the form submit normally so FormSubmit
// receives the data and emails it. The _next hidden field handles the redirect
// to thank-you.html automatically.
//
// The only JS we add here is a loading state on the button so the user
// knows something is happening while FormSubmit processes the request.
const leadForms = document.querySelectorAll('.lead-form');

leadForms.forEach((form) => {
  // Clear placeholder textarea value on focus so users don't have to delete it.
  const messageTextarea = form.querySelector('textarea[name="message"]');
  if (messageTextarea) {
    const defaultText = messageTextarea.value.trim();
    messageTextarea.addEventListener('focus', function () {
      if (this.value.trim() === defaultText) {
        this.value = '';
      }
    });
    messageTextarea.addEventListener('blur', function () {
      if (this.value.trim() === '') {
        this.value = defaultText;
      }
    });
  }

  form.addEventListener('submit', function () {
    // Show loading state — form submits normally, browser navigates to thank-you.html.
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = currentLanguage === 'es' ? 'Enviando…' : 'Sending…';
      submitBtn.disabled = true;
    }
    // Do NOT call e.preventDefault() — let FormSubmit handle delivery + redirect.
  });
});
