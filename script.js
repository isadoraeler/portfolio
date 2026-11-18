document.documentElement.classList.add('js');

const root = document.documentElement;

/* ---------- Tema claro/escuro ---------- */
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('portfolio-theme', theme);
  } catch (e) {}
  if (themeToggle) themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
}

if (themeToggle) {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('portfolio-theme');
  } catch (e) {}
  if (savedTheme === 'light' || savedTheme === 'dark') applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ---------- Menu mobile ---------- */
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

function setNav(open) {
  siteNav.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    setNav(!siteNav.classList.contains('is-open'));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNav(false));
  });

  document.addEventListener('click', (e) => {
    if (!siteNav.contains(e.target) && !navToggle.contains(e.target)) setNav(false);
  });
}

/* ---------- Animação de entrada ---------- */
const revealTargets = document.querySelectorAll(
  '.about-grid, .gallery, .process-grid, .tools-grid, .section--contact > *'
);

if ('IntersectionObserver' in window) {
  revealTargets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => observer.observe(el));
}

/* ---------- Modal dos projetos ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightboxClose');
const modalBody = document.getElementById('modalBody');
const modalPanel = document.querySelector('.modal-panel');
let lastFocused = null;

function openProjectModal(projectId, trigger) {
  const template = document.querySelector(
    `template.project-content[data-project="${projectId}"]`
  );
  if (!template) return;

  lastFocused = trigger || document.activeElement;

  modalBody.innerHTML = '';
  modalBody.appendChild(template.content.cloneNode(true));

  const title = modalBody.querySelector('.modal-title');
  if (title) title.id = 'modalTitle';

  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalPanel.scrollTop = 0;
  lightboxClose.focus({ preventScroll: true });
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus({ preventScroll: true });
}

if (lightbox && lightboxClose && modalBody && modalPanel) {
  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => openProjectModal(item.dataset.project, item));
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
      return;
    }

    // Mantém o Tab dentro do modal enquanto ele está aberto
    if (e.key === 'Tab') {
      const focusable = lightbox.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}