/* ==========================================================
   Vroxx landing page — script.js (no libraries)
   1. Smooth eased scrolling for in-page links
   2. "Coming soon" popup for the Google Play buttons
   3. Smart-target Accept / Dismiss demo
   4. Reminder on/off toggles
   ========================================================== */

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Smooth scroll ---------- */
  let scrollFrame = 0;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function scrollToY(target) {
    if (reduceMotion) { window.scrollTo(0, target); return; }
    cancelAnimationFrame(scrollFrame);
    const start = window.scrollY;
    const distance = target - start;
    const duration = Math.min(1500, 700 + Math.abs(distance) * 0.2);
    const t0 = performance.now();
    // turn off CSS smooth scrolling while JS animates, so they don't fight
    document.documentElement.style.scrollBehavior = 'auto';
    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      window.scrollTo(0, start + distance * ease(t));
      if (t < 1) scrollFrame = requestAnimationFrame(step);
      else document.documentElement.style.scrollBehavior = '';
    };
    scrollFrame = requestAnimationFrame(step);
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.scrollY - 8;
      scrollToY(Math.max(0, y));
      history.replaceState(null, '', '#' + id);
    });
  });

  /* ---------- 2. Coming soon popup ---------- */
  const modal = document.getElementById('soonModal');
  let lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const btn = modal.querySelector('.modal-card .btn');
    if (btn) btn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('.js-coming-soon').forEach((btn) => btn.addEventListener('click', openModal));
  modal.querySelectorAll('[data-close-modal]').forEach((btn) => btn.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  /* ---------- 3. Smart target demo ---------- */
  const actions = document.getElementById('suggestActions');
  const result = document.getElementById('suggestResult');
  const resultText = document.getElementById('suggestText');

  actions.querySelectorAll('[data-target-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      resultText.textContent = btn.dataset.targetChoice === 'accepted'
        ? 'Target updated to 1,850 kcal.'
        : 'Kept your current target.';
      actions.hidden = true;
      result.hidden = false;
    });
  });

  document.getElementById('suggestReset').addEventListener('click', () => {
    result.hidden = true;
    actions.hidden = false;
  });

  /* ---------- 4. Reminder toggles ---------- */
  document.querySelectorAll('.toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', String(!on));
    });
  });
})();
