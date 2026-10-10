/* ==========================================================================
   VIVEN AVIATION - INTERACTION & INTERACTIVE PLATFORM LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBrandLoaderSequence();
  initNavbarScrollState();
  initMobileMenu();
  initHeroAtmosphereMotion();
  initInteractiveHelp();
  initEcosystemNodes();
  initSolutionsAccordion();
  initCharterShowcase();
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
   3. SECTION 02 — FIVE EDITORIAL SERVICE CARDS INTERACTIVITY
   -------------------------------------------------------------------------- */
function initInteractiveHelp() {
  const cards = document.querySelectorAll('.req-card');
  const card1 = document.getElementById('reqCard1');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (card !== card1 && card1) {
        card1.classList.remove('req-card-highlight');
      }
    });

    card.addEventListener('mouseleave', () => {
      setTimeout(() => {
        const isAnyHovered = Array.from(cards).some(c => c.matches(':hover'));
        if (!isAnyHovered && card1) {
          card1.classList.add('req-card-highlight');
        }
      }, 50);
    });
  });
}

/* --------------------------------------------------------------------------
   4. SECTION 04 — INTERACTIVE AVIATION ECOSYSTEM NETWORK
   -------------------------------------------------------------------------- */
function initEcosystemNodes() {
  const nodes = document.querySelectorAll('.ecosystem-node');
  const infoTitle = document.getElementById('ecoInfoTitle');
  const infoDesc = document.getElementById('ecoInfoDesc');

  if (!nodes.length) return;

  const nodeData = {
    aircraft: {
      title: 'AIRCRAFT ASSETS',
      desc: 'Commercial, corporate, and specialized mission airframes connected for charter, sale, or lease.'
    },
    operators: {
      title: 'FLIGHT OPERATORS',
      desc: 'Certified AOC holders and flight management teams supported with ACMI and fleet capacity.'
    },
    owners: {
      title: 'AIRCRAFT OWNERS',
      desc: 'Private and corporate owners optimizing asset utilization and lifecycle financing.'
    },
    clients: {
      title: 'CHARTER & B2B CLIENTS',
      desc: 'Executives, corporations, and travel managers seeking reliable private flight logistics.'
    },
    investors: {
      title: 'CAPITAL INVESTORS',
      desc: 'Financial institutions and private funds participating in structured aviation debt and equity.'
    },
    suppliers: {
      title: 'COMPONENT SUPPLIERS',
      desc: 'MRO facilities, engine overhaul shops, and certified parts manufacturers.'
    },
    capital: {
      title: 'AVIATION CAPITAL',
      desc: 'Tailored financial structures backing fleet acquisitions, dry-leases, and engine overhauls.'
    }
  };

  nodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      const ecoKey = node.getAttribute('data-eco');
      const data = nodeData[ecoKey];
      if (!data) return;

      nodes.forEach((n) => n.classList.remove('active'));
      node.classList.add('active');

      if (infoTitle) infoTitle.textContent = data.title;
      if (infoDesc) infoDesc.textContent = data.desc;

      // Highlight line
      const lines = document.querySelectorAll('.eco-line');
      lines.forEach((l) => (l.style.stroke = 'rgba(10, 22, 40, 0.15)'));
      const activeLine = document.getElementById(`line-${ecoKey}`);
      if (activeLine) {
        activeLine.style.stroke = '#5ea82e';
        activeLine.style.strokeWidth = '2.5';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. SECTION 05 — STACKED SOLUTIONS ACCORDION
   -------------------------------------------------------------------------- */
function initSolutionsAccordion() {
  const items = document.querySelectorAll('.solution-item');
  const featuredImg = document.getElementById('solFeaturedImg');
  const featuredBadge = document.getElementById('solFeaturedBadge');

  if (!items.length) return;

  items.forEach((item) => {
    item.addEventListener('click', () => {
      items.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');

      const imgSrc = item.getAttribute('data-sol-img');
      const badgeText = item.getAttribute('data-sol-badge');

      if (featuredImg && imgSrc) featuredImg.src = imgSrc;
      if (featuredBadge && badgeText) featuredBadge.textContent = badgeText;
    });
  });
}

/* --------------------------------------------------------------------------
   6. SECTION 06 — AIRCRAFT CHARTER SHOWCASE
   -------------------------------------------------------------------------- */
function initCharterShowcase() {
  const tabs = document.querySelectorAll('.charter-tab');
  const stageImg = document.getElementById('charterStageImg');
  const modelName = document.getElementById('charterModelName');
  const modelDesc = document.getElementById('charterModelDesc');
  const specsRow = document.getElementById('charterSpecsRow');

  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const imgSrc = tab.getAttribute('data-charter-img');
      const nameText = tab.getAttribute('data-name');
      const descText = tab.getAttribute('data-desc');
      const specsText = tab.getAttribute('data-specs');

      if (stageImg && imgSrc) stageImg.src = imgSrc;
      if (modelName && nameText) modelName.textContent = nameText;
      if (modelDesc && descText) modelDesc.textContent = descText;

      if (specsRow && specsText) {
        const specsArr = specsText.split(' | ');
        specsRow.innerHTML = specsArr
          .map((s) => `<div class="spec-pill">${s}</div>`)
          .join('');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. SECTION 08 — B2B COMPONENT CATEGORIES
   -------------------------------------------------------------------------- */
function initComponentCategories() {
  const items = document.querySelectorAll('.comp-cat-item');
  const img = document.getElementById('compPreviewImg');
  const title = document.getElementById('compPreviewTitle');
  const desc = document.getElementById('compPreviewDesc');

  if (!items.length) return;

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      items.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');

      const imgSrc = item.getAttribute('data-comp-img');
      const titleText = item.getAttribute('data-comp-title');
      const descText = item.getAttribute('data-comp-desc');

      if (img && imgSrc) img.src = imgSrc;
      if (title && titleText) title.textContent = titleText;
      if (desc && descText) desc.textContent = descText;
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
