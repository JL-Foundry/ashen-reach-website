/* ============================================================
   MAIN.JS — The Ashen Reach
   Site-wide JavaScript
   ============================================================ */

'use strict';

/* ── MOBILE NAV ─────────────────────────────────────────── */
(function initMobileNav() {
  const btn     = document.getElementById('navMenuBtn');
  const drawer  = document.getElementById('navDrawer');
  const overlay = document.getElementById('navOverlay');
  if (!btn || !drawer) return;

  function open() {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    btn.textContent = '✕ Close';
    document.body.style.overflow = 'hidden';
  }
  function close() {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    btn.textContent = '☰ Menu';
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () =>
    drawer.classList.contains('open') ? close() : open()
  );
  if (overlay) overlay.addEventListener('click', close);

  // Close on nav link tap (mobile)
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

/* ── TICKER DUPLICATION ──────────────────────────────────── */
// Ensures seamless loop by duplicating ticker content
(function initTicker() {
  const inner = document.querySelector('.ticker-inner');
  if (!inner) return;
  // Content is already duplicated in HTML for seamless loop
  // Pause on hover is handled via CSS
})();

/* ── ACTIVE NAV LINK ─────────────────────────────────────── */
(function initActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    const page = link.getAttribute('data-page');
    if (
      (page === 'home' && (path === '/' || path === '/index.html')) ||
      (page !== 'home' && path.includes(page))
    ) {
      link.classList.add('active');
    }
  });
})();

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height')
      ) || 52;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── INTERSECTION OBSERVER — fade in sections ────────────── */
(function initFadeIn() {
  const style = document.createElement('style');
  style.textContent = `
    .fade-in { opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .fade-in.visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const els = document.querySelectorAll('[data-fade]');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => {
    el.classList.add('fade-in');
    obs.observe(el);
  });
})();

/* ── EMAIL CAPTURE ───────────────────────────────────────── */
(function initEmailCapture() {
  const forms = document.querySelectorAll('[data-email-form]');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button[type="submit"]');
      const msg   = form.querySelector('[data-form-msg]');
      if (!input) return;

      const email = input.value.trim();
      if (!email || !email.includes('@')) {
        if (msg) { msg.textContent = '// INVALID COMM ADDRESS'; msg.style.color = 'var(--ember)'; }
        return;
      }

      // Disable while submitting
      if (btn) { btn.disabled = true; btn.textContent = 'TRANSMITTING...'; }

      // TODO: Replace with actual Mailchimp/ConvertKit endpoint
      // For now, simulate success
      setTimeout(() => {
        input.value = '';
        if (btn) { btn.disabled = false; btn.textContent = 'SIGNAL RECEIVED'; }
        if (msg) {
          msg.textContent = '// TRANSMISSION CONFIRMED — WELCOME TO THE REACH';
          msg.style.color = 'var(--toxic-2)';
        }
        setTimeout(() => {
          if (btn) btn.textContent = 'Transmit Registration';
          if (msg) msg.textContent = '';
        }, 5000);
      }, 1200);
    });
  });
})();

/* ── COPY TO CLIPBOARD (for codex share buttons) ─────────── */
window.copyToClipboard = function(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Visual feedback handled inline
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
};

/* ── FACTION TAB SWITCHER ────────────────────────────────── */
window.initTabs = function(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const tabs    = container.querySelectorAll('[data-tab]');
  const panels  = container.querySelectorAll('[data-panel]');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.hidden = true);
      tab.classList.add('active');
      const panel = container.querySelector(`[data-panel="${target}"]`);
      if (panel) panel.hidden = false;
    });
  });

  // Activate first tab
  if (tabs[0]) tabs[0].click();
};

/* ── ACCORDION ───────────────────────────────────────────── */
window.initAccordion = function(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.querySelectorAll('[data-accordion-toggle]').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const body  = toggle.nextElementSibling;
      const arrow = toggle.querySelector('[data-arrow]');
      const open  = body && body.classList.contains('open');

      // Close all
      container.querySelectorAll('[data-accordion-body]').forEach(b => b.classList.remove('open'));
      container.querySelectorAll('[data-arrow]').forEach(a => a.textContent = '▾');

      // Open clicked (if it was closed)
      if (!open && body) {
        body.classList.add('open');
        if (arrow) arrow.textContent = '▴';
      }
    });
  });
};

/* ── READING PROGRESS ────────────────────────────────────── */
window.initReadingProgress = function(storySelector, ...barSelectors) {
  const story = document.querySelector(storySelector);
  if (!story) return;

  function update() {
    const rect   = story.getBoundingClientRect();
    const total  = story.offsetHeight;
    const scrolled = Math.max(0, -rect.top + window.innerHeight * 0.5);
    const pct    = Math.min(100, Math.round((scrolled / total) * 100));
    const val    = pct + '%';

    barSelectors.forEach(sel => {
      const bar = document.querySelector(sel);
      if (bar) bar.style.width = val;
    });

    document.querySelectorAll('[data-progress-pct]').forEach(el => {
      el.textContent = val;
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
};
