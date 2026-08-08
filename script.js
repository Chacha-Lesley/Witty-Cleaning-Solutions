// ============================================================
// Witty Cleaning Solutions — site scripts
// Sections: mobile nav / before-after slider / FAQ accordion /
//           testimonial carousel / booking form / footer year
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initBeforeAfterSlider();
  initFaqAccordion();
  initHeaderScroll();
  initBookingForm();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------------- Mobile nav toggle ---------------- */
function initMobileNav() {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('navToggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a nav link is tapped
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------- Before / After drag slider ---------------- */
function initBeforeAfterSlider() {
  const slider = document.getElementById('baSlider');
  const beforePanel = document.getElementById('beforePanel');
  const handle = document.getElementById('sliderHandle');
  if (!slider) return;

  let dragging = false;

  const setPosition = (clientX) => {
    const rect = slider.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(5, Math.min(95, pct));
    beforePanel.style.width = pct + '%';
    handle.style.left = pct + '%';
  };

  const start = () => { dragging = true; };
  const stop = () => { dragging = false; };
  const move = (e) => {
    if (!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setPosition(clientX);
  };

  handle.addEventListener('mousedown', start);
  window.addEventListener('mouseup', stop);
  window.addEventListener('mousemove', move);

  handle.addEventListener('touchstart', start, { passive: true });
  window.addEventListener('touchend', stop);
  window.addEventListener('touchmove', move, { passive: true });

  // Also allow clicking anywhere on the slider to jump to that position
  slider.addEventListener('click', (e) => setPosition(e.clientX));
}

/* ---------------- FAQ accordion ---------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others (accordion behavior)
      items.forEach(other => {
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-a').style.maxHeight = null;
      });

      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ---------------- Header scroll hide/show ---------------- */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('navToggle');
  if (!header) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (header.classList.contains('nav-open')) {
      header.classList.remove('nav-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }

    if (currentScrollY > 80 && currentScrollY > lastScrollY) {
      header.classList.add('is-hidden');
    } else {
      header.classList.remove('is-hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}

/* ---------------- Booking form ---------------- */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // TODO: the brief calls for an automatic WhatsApp/email notification
    // to Witty Cleaning Solutions on submission. That requires a backend
    // or a service like Formspree / Web3Forms / EmailJS, or the WhatsApp
    // Business API — plug the integration in here. This currently just
    // confirms locally so the form is testable with no backend.

    const data = Object.fromEntries(new FormData(form).entries());
    console.log('Quote request submitted:', data);

    note.textContent = `Thanks, ${data.fName.split(' ')[0]}! We'll reach out by phone or WhatsApp shortly to confirm your quote.`;
    form.reset();
  });
}