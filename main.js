/* ==========================================================================
   VIVEN AVIATION - HERO SECTION INTERACTION LOGIC
   Engineered with smooth requestAnimationFrame interpolation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroLoadSequence();
  initNavbarScrollState();
  initMouseParallax();
  initScrollParallax();
  initAtmosphereCanvas();
  initIntroScrollObserver();
  initIntroParallax();
  initCharterShowcase();
  initServicesChapterSpy();
  initWhyVivenScrollSpy();
  initTeamScrollObserver();
  initContactScrollObserver();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. STAGGERED INITIAL LOAD ANIMATION REVEAL
   -------------------------------------------------------------------------- */
function initHeroLoadSequence() {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  // Add loaded class after DOM paints to kick off CSS reveal timelines
  requestAnimationFrame(() => {
    setTimeout(() => {
      heroSection.classList.add('loaded');
    }, 100);
  });
}

/* --------------------------------------------------------------------------
   2. NAVBAR SCROLL GLASSMORPHISM STATE
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

/* --------------------------------------------------------------------------
   3. RESTRAINED MOUSE PARALLAX EFFECT
   -------------------------------------------------------------------------- */
function initMouseParallax() {
  const layerBg = document.getElementById('heroLayerBg');
  const layerMid = document.getElementById('heroLayerMid');
  const layerFg = document.getElementById('heroLayerFg');
  const textBlock = document.getElementById('heroTextBlock');

  if (!textBlock) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  // Lerp factor for ultra-smooth fluid movement (lower = smoother)
  const lerpFactor = 0.05;

  const onMouseMove = (e) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Normalize coordinates from -1 to 1
    targetX = (e.clientX / width - 0.5) * 2;
    targetY = (e.clientY / height - 0.5) * 2;
  };

  const updateParallax = () => {
    // Interpolate towards target
    currentX += (targetX - currentX) * lerpFactor;
    currentY += (targetY - currentY) * lerpFactor;

    // Layer 1: Background Sky (-6px max)
    if (layerBg) {
      layerBg.style.transform = `translate3d(${currentX * -6}px, ${currentY * -4}px, 0)`;
    }

    // Layer 2: Midground Clouds (-12px max)
    if (layerMid) {
      layerMid.style.transform = `translate3d(${currentX * -12}px, ${currentY * -8}px, 0)`;
    }

    // Layer 3: Foreground Aircraft (-20px max)
    if (layerFg) {
      layerFg.style.transform = `translate3d(${currentX * -20}px, ${currentY * -12}px, 0)`;
    }

    // Foreground Typography (+8px max forward)
    textBlock.style.transform = `translate3d(${currentX * 8}px, ${currentY * 5}px, 0)`;

    requestAnimationFrame(updateParallax);
  };

  // Only run parallax on desktop/pointer devices
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    requestAnimationFrame(updateParallax);
  }
}

/* --------------------------------------------------------------------------
   4. SCROLL DEPTH TRANSITION
   -------------------------------------------------------------------------- */
