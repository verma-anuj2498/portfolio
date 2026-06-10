/* ─────────────────────────────────────────────
   Anuj Kumar — Portfolio Scripts
   ───────────────────────────────────────────── */

/* ─── Dark mode toggle ─── */
const themeToggle = document.getElementById('themeToggle');
const root        = document.documentElement;

// Restore saved preference or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
root.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', next);
});

/* ─── Navbar: scroll shadow + active section highlight ─── */
const navbar    = document.getElementById('navbar');
const scrollBtn = document.getElementById('scrollTop');
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

function onScroll() {
  // Shadow on scroll
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // Show/hide scroll-to-top button
  scrollBtn.classList.toggle('visible', window.scrollY > 400);

  // Active nav link: highlight the section currently in view
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ─── Scroll-to-top button ─── */
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── Mobile hamburger menu ─── */
const hamburger = document.getElementById('hamburger');
const navList   = document.getElementById('navList');

hamburger.addEventListener('click', () => {
  const isOpen = navList.classList.toggle('mobile-open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when a link is clicked
navList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('mobile-open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ─── Reveal on scroll (IntersectionObserver) ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger cards within the same parent
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sib, idx) => {
        if (sib === entry.target) delay = idx * 60;
      });
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.ach-card, .tl-role, .edu-card, .contact-card, .timeline-item'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ─── Animated number counter (stats strip) ─── */
function animateCounter(el, target, duration = 1200) {
  const isFloat = target % 1 !== 0;
  const start   = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value  = eased * target;
    el.textContent = isFloat
      ? value.toFixed(1)
      : Math.floor(value) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + (el.dataset.suffix || '');
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const raw    = el.dataset.value;
        const suffix = el.dataset.suffix || '';
        el.textContent = '0' + suffix;
        animateCounter(el, parseFloat(raw));
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ─── Chip hover: ripple effect ─── */
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;width:6px;height:6px;border-radius:50%;
      background:rgba(37,99,235,.4);transform:scale(0);
      animation:ripple .5s ease-out forwards;
      left:${e.offsetX - 3}px;top:${e.offsetY - 3}px;pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// Ripple keyframe injected once
const styleSheet = document.styleSheets[0];
try {
  styleSheet.insertRule(`
    @keyframes ripple {
      to { transform: scale(30); opacity: 0; }
    }
  `, styleSheet.cssRules.length);
} catch (_) {}

/* ─── Smooth scroll offset for fixed navbar ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY
              - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
