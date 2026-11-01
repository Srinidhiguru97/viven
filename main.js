/* ==========================================================================
   VIVEN AVIATION - INTERACTION & INTERACTIVE PLATFORM LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBrandLoaderSequence();
  initNavbarScrollState();
  initMobileMenu();
  initHeroAtmosphereMotion();
  initWhoWeAreSection();
  initSolutionsAccordion();
  initComponentCategories();
  initTeamSpotlight();
  initFinalCtaSelector();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. BRAND REVEAL LOADER SEQUENCE
   -------------------------------------------------------------------------- */
function initBrandLoaderSequence() {
  const loader = document.getElementById('vivenBrandLoader');
  const heroSection = document.getElementById('hero');

  if (!loader) {
    if (heroSection) heroSection.classList.add('loaded');
    return;
  }

  document.body.style.overflow = 'hidden';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    setTimeout(() => {
      finishIntro();
    }, 400);
    return;
  }

  setTimeout(() => {
    loader.classList.add('active');
  }, 180);

  setTimeout(() => {
    finishIntro();
  }, 1850);

  function finishIntro() {
    loader.classList.add('finish');
    document.body.style.overflow = '';

    if (heroSection) {
      heroSection.classList.add('loaded');
    }

    setTimeout(() => {
      loader.style.display = 'none';
    }, 600);
  }
}

/* --------------------------------------------------------------------------
   2. NAVBAR SCROLL STATE & HERO ATMOSPHERE PARALLAX
   -------------------------------------------------------------------------- */
function initNavbarScrollState() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initMobileMenu() {
  const navbar = document.getElementById('navbar');
  const toggleBtn = document.getElementById('mobileMenuToggle');
  if (!navbar || !toggleBtn) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navbar.classList.toggle('mobile-open');
  });

  // Close menu when clicking outside or clicking a nav link
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navbar.classList.remove('mobile-open');
    }
  });

  const navLinks = navbar.querySelectorAll('.nav-link, .nav-cta-btn');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('mobile-open');
    });
  });
}

function initHeroAtmosphereMotion() {
  const heroSection = document.getElementById('hero');
  const heroBgMedia = document.getElementById('heroBgVideo') || document.getElementById('heroBgImg');
  if (!heroSection || !heroBgMedia) return;

  const heroVideo = document.getElementById('heroBgVideo');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.play().catch(err => {
      console.warn('Hero video autoplay restriction:', err);
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX = (e.clientX - centerX) / (rect.width / 2);
    mouseY = (e.clientY - centerY) / (rect.height / 2);
  });

  heroSection.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
  });

  function animateHeroMotion() {
    targetX += (mouseX * 14 - targetX) * 0.05;
    targetY += (mouseY * 8 - targetY) * 0.05;

    const scrollY = window.scrollY;
    const scrollParallaxY = Math.min(scrollY * 0.2, 180);

    heroBgMedia.style.transform = `scale(1.05) translate3d(${-targetX}px, ${scrollParallaxY - targetY}px, 0)`;

    requestAnimationFrame(animateHeroMotion);
  }

  animateHeroMotion();
}

/* --------------------------------------------------------------------------
   5. SECTION 05 — WHAT WE DO ACCORDION & AIRCRAFT PARALLAX
   -------------------------------------------------------------------------- */
