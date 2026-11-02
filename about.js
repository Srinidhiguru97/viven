/**
 * Viven Aviation — About Us Page Interactive Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initVideoModal();
  initFooterBackToTop();
  initScrollReveals();
});

/* --------------------------------------------------------------------------
   1. NAVBAR & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggleBtn = document.getElementById('mobileMenuToggle');

  // Sticky / scroll shadow
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (toggleBtn && navbar) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navbar.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navbar.classList.remove('mobile-open');
      }
    });

    const navLinks = navbar.querySelectorAll('.nav-link, .nav-cta-btn');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navbar.classList.remove('mobile-open');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. BENTO VIDEO LIGHTBOX / MODAL
   -------------------------------------------------------------------------- */
function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const modalTitle = document.getElementById('modalVideoTitle');
  const modalVideo = document.getElementById('modalVideoPlayer');
  const closeBtn = document.getElementById('modalCloseBtn');
  const backdrop = modal?.querySelector('.video-modal-backdrop');
  const tiles = document.querySelectorAll('.bento-tile[data-video-src]');

  if (!modal || !modalVideo) return;

  function openModal(src, title) {
    modalVideo.src = src;
    if (modalTitle) modalTitle.textContent = title || 'VIVEN AVIATION FOOTAGE';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalVideo.play().catch(() => {});
  }

  function closeModal() {
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.removeAttribute('src');
    modalVideo.load();
    document.body.style.overflow = '';
  }

  tiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      const src = tile.getAttribute('data-video-src');
      const title = tile.getAttribute('data-video-title');
      if (src) {
        openModal(src, title);
      }
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   3. FOOTER BACK TO TOP
   -------------------------------------------------------------------------- */
function initFooterBackToTop() {
  const btn = document.getElementById('footerBackToTop');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   4. SCROLL REVEALS
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.js-reveal').forEach((el) => {
    observer.observe(el);
  });
}