function initScrollParallax() {
  const textBlock = document.getElementById('heroTextBlock');
  const scrollIndicator = document.getElementById('scrollIndicator');

  if (!textBlock) return;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;

    if (scrollY <= heroHeight) {
      // Fade out and translate upward
      const scrollRatio = scrollY / (heroHeight * 0.85);
      const opacity = Math.max(0, 1 - scrollRatio * 1.2);
      const translateY = scrollY * 0.4;

      textBlock.style.opacity = opacity.toString();
      textBlock.style.transform = `translate3d(0, -${translateY}px, 0)`;

      if (scrollIndicator) {
        scrollIndicator.style.opacity = Math.max(0, 1 - scrollRatio * 2.5).toString();
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   5. ATMOSPHERIC PARTICLES CANVAS
   -------------------------------------------------------------------------- */
function initAtmosphereCanvas() {
  const canvas = document.getElementById('atmosphereCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 30), 45);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.2 + 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.speedX = Math.random() * 0.3 - 0.15;
      this.speedY = -(Math.random() * 0.2 + 0.05);
      this.pulseSpeed = Math.random() * 0.01 + 0.005;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Pulse alpha for gentle starry glow
      this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.003;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
        this.y = height + 10;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(0, Math.min(1, this.alpha))})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  const animate = () => {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  animate();
}

/* --------------------------------------------------------------------------
   6. SECTION 02 — INTRODUCTION INTERSECTION OBSERVER & PARALLAX
   -------------------------------------------------------------------------- */
function initIntroScrollObserver() {
  const introSection = document.getElementById('intro');
  if (!introSection) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -15% 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        introSection.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(introSection);
}

function initIntroParallax() {
  const introSection = document.getElementById('intro');
  const introImg = document.getElementById('introVisualImg');
  const introGrid = document.querySelector('.intro-grid-pattern');

  if (!introSection || !introImg) return;

  const handleScroll = () => {
    const rect = introSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if section is visible in viewport
    if (rect.top < windowHeight && rect.bottom > 0) {
      const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
      const translateY = (scrollProgress - 0.5) * 35; // Subtle parallax shift

      introImg.style.transform = `scale(1.03) translate3d(0, ${translateY * -0.6}px, 0)`;

      if (introGrid) {
        introGrid.style.transform = `translate3d(0, ${translateY * 0.4}px, 0)`;
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   7. SECTION 03 — SERVICES STICKY CHAPTER SPY & PROGRESS TRACKER
   -------------------------------------------------------------------------- */
function initServicesChapterSpy() {
  const servicesSection = document.getElementById('services');
  const chapterCards = document.querySelectorAll('.service-chapter-card');
  const activeNum = document.getElementById('activeChapterNum');
  const fillLine = document.getElementById('progressFillLine');
  const chapterDots = document.querySelectorAll('.chapter-dot');
  const gridPattern = document.querySelector('.services-grid-pattern');

  if (!servicesSection || !chapterCards.length) return;

  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const windowCenter = windowHeight / 2;
    const sectionRect = servicesSection.getBoundingClientRect();

    // 1. LAYER 1: Background Grid Parallax (moves at slowest speed)
    if (sectionRect.top < windowHeight && sectionRect.bottom > 0) {
      const scrollProgress = (windowHeight - sectionRect.top) / (windowHeight + sectionRect.height);
      if (gridPattern) {
        gridPattern.style.transform = `translate3d(0, ${(scrollProgress - 0.5) * 45}px, 0)`;
      }
    }

    // 2. LAYERS 2 & 3: Service Image Parallax & Content Progress Integration
    let activeChapter = 1;
    let closestDistance = Infinity;

    chapterCards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.top + cardRect.height / 2;
      const distanceFromCenter = Math.abs(cardCenter - windowCenter);

      // Track chapter closest to viewport center
      if (distanceFromCenter < closestDistance) {
        closestDistance = distanceFromCenter;
        activeChapter = index + 1;
      }

      if (isFinePointer && cardRect.top < windowHeight && cardRect.bottom > 0) {
        // Normalized progress relative to viewport center (-1.0 to +1.0)
        const normalizedProgress = (cardCenter - windowCenter) / (windowHeight * 0.65);
        const normDistance = Math.min(1, Math.abs(normalizedProgress));

        // Smooth Opacity: Peak 1.0 when centered, fading smoothly to 0.35 when inactive
        const opacity = Math.max(0.35, 1 - Math.pow(normDistance, 1.6) * 0.65);

        // Smooth Scale: Peak 1.03-1.04 when centered, scaling smoothly to 0.97 when inactive
        const scale = 0.97 + (1 - normDistance) * 0.06;

        // Smooth Image Parallax: Shift vertical position within card frame (-40px to +40px)
        const imgParallaxY = normalizedProgress * -40;

        card.style.opacity = opacity.toFixed(3);
        card.style.transform = `translate3d(0, 0, 0) scale(${scale.toFixed(3)})`;

        const img = card.querySelector('.chapter-visual-img');
        if (img) {
          img.style.transform = `scale(1.06) translate3d(0, ${imgParallaxY.toFixed(1)}px, 0)`;
        }

        if (distanceFromCenter < windowHeight * 0.38) {
          card.classList.add('active-chapter');
        } else {
          card.classList.remove('active-chapter');
        }
      } else if (!isFinePointer) {
        // Mobile fallback: Keep clean natural opacity and layout
        card.style.opacity = '1';
        card.style.transform = 'none';
        card.classList.add('active-chapter');
      }
    });

    // 3. LAYER 4: Fixed/Sticky Context Indicator Updates
    if (activeNum) {
      activeNum.textContent = `0${activeChapter}`;
    }

    if (fillLine) {
      fillLine.style.width = `${activeChapter * 25}%`;
    }

    chapterDots.forEach((dot) => {
      const dotChapter = parseInt(dot.getAttribute('data-chapter'), 10);
      if (dotChapter === activeChapter) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  handleScroll(); // Initial run

  // Click handler on progress dots to scroll smoothly to chapter
  chapterDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetChapter = dot.getAttribute('data-chapter');
      const targetCard = document.getElementById(`service-chapter-${targetChapter}`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. SECTION 05 — WHY VIVEN SCROLL SPY & DIFFERENTIATOR PROGRESS TRACKER
   -------------------------------------------------------------------------- */
  function initWhyVivenScrollSpy() {
    const whyVivenSection = document.getElementById('why-viven');
    const diffCards = document.querySelectorAll('.differentiator-card');
    const fillLine = document.getElementById('diffFillLine');
    const visualImg = document.getElementById('whyVivenVisualImg');
    const gridPattern = document.querySelector('.why-viven-grid-pattern');

    if (!whyVivenSection || !diffCards.length) return;

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const windowCenter = windowHeight / 2;
      const sectionRect = whyVivenSection.getBoundingClientRect();

      // 1. Background Grid & Visual Image Parallax
      if (sectionRect.top < windowHeight && sectionRect.bottom > 0) {
        const scrollProgress = (windowHeight - sectionRect.top) / (windowHeight + sectionRect.height);
        if (gridPattern) {
          gridPattern.style.transform = `translate3d(0, ${(scrollProgress - 0.5) * 45}px, 0)`;
        }
        if (visualImg) {
          visualImg.style.transform = `scale(1.06) translate3d(0, ${(scrollProgress - 0.5) * -35}px, 0)`;
        }
      }

      // 2. Track Active Differentiator Item (01 -> 04)
      let activeIndex = 1;
      let closestDistance = Infinity;

      diffCards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.top + cardRect.height / 2;
        const distanceFromCenter = Math.abs(cardCenter - windowCenter);

        if (distanceFromCenter < closestDistance) {
          closestDistance = distanceFromCenter;
          activeIndex = index + 1;
        }

        if (isFinePointer && cardRect.top < windowHeight && cardRect.bottom > 0) {
          const normalizedProgress = (cardCenter - windowCenter) / (windowHeight * 0.65);
          const normDistance = Math.min(1, Math.abs(normalizedProgress));

          const opacity = Math.max(0.35, 1 - Math.pow(normDistance, 1.6) * 0.65);
          const scale = 0.97 + (1 - normDistance) * 0.05;

          card.style.opacity = opacity.toFixed(3);
          card.style.transform = `translate3d(0, 0, 0) scale(${scale.toFixed(3)})`;

          if (distanceFromCenter < windowHeight * 0.38) {
            card.classList.add('active-diff');
          } else {
            card.classList.remove('active-diff');
          }
        } else if (!isFinePointer) {
          card.style.opacity = '1';
          card.style.transform = 'none';
          card.classList.add('active-diff');
        }
      });

      // 3. Update Fill Line Height (25%, 50%, 75%, 100%)
      if (fillLine) {
        fillLine.style.height = `${activeIndex * 25}%`;
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();
  }

/* --------------------------------------------------------------------------
   9. SECTION 02.5 — AIRCRAFT CHARTER SHOWCASE LOGIC
   -------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------
   9. SECTION 02.5 — AIRCRAFT CHARTER SHOWCASE LOGIC (CENTERED CAROUSEL)
   -------------------------------------------------------------------------- */
function initCharterShowcase() {
  const charterSection = document.getElementById('charter-showcase');
  if (!charterSection) return;

  // 1. Intersection Observer for staggered entrance
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -15% 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        charterSection.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(charterSection);

  // 2. Carousel Interaction Elements
  const prevBtn = document.getElementById('charterPrevBtn');
  const nextBtn = document.getElementById('charterNextBtn');
  const planeCards = charterSection.querySelectorAll('.charter-plane-card');
  const trackDots = charterSection.querySelectorAll('.track-dot');
  const numBadge = document.getElementById('charterNumBadge');
  const planeName = document.getElementById('charterPlaneName');
  const planeCat = document.getElementById('charterPlaneCat');

  let currentIndex = 0;
  const totalCards = planeCards.length;

  const updateCarousel = (newIndex, direction = 'next') => {
    if (newIndex === currentIndex || newIndex < 0 || newIndex >= totalCards) return;

    const currentCard = planeCards[currentIndex];
    const newCard = planeCards[newIndex];

    // Card slide & fade transition
    currentCard.classList.remove('active');
    currentCard.classList.add(direction === 'next' ? 'exit-left' : 'enter-right');

    setTimeout(() => {
      currentCard.classList.remove('exit-left', 'enter-right');
    }, 700);

    newCard.classList.remove('exit-left', 'enter-right');
    newCard.classList.add('active');

    // Update Info Panel
    const cardNum = newCard.getAttribute('data-num');
    const cardName = newCard.getAttribute('data-name');
    const cardCat = newCard.getAttribute('data-cat');

    if (numBadge) numBadge.textContent = cardNum;
    if (planeName) planeName.textContent = cardName;
    if (planeCat) planeCat.textContent = cardCat;

    // Update Dots
    trackDots.forEach((dot, idx) => {
      if (idx === newIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    currentIndex = newIndex;
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const targetIndex = (currentIndex - 1 + totalCards) % totalCards;
      updateCarousel(targetIndex, 'prev');
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const targetIndex = (currentIndex + 1) % totalCards;
      updateCarousel(targetIndex, 'next');
    });
  }

  trackDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
      const direction = targetIndex > currentIndex ? 'next' : 'prev';
      updateCarousel(targetIndex, direction);
    });
  });

  // 3. Scroll Parallax Effect
  const cloudHaze = document.getElementById('charterCloudHaze');
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  const handleScroll = () => {
    const rect = charterSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);

      if (isFinePointer) {
        if (cloudHaze) {
          cloudHaze.style.transform = `translate3d(0, ${(scrollProgress - 0.5) * -35}px, 0)`;
        }
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   10. SECTION 06 — OUR TEAM INTERSECTION OBSERVER
   -------------------------------------------------------------------------- */
function initTeamScrollObserver() {
  const teamSection = document.getElementById('team');
  if (!teamSection) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -15% 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        teamSection.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(teamSection);
}

/* --------------------------------------------------------------------------
   11. SECTION 07 — CONTACT US INTERSECTION OBSERVER & PARALLAX
   -------------------------------------------------------------------------- */
function initContactScrollObserver() {
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -15% 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        contactSection.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(contactSection);

  // Subtle atmospheric background movement on scroll
  const horizonBackdrop = contactSection.querySelector('.contact-horizon-backdrop');
  const glowAura = contactSection.querySelector('.contact-glow-aura');
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  const handleScroll = () => {
    const rect = contactSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
      if (isFinePointer) {
        if (horizonBackdrop) {
          horizonBackdrop.style.transform = `scale(1.04) translate3d(0, ${(scrollProgress - 0.5) * -25}px, 0)`;
        }
        if (glowAura) {
          glowAura.style.transform = `translate3d(0, ${(scrollProgress - 0.5) * 20}px, 0)`;
        }
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   12. SECTION 07 — CONTACT FORM INTERACTION & SUBMISSION
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('vivenContactForm');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const successBox = document.getElementById('contactSuccessBox');

  if (!contactForm || !submitBtn || !successBox) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic HTML validation check
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText ? btnText.textContent : 'SEND ENQUIRY';
    if (btnText) btnText.textContent = 'SENDING ENQUIRY...';
    submitBtn.style.opacity = '0.75';

    // Simulate submission delay for refined UI feedback
    setTimeout(() => {
      // Fade out form smoothly
      contactForm.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      contactForm.style.opacity = '0';
      contactForm.style.transform = 'translateY(-10px)';

      setTimeout(() => {
        contactForm.style.display = 'none';

        // Reveal success feedback state
        successBox.style.display = 'block';
        requestAnimationFrame(() => {
          successBox.classList.add('active');
        });

        // Reset form for future use
        contactForm.reset();
        if (btnText) btnText.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        contactForm.style.transform = 'none';
      }, 400);
    }, 1200);
  });
}
