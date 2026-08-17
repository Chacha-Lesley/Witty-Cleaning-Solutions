// ============================================================
// Witty Cleaning Solutions — site scripts
// Sections: mobile nav / before-after slider / FAQ accordion /
//           testimonial carousel / booking form / footer year
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initBeforeAfterCarousel();
  initFaqAccordion();
  initHeaderScroll();
  initBookingForm();
  initGalleryLightbox();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------------- Gallery lightbox (static galleries) ---------------- */
function initGalleryLightbox() {
  // build lightbox
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="nav prev" aria-label="Previous">‹</button>
    <img src="" alt="Expanded image">
    <button class="nav next" aria-label="Next">›</button>
  `;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('img');
  const btnPrev = lightbox.querySelector('.nav.prev');
  const btnNext = lightbox.querySelector('.nav.next');

  let currentSet = [];
  let currentIndex = 0;

  function openGallery(set, index) {
    currentSet = set;
    currentIndex = index || 0;
    lbImg.src = currentSet[currentIndex];
    lightbox.classList.add('active');
  }

  function closeGallery() {
    lightbox.classList.remove('active');
    lbImg.src = '';
  }

  function showIndex(i) {
    if (!currentSet.length) return;
    currentIndex = (i + currentSet.length) % currentSet.length;
    lbImg.src = currentSet[currentIndex];
  }

  // click on gallery item opens the gallery
  document.querySelectorAll('.gallery-item').forEach(item => {
    const img = item.querySelector('img');
    const data = item.getAttribute('data-gallery') || '';
    const set = data ? data.split('|').map(s => s.trim()).filter(Boolean) : [];
    img.style.cursor = set.length ? 'pointer' : '';
    img.addEventListener('click', () => {
      if (!set.length) return;
      openGallery(set, 0);
    });
  });

  // navigation
  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); showIndex(currentIndex - 1); });
  btnNext.addEventListener('click', (e) => { e.stopPropagation(); showIndex(currentIndex + 1); });

  // close when clicking backdrop or pressing Esc
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lbImg) closeGallery();
  });
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') showIndex(currentIndex - 1);
    if (e.key === 'ArrowRight') showIndex(currentIndex + 1);
  });
}

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
function initBeforeAfterCarousel() {
  const carousel = document.querySelector('.ba-carousel');
  if (!carousel) return;

  const sliders = Array.from(carousel.querySelectorAll('.ba-slider'));
  let active = 0;

  function show(i) {
    sliders.forEach((s, idx) => {
      s.classList.toggle('active', idx === i);
    });
    active = (i + sliders.length) % sliders.length;
    const captionEl = document.getElementById('baCaption');
    if (captionEl) captionEl.textContent = sliders[active].getAttribute('data-caption') || '';
    // update dots
    if (dots && dots.length) {
      dots.forEach((d, idx) => d.classList.toggle('active', idx === active));
    }
  }

  // per-slider setup
  function setupSlider(slider) {
    const beforePanel = slider.querySelector('.panel-before');
    const handle = slider.querySelector('.slider-handle');
    if (!beforePanel || !handle) return;

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

    // clicking on slider jumps
    slider.addEventListener('click', (e) => setPosition(e.clientX));
  }

  sliders.forEach(setupSlider);

  // build pager dots
  const dotsContainer = carousel.querySelector('.ba-dots') || (() => {
    const el = document.createElement('div');
    el.className = 'ba-dots';
    carousel.appendChild(el);
    return el;
  })();
  const dots = sliders.map((_, idx) => {
    const btn = document.createElement('button');
    btn.className = 'ba-dot';
    btn.setAttribute('aria-label', `Show comparison ${idx + 1}`);
    btn.addEventListener('click', (e) => { e.stopPropagation(); show(idx); });
    dotsContainer.appendChild(btn);
    return btn;
  });

  show(0);

  const btnPrev = carousel.querySelector('.ba-nav.prev');
  const btnNext = carousel.querySelector('.ba-nav.next');
  if (btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); show(active - 1); });
  if (btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); show(active + 1); });
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