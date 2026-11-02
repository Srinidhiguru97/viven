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
  initGlobalNetworkMap();
  initTeamSpotlight();
  initContactForm();
  initFooterBackToTop();
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
  const items = Array.from(document.querySelectorAll('.comp-cat-item'));
  const prevBtn = document.getElementById('compNavPrev');
  const nextBtn = document.getElementById('compNavNext');
  const img = document.getElementById('compPreviewImg');
  const title = document.getElementById('compPreviewTitle');
  const desc = document.getElementById('compPreviewDesc');

  if (!items.length) return;

  function activateItem(item, shouldCenter = false) {
    if (item.classList.contains('active')) {
      if (shouldCenter && window.innerWidth <= 768 && window.innerWidth > 426) {
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

    if (shouldCenter && window.innerWidth <= 768 && window.innerWidth > 426) {
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  function getActiveIndex() {
    const idx = items.findIndex((i) => i.classList.contains('active'));
    return idx >= 0 ? idx : 0;
  }

  function navigateStep(direction) {
    const currentIndex = getActiveIndex();
    let newIndex = currentIndex + direction;
    if (newIndex < 0) {
      newIndex = items.length - 1;
    } else if (newIndex >= items.length) {
      newIndex = 0;
    }
    activateItem(items[newIndex], true);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigateStep(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigateStep(1);
    });
  }

  // Swipe gesture support on mobile under 426px
  const catsList = document.querySelector('.comp-cats-list');
  if (catsList) {
    let touchStartX = 0;
    let touchStartY = 0;

    catsList.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    catsList.addEventListener('touchend', (e) => {
      if (window.innerWidth <= 426 && e.changedTouches && e.changedTouches.length) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX < 0) {
            navigateStep(1);
          } else {
            navigateStep(-1);
          }
        }
      }
    }, { passive: true });
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
   10. SECTION 15 — CONTACT FORM SUBMISSION
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('vivenContactForm');
  const successBox = document.getElementById('contactSuccessBox');
  const errorBox = document.getElementById('contactErrorBox');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const fallbackLink = document.getElementById('fallbackMailLink');

  if (!form) return;

  const RECIPIENT_EMAIL = 'srinidhidevices@gmail.com';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (errorBox) errorBox.style.display = 'none';

    // Validate form inputs
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const fullName = (document.getElementById('fullName')?.value || '').trim();
    const emailAddress = (document.getElementById('emailAddress')?.value || '').trim();
    const company = (document.getElementById('company')?.value || '').trim() || 'N/A';
    const enquiryType = document.getElementById('enquiryType')?.value || 'General Inquiry';
    const message = (document.getElementById('message')?.value || '').trim();

    // Prepare payload for FormSubmit
    const payload = {
      name: fullName,
      email: emailAddress,
      company: company,
      requirement_type: enquiryType,
      message: message,
      _subject: `New Aviation Inquiry: ${enquiryType} - ${fullName}`,
      _template: 'table',
      _captcha: 'false'
    };

    // Update submit button state
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '<span>SEND ENQUIRY →</span>';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>TRANSMITTING INQUIRY...</span>';
    }

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok || result.success === 'true' || result.success === true) {
        // Success
        form.reset();
        form.style.display = 'none';
        if (successBox) successBox.style.display = 'block';
      } else {
        throw new Error(result.message || 'Server error');
      }
    } catch (err) {
      console.warn('Form transmission warning, enabling email fallback:', err);

      const mailtoSubject = encodeURIComponent(`New Aviation Inquiry: ${enquiryType} - ${fullName}`);
      const mailtoBody = encodeURIComponent(
        `Full Name: ${fullName}\nEmail: ${emailAddress}\nCompany: ${company}\nRequirement: ${enquiryType}\n\nMessage:\n${message}`
      );
      const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;

      if (fallbackLink) {
        fallbackLink.href = mailtoUrl;
      }
      if (errorBox) {
        errorBox.style.display = 'block';
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
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

/* --------------------------------------------------------------------------
   GLOBAL NETWORK MAP - INTERACTIVE DESTINATION EXPLORER
   -------------------------------------------------------------------------- */
function initGlobalNetworkMap() {
  const section = document.getElementById('global-network');
  if (!section) return;

  const NETWORK_LOCATIONS = [
    {
      id: 'indonesia',
      index: '01',
      name: 'Indonesia',
      region: 'SOUTHEAST ASIA',
      role: 'Central Network Hub',
      description: 'Leading the way in aviation excellence across the archipelago.',
      ctaText: 'ENQUIRE IN INDONESIA',
      routeD: null
    },
    {
      id: 'singapore',
      index: '02',
      name: 'Singapore',
      region: 'SOUTHEAST ASIA',
      role: 'Regional Aviation Gateway',
      description: 'Partnering with the aviation hub of Asia.',
      ctaText: 'ENQUIRE IN SINGAPORE',
      routeD: 'M 757.0 362.0 Q 751.0 330.2 745.0 334.5'
    },
    {
      id: 'malaysia',
      index: '03',
      name: 'Malaysia',
      region: 'SOUTHEAST ASIA',
      role: 'Southeast Asia Growth Skies',
      description: "Providing innovative solutions for Southeast Asia's growing skies.",
      ctaText: 'ENQUIRE IN MALAYSIA',
      routeD: 'M 757.0 362.0 Q 748.4 325.4 739.8 324.8'
    },
    {
      id: 'thailand',
      index: '04',
      name: 'Thailand',
      region: 'SOUTHEAST ASIA',
      role: 'Commercial Aviation Corridor',
      description: 'Elevating aviation services in the Land of Smiles.',
      ctaText: 'ENQUIRE IN THAILAND',
      routeD: 'M 757.0 362.0 Q 745.0 295.5 733.0 278.0'
    },
    {
      id: 'philippines',
      index: '05',
      name: 'Philippines',
      region: 'SOUTHEAST ASIA',
      role: 'Archipelago Aviation Solutions',
      description: 'Empowering aviation solutions.',
      ctaText: 'ENQUIRE IN PHILIPPINES',
      routeD: 'M 757.0 362.0 Q 776.0 297.2 795.0 282.0'
    },
    {
      id: 'india',
      index: '06',
      name: 'India',
      region: 'SOUTH ASIA',
      role: 'Strategic Subcontinent Market',
      description: 'Enhancing aviation excellence across the vibrant subcontinent.',
      ctaText: 'ENQUIRE IN INDIA',
      routeD: 'M 757.0 362.0 Q 716.5 292.2 676.0 285.0'
    },
    {
      id: 'sri-lanka',
      index: '07',
      name: 'Sri Lanka',
      region: 'SOUTH ASIA',
      role: 'Indian Ocean Aviation Hub',
      description: 'Delivering tailored aviation solutions to the Pearl of the Indian Ocean.',
      ctaText: 'ENQUIRE IN SRI LANKA',
      routeD: 'M 757.0 362.0 Q 720.0 313.3 683.0 314.0'
    },
    {
      id: 'tanzania',
      index: '08',
      name: 'Tanzania',
      region: 'EAST AFRICA',
      role: 'East African Market Expansion',
      description: 'Empowering aviation growth across East Africa.',
      ctaText: 'ENQUIRE IN TANZANIA',
      routeD: 'M 757.0 362.0 Q 656.0 303.4 555.0 358.0'
    },
    {
      id: 'algeria',
      index: '09',
      name: 'Algeria',
      region: 'NORTH AFRICA',
      role: 'North African Aviation Sector',
      description: "Strengthening connections in North Africa's aviation sector.",
      ctaText: 'ENQUIRE IN ALGERIA',
      routeD: 'M 757.0 362.0 Q 609.5 209.2 462.0 236.0'
    },
    {
      id: 'france',
      index: '10',
      name: 'France',
      region: 'EUROPE',
      role: 'European Aerospace Heart',
      description: 'Supporting aviation excellence in the heart of Europe.',
      ctaText: 'ENQUIRE IN FRANCE',
      routeD: 'M 757.0 362.0 Q 607.5 178.1 458.0 188.0'
    },
    {
      id: 'saint-barthelemy',
      index: '11',
      name: 'Saint Barthélemy',
      region: 'CARIBBEAN',
      role: 'Caribbean Regional Support',
      description: 'Ensuring seamless aviation support in the Caribbean.',
      ctaText: 'ENQUIRE IN SAINT BARTHÉLEMY',
      routeD: 'M 757.0 362.0 Q 516.2 202.5 275.5 283.0'
    }
  ];

  const ALL_OVERVIEW = {
    id: 'all',
    index: 'ALL',
    name: 'Global Network',
    region: 'GLOBAL REACH',
    role: '11 Connected Aviation Markets',
    description: 'From Southeast Asia to key international aviation markets, Viven Aviation connects clients with opportunities, expertise, and solutions across the global aviation ecosystem.',
    ctaText: 'CONNECT WITH OUR NETWORK'
  };

  // DOM Elements
  const detailCard = document.getElementById('netDetailCard');
  const cardNum = document.getElementById('netCardNum');
  const cardRegion = document.getElementById('netCardRegion');
  const cardTitle = document.getElementById('netCardTitle');
  const cardRole = document.getElementById('netCardRole');
  const cardDesc = document.getElementById('netCardDesc');
  const cardCta = document.getElementById('netCardCta');
  const prevBtn = document.getElementById('netPrevBtn');
  const nextBtn = document.getElementById('netNextBtn');
  const activeRouteArc = document.getElementById('activeRouteArc');
  const directoryList = document.getElementById('netDirectoryList');
  const pills = section.querySelectorAll('.net-dest-pill');
  const markers = section.querySelectorAll('.map-marker-node');
  const landPaths = section.querySelectorAll('.world-land-path[data-country]');
  const bgArcs = section.querySelectorAll('.flight-arc-bg');

  let currentIndex = 0; // default Indonesia
  let isTransitioning = false;

  function updateActiveState(locationId) {
    if (isTransitioning) return;
    isTransitioning = true;

    let locData;
    const isAll = locationId === 'all';

    if (isAll) {
      locData = ALL_OVERVIEW;
    } else {
      const foundIdx = NETWORK_LOCATIONS.findIndex(l => l.id === locationId);
      if (foundIdx !== -1) {
        currentIndex = foundIdx;
        locData = NETWORK_LOCATIONS[currentIndex];
      } else {
        currentIndex = 0;
        locData = NETWORK_LOCATIONS[0];
      }
    }

    // 1. Update Pills
    pills.forEach(pill => {
      const pid = pill.getAttribute('data-location-id');
      const isActive = pid === locData.id;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');

      if (isActive && directoryList) {
        // Smoothly scroll pill into view if needed (for horizontally scrollable pill bars)
        const pLeft = pill.offsetLeft;
        const pWidth = pill.offsetWidth;
        const dScroll = directoryList.scrollLeft;
        const dWidth = directoryList.clientWidth;
        if (pLeft < dScroll || pLeft + pWidth > dScroll + dWidth) {
          directoryList.scrollTo({
            left: pLeft - dWidth / 2 + pWidth / 2,
            behavior: 'smooth'
          });
        }
      }
    });

    // 2. Update Map Markers
    markers.forEach(marker => {
      const mid = marker.getAttribute('data-location-id');
      if (isAll) {
        marker.classList.add('is-active');
      } else {
        marker.classList.toggle('is-active', mid === locData.id);
      }
    });

    // 3. Update Landmass Highlighting
    landPaths.forEach(path => {
      const cid = path.getAttribute('data-country');
      if (isAll) {
        path.classList.add('is-active-land');
      } else {
        path.classList.toggle('is-active-land', cid === locData.id);
      }
    });

    // 4. Update Flight Arcs
    if (isAll) {
      bgArcs.forEach(arc => arc.classList.add('is-active-arc'));
      if (activeRouteArc) activeRouteArc.setAttribute('d', '');
    } else {
      bgArcs.forEach(arc => {
        const rTarget = arc.getAttribute('data-route');
        arc.classList.toggle('is-active-arc', rTarget === locData.id);
      });

      if (activeRouteArc) {
        if (locData.routeD) {
          activeRouteArc.setAttribute('d', locData.routeD);
          const pathLen = activeRouteArc.getTotalLength ? activeRouteArc.getTotalLength() : 300;
          activeRouteArc.style.strokeDasharray = pathLen;
          activeRouteArc.style.strokeDashoffset = pathLen;
          // Trigger layout reflow to restart animation
          void activeRouteArc.getBoundingClientRect();
          activeRouteArc.style.strokeDashoffset = '0';
        } else {
          activeRouteArc.setAttribute('d', '');
        }
      }
    }

    // 5. Update Information Panel with smooth crossfade
    if (detailCard) {
      detailCard.classList.add('is-updating');

      setTimeout(() => {
        if (cardNum) cardNum.textContent = isAll ? '11 / 11' : `${locData.index} / 11`;
        if (cardRegion) cardRegion.textContent = locData.region;
        if (cardTitle) cardTitle.textContent = locData.name;
        if (cardRole) cardRole.textContent = locData.role;
        if (cardDesc) cardDesc.textContent = locData.description;
        if (cardCta) {
          const span = cardCta.querySelector('span');
          if (span) span.textContent = locData.ctaText;
        }

        detailCard.classList.remove('is-updating');
        isTransitioning = false;
      }, 140);
    } else {
      isTransitioning = false;
    }
  }

  // Event Listeners for Pills
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const id = pill.getAttribute('data-location-id');
      if (id) updateActiveState(id);
    });
  });

  // Event Listeners for Map Markers
  markers.forEach(marker => {
    const id = marker.getAttribute('data-location-id');
    marker.addEventListener('click', () => {
      if (id) updateActiveState(id);
    });
    marker.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (id) updateActiveState(id);
      }
    });
  });

  // Event Listeners for Next & Prev Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + NETWORK_LOCATIONS.length) % NETWORK_LOCATIONS.length;
      updateActiveState(NETWORK_LOCATIONS[currentIndex].id);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % NETWORK_LOCATIONS.length;
      updateActiveState(NETWORK_LOCATIONS[currentIndex].id);
    });
  }

  // Event Listeners for Pill Scroll Track Arrows (Tablet & Mobile)
  const pillScrollLeft = document.getElementById('netPillScrollLeft');
  const pillScrollRight = document.getElementById('netPillScrollRight');

  if (pillScrollLeft && directoryList) {
    pillScrollLeft.addEventListener('click', () => {
      directoryList.scrollBy({ left: -160, behavior: 'smooth' });
    });
  }

  if (pillScrollRight && directoryList) {
    pillScrollRight.addEventListener('click', () => {
      directoryList.scrollBy({ left: 160, behavior: 'smooth' });
    });
  }

  // Immediate initial selection
  updateActiveState('indonesia');
}

/* --------------------------------------------------------------------------
   12. SECTION 16 — FOOTER BACK TO TOP
   -------------------------------------------------------------------------- */
function initFooterBackToTop() {
  const backToTopBtn = document.getElementById('footerBackToTop');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}