function initSolutionsAccordion() {
  const items = document.querySelectorAll('.wwd-acc-item');
  const frame = document.getElementById('wwdImageFrame');
  const visualCol = document.getElementById('wwdVisualCol');
  const offeringsBlock = document.getElementById('aviation-solutions');

  // 1. Interactive Accordion (Single Item Expanded at a time)
  if (items.length) {
    items.forEach((item) => {
      const header = item.querySelector('.wwd-acc-header');
      if (!header) return;

      header.addEventListener('click', (e) => {
        e.preventDefault();
        const isCurrentlyActive = item.classList.contains('active');

        // Close all items
        items.forEach((i) => {
          i.classList.remove('active');
          const h = i.querySelector('.wwd-acc-header');
          if (h) h.setAttribute('aria-expanded', 'false');
        });

        // Toggle: if it wasn't active, activate it
        if (!isCurrentlyActive) {
          item.classList.add('active');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // 2. Reduced Motion Check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // 3. Subtle Scroll-Reveal for What We Do Section & Aircraft Frame
  if (offeringsBlock && 'IntersectionObserver' in window) {
    offeringsBlock.classList.add('wwd-reveal-init');

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          offeringsBlock.classList.add('wwd-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(offeringsBlock);
  }

  // 4. Subtle Parallax Movement for the Aircraft Frame
  if (visualCol && frame && window.innerWidth > 1024) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;
    let rafId = null;

    const onMouseMove = (e) => {
      const rect = visualCol.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX = (e.clientX - centerX) / (rect.width / 2);
      mouseY = (e.clientY - centerY) / (rect.height / 2);
    };

    visualCol.addEventListener('mouseenter', () => {
      isHovering = true;
      if (!rafId) rafId = requestAnimationFrame(animateParallax);
    });

    visualCol.addEventListener('mousemove', onMouseMove);

    visualCol.addEventListener('mouseleave', () => {
      isHovering = false;
      mouseX = 0;
      mouseY = 0;
    });

    function animateParallax() {
      currentX += (mouseX * 8 - currentX) * 0.08;
      currentY += (mouseY * 6 - currentY) * 0.08;

      if (frame) {
        frame.style.transform = `skewX(-14deg) translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      if (isHovering || Math.abs(currentX) > 0.05 || Math.abs(currentY) > 0.05) {
        rafId = requestAnimationFrame(animateParallax);
      } else {
        if (frame) {
          frame.style.transform = '';
        }
        rafId = null;
      }
    }
  }
}

/* --------------------------------------------------------------------------
   6. SECTION 07 — B2B COMPONENT CATEGORIES
   -------------------------------------------------------------------------- */
function initComponentCategories() {
  const items = document.querySelectorAll('.comp-cat-item');
  const img = document.getElementById('compPreviewImg');
  const title = document.getElementById('compPreviewTitle');
  const desc = document.getElementById('compPreviewDesc');

  if (!items.length) return;

  function activateItem(item, shouldCenter = false) {
    if (item.classList.contains('active')) {
      if (shouldCenter && window.innerWidth <= 768) {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      return;
    }

    items.forEach((i) => {
      i.classList.remove('active');
      i.setAttribute('aria-selected', 'false');
    });

    item.classList.add('active');
    item.setAttribute('aria-selected', 'true');

    const imgSrc = item.getAttribute('data-comp-img');
    const titleText = item.getAttribute('data-comp-title');
    const descText = item.getAttribute('data-comp-desc');

    if (img && imgSrc) {
      img.style.opacity = '0.35';
      setTimeout(() => {
        img.src = imgSrc;
        img.style.opacity = '1';
      }, 120);
    }

    if (title && titleText) {
      title.textContent = titleText;
    }

    if (desc && descText) {
      desc.textContent = descText;
    }

    if (shouldCenter && window.innerWidth <= 768) {
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  items.forEach((item) => {
    // Click listener for mobile and desktop
    item.addEventListener('click', (e) => {
      e.preventDefault();
      activateItem(item, true);
    });

    // Keyboard support (Enter / Space)
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateItem(item, true);
      }
    });

    // Desktop hover preview for pointers
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768 && window.matchMedia('(hover: hover)').matches) {
        activateItem(item, false);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. SECTION 12 — EDITORIAL TEAM SPOTLIGHT
   -------------------------------------------------------------------------- */
function initTeamSpotlight() {
  const btns = document.querySelectorAll('.team-profile-btn');
  const img = document.getElementById('teamFeaturedImg');
  const role = document.getElementById('teamFeaturedRole');
  const name = document.getElementById('teamFeaturedName');
  const bio = document.getElementById('teamFeaturedBio');

  if (!btns.length) return;

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const imgSrc = btn.getAttribute('data-team-img');
      const roleText = btn.getAttribute('data-role');
      const nameText = btn.getAttribute('data-name');
      const bioText = btn.getAttribute('data-bio');

      if (img && imgSrc) img.src = imgSrc;
      if (role && roleText) role.textContent = roleText;
      if (name && nameText) name.textContent = nameText;
      if (bio && bioText) bio.textContent = bioText;
    });
  });
}

/* --------------------------------------------------------------------------
   9. SECTION 14 — FINAL REQUIREMENT CTA SELECTOR
   -------------------------------------------------------------------------- */
function initFinalCtaSelector() {
  const btns = document.querySelectorAll('.final-opt-btn');
  const enquirySelect = document.getElementById('enquiryType');

  if (!btns.length) return;

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const val = btn.getAttribute('data-req-val');
      if (enquirySelect && val) {
        enquirySelect.value = val;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. SECTION 15 — CONTACT FORM SUBMISSION
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('vivenContactForm');
  const successBox = document.getElementById('contactSuccessBox');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (form.checkValidity()) {
      form.style.display = 'none';
      if (successBox) successBox.style.display = 'block';
    }
  });
}

/* --------------------------------------------------------------------------
   11. SECTION 03 — WHO WE ARE / OUR STORY (ANIMATIONS & SUBTLE PARALLAX)
   -------------------------------------------------------------------------- */
function initWhoWeAreSection() {
  const section = document.getElementById('about');
  const factsStrip = document.getElementById('aboutFactsStrip');
  const parallaxImg = document.getElementById('aboutParallaxImg');

  if (!section) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Setup reveal observers
  if (!prefersReducedMotion) {
    section.classList.add('js-reveal');
    if (factsStrip) factsStrip.classList.add('js-reveal');

    // Reveal headline and intro content
    const introObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add('is-revealed');
          introObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    introObserver.observe(section);

    // Reveal facts strip sequentially
    if (factsStrip) {
      const factsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            factsStrip.classList.add('is-revealed');
            factsObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.2,
        rootMargin: '0px 0px -20px 0px'
      });

      factsObserver.observe(factsStrip);
    }
  } else {
    // If reduced motion, immediately show
    section.classList.add('is-revealed');
    if (factsStrip) factsStrip.classList.add('is-revealed');
  }

  // 2. Subtle Scroll-Based Parallax for Photograph
  if (parallaxImg && !prefersReducedMotion) {
    let ticking = false;

    const updateParallax = () => {
      if (window.innerWidth <= 768) {
        parallaxImg.style.transform = 'none';
        ticking = false;
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Only calculate if section is in or near viewport
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const totalTravel = viewportHeight + rect.height;
        const currentProgress = (viewportHeight - rect.top) / totalTravel;
        // Restrained subtle parallax: max shift from -28px to +28px
        const maxOffset = 28;
        const translateY = (currentProgress - 0.5) * (maxOffset * 2);

        parallaxImg.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateParallax();
  }
}


