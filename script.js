/**
 * FINTRIX GLOBAL - CLIENT INTERACTION SCRIPT
 * Production-ready vanilla JavaScript handling responsive navigation,
 * interactive stack section, table filtering, 2-step plan calculator,
 * multi-step formation wizard modal, client portal demo, FAQ accordion,
 * and a smooth, stable, and performant motion layer (GSAP + ScrollTrigger + Lenis).
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initHeroShowcaseToggle();
  initProcessStepInteractivity();
  initTableFilters();
  initPricingSwitcher();
  initPlanFinder();
  initFaqAccordion();
  initNewsletterForm();
  initModals();
  initDelegatedAnchorLinks();
  initSaveHoursPricing();
  initVerticalReviews();
  initMotion();
});

/* ==========================================================================
   0. Hero Showcase View Switcher (3-Card Grid vs 3D Tilted Cards)
   ========================================================================== */
function initHeroShowcaseToggle() {
  const switchBtns = document.querySelectorAll('.view-switch-btn');
  const gridShowcase = document.getElementById('heroGridShowcase');
  const tiltedShowcase = document.getElementById('heroTiltedShowcase');

  if (!switchBtns.length || !gridShowcase || !tiltedShowcase) return;

  switchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetView = btn.getAttribute('data-view');
      switchBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      if (targetView === 'tilted') {
        gridShowcase.style.display = 'none';
        tiltedShowcase.style.display = 'grid';
        if (window.gsap) {
          gsap.fromTo(
            tiltedShowcase.children,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'opacity,y' }
          );
        }
      } else {
        tiltedShowcase.style.display = 'none';
        gridShowcase.style.display = 'grid';
        if (window.gsap) {
          gsap.fromTo(
            gridShowcase.children,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'opacity,y' }
          );
        }
      }
      if (window.ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    });
  });
}

/* ==========================================================================
   1. Sticky Header State (Non-interfering Base)
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  // Initial check on load
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  }
}

/* ==========================================================================
   2. Mobile Drawer Navigation
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('drawerClose');
  const mobileStartBtn = document.getElementById('mobileStartBtn');
  const mobilePortalBtn = document.getElementById('mobilePortalBtn');

  if (!drawer || !toggleBtn) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop();
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (window.lenis) window.lenis.start();
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  if (mobileStartBtn) {
    mobileStartBtn.addEventListener('click', () => {
      closeDrawer();
      openOrderModal('Standard');
    });
  }

  if (mobilePortalBtn) {
    mobilePortalBtn.addEventListener('click', () => {
      closeDrawer();
      openPortalModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   3. Single Delegated Anchor Links & Tab Click Handler
   ========================================================================== */
function getCardTargetScrollY(targetCard) {
  if (!targetCard) return 0;
  const cardId = targetCard.id;

  // 1. Try to get ScrollTrigger start position (exact numeric document scroll point)
  if (window.ScrollTrigger) {
    const st = ScrollTrigger.getById('deck-tab-' + cardId);
    if (st && typeof st.start === 'number' && st.start > 0) {
      return st.start + 10;
    }
  }

  // 2. High-precision geometric fallback based on section top & card index
  const section = document.getElementById('services');
  const cards = Array.from(document.querySelectorAll('.stack-card'));
  const cardIndex = cards.indexOf(targetCard);
  if (section && cardIndex >= 0) {
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
    return sectionTop + 140 + (cardIndex * 620);
  }

  return targetCard.getBoundingClientRect().top + window.pageYOffset - 90;
}

function initDelegatedAnchorLinks() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]:not([href="#"]), .stack-tab-btn');
    if (!anchor) return;

    // Handle stack tab button specifically so backward & forward scrolling both work flawlessly
    if (anchor.classList.contains('stack-tab-btn')) {
      const cardId = anchor.getAttribute('data-target-card');
      if (!cardId) return;
      const targetCard = document.getElementById(cardId);
      if (!targetCard) return;

      e.preventDefault();

      // Immediately activate tab visually
      const allTabBtns = document.querySelectorAll('.stack-tab-btn');
      allTabBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      anchor.classList.add('active');
      anchor.setAttribute('aria-selected', 'true');

      // Scroll to numeric coordinate (works backwards and forwards without sticky bounding rect distortion!)
      const targetY = getCardTargetScrollY(targetCard);

      if (window.lenis) {
        window.lenis.scrollTo(targetY, { duration: 1.0 });
      } else {
        window.scrollTo({
          top: targetY,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      }
      return;
    }

    let targetSelector = anchor.getAttribute('href');
    if (!targetSelector || targetSelector === '#' || targetSelector === '#null') return;

    const targetEl = document.querySelector(targetSelector);
    if (!targetEl) return;

    e.preventDefault();

    // Close mobile drawer if open
    const drawer = document.getElementById('mobileDrawer');
    if (drawer && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }

    // Determine target offset
    const isStackSection = targetEl.closest('#services') || targetEl.id === 'services';
    const headerEl = document.getElementById('header');
    const headerOffset = isStackSection ? 70 : (headerEl ? headerEl.offsetHeight : 76);

    if (targetEl.classList.contains('stack-card')) {
      const targetY = getCardTargetScrollY(targetEl);
      if (window.lenis) {
        window.lenis.scrollTo(targetY, { duration: 1.0 });
      } else {
        window.scrollTo({
          top: targetY,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      }
    } else {
      if (window.lenis) {
        window.lenis.scrollTo(targetEl, {
          offset: -headerOffset,
          duration: 1.2
        });
      } else {
        const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: targetTop - headerOffset,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      }
    }
  });
}

/* ==========================================================================
   4. 5-Step Process Interactivity
   ========================================================================== */
function initProcessStepInteractivity() {
  const stepItems = document.querySelectorAll('.process-step-item');
  const checklistItems = document.querySelectorAll('#processVisualChecklist .v-check-item');
  const livePill = document.getElementById('visualLiveStatusPill');
  const companyTitle = document.getElementById('visualCompanyName');

  const stepMeta = {
    '1': {
      pill: 'Phase 1: Consultation Active',
      company: 'Global Horizons Enterprise LLC / UK LTD'
    },
    '2': {
      pill: 'Phase 2: Intake & ID Verified',
      company: 'Global Horizons Enterprise LLC / UK LTD'
    },
    '3': {
      pill: 'Phase 3: State Filing Expedited',
      company: 'Global Horizons Enterprise LLC / UK LTD'
    },
    '4': {
      pill: 'Phase 4: EIN & Vault Delivery',
      company: 'Global Horizons Enterprise LLC / UK LTD'
    },
    '5': {
      pill: 'Phase 5: Active & Compliant',
      company: 'Global Horizons Enterprise LLC / UK LTD'
    }
  };

  stepItems.forEach(item => {
    item.addEventListener('click', () => {
      const stepNum = parseInt(item.getAttribute('data-step'), 10);
      stepItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      if (livePill && stepMeta[stepNum]) {
        livePill.textContent = stepMeta[stepNum].pill;
      }
      if (companyTitle && stepMeta[stepNum]) {
        companyTitle.textContent = stepMeta[stepNum].company;
      }

      // Dynamically update checklist milestone states
      checklistItems.forEach((checkItem, idx) => {
        const itemStep = idx + 1;
        checkItem.classList.remove('done', 'current', 'pending');
        const iconEl = checkItem.querySelector('.v-icon');

        if (itemStep < stepNum) {
          checkItem.classList.add('done');
          if (iconEl) iconEl.innerHTML = '✓';
        } else if (itemStep === stepNum) {
          checkItem.classList.add('current');
          if (iconEl) iconEl.innerHTML = '<span class="spin-dot"></span>';
        } else {
          checkItem.classList.add('pending');
          if (iconEl) iconEl.textContent = itemStep;
        }
      });
    });
  });
}

/* ==========================================================================
   5. Comparison Table Row Filters
   ========================================================================== */
function initTableFilters() {
  const filterPills = document.querySelectorAll('.table-filter-controls .filter-pill');
  const tableRows = document.querySelectorAll('#comparisonTable tbody tr');

  if (!filterPills.length || !tableRows.length) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.getAttribute('data-filter');

      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      tableRows.forEach(row => {
        const cat = row.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  const consultBtn = document.getElementById('compareConsultBtn');
  if (consultBtn) {
    consultBtn.addEventListener('click', () => {
      openOrderModal('consult');
    });
  }
}

/* ==========================================================================
   6. Jurisdiction & Pricing Switcher
   ========================================================================== */
function initPricingSwitcher() {
  const btnUS = document.getElementById('btnPlanUS');
  const btnUK = document.getElementById('btnPlanUK');
  const btnDual = document.getElementById('btnPlanDual');

  const priceStarter = document.getElementById('priceStarter');
  const priceStandard = document.getElementById('priceStandard');
  const priceComplete = document.getElementById('priceComplete');

  if (!btnUS || !btnUK || !btnDual) return;

  const resetPills = () => {
    [btnUS, btnUK, btnDual].forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-checked', 'false');
    });
  };

  btnUS.addEventListener('click', () => {
    resetPills();
    btnUS.classList.add('active');
    btnUS.setAttribute('aria-checked', 'true');
    if (priceStarter) priceStarter.textContent = '199';
    if (priceStandard) priceStandard.textContent = '499';
    if (priceComplete) priceComplete.textContent = '999';
  });

  btnUK.addEventListener('click', () => {
    resetPills();
    btnUK.classList.add('active');
    btnUK.setAttribute('aria-checked', 'true');
    if (priceStarter) priceStarter.textContent = '189';
    if (priceStandard) priceStandard.textContent = '489';
    if (priceComplete) priceComplete.textContent = '899';
  });

  btnDual.addEventListener('click', () => {
    resetPills();
    btnDual.classList.add('active');
    btnDual.setAttribute('aria-checked', 'true');
    if (priceStarter) priceStarter.textContent = '330';
    if (priceStandard) priceStandard.textContent = '840';
    if (priceComplete) priceComplete.textContent = '1,610';
  });
}

/* Global helper to select package from pricing cards */
window.selectPackage = function(tierName, price) {
  openOrderModal(tierName);
};

/* ==========================================================================
   7. 2-Step Plan Matcher Calculator
   ========================================================================== */
function initPlanFinder() {
  const matchBtn = document.getElementById('finderMatchBtn');
  const resultDiv = document.getElementById('finderResult');
  const q1 = document.getElementById('finderQ1');
  const q2 = document.getElementById('finderQ2');
  const resultTitle = document.getElementById('resultTierTitle');
  const resultDesc = document.getElementById('resultTierDesc');
  const resultSelectBtn = document.getElementById('resultSelectBtn');

  if (!matchBtn || !resultDiv) return;

  let currentMatchedTier = 'Standard';

  matchBtn.addEventListener('click', () => {
    const market = q1.value;
    const need = q2.value;

    if (need === 'lean') {
      currentMatchedTier = 'Starter';
      resultTitle.textContent = 'Starter Package ($199 One-Time + Govt Fees)';
      resultDesc.textContent = 'Recommended for solo founders who primarily need legal formation, IRS EIN or UK tax registration, and registered agent coverage to launch immediately.';
    } else if (need === 'complete' || market === 'both') {
      currentMatchedTier = 'Complete';
      resultTitle.textContent = 'Complete Package ($999/year + Govt Fees)';
      resultDesc.textContent = 'Recommended for high-growth global ventures, multi-member entities, or international founders requiring business bank preparation, Amazon/Stripe verification, unlimited amendments, and priority CPA support.';
    } else {
      currentMatchedTier = 'Standard';
      resultTitle.textContent = 'Standard Package ($499/year + Govt Fees)';
      resultDesc.textContent = 'Our most popular plan for cross-border founders. Gives you complete residential privacy with a unique business address, mail scanning, compliance calendar, and full state annual report management.';
    }

    resultDiv.style.display = 'block';

    if (window.lenis) {
      window.lenis.scrollTo(resultDiv, { offset: -90, duration: 0.8 });
    } else {
      resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  if (resultSelectBtn) {
    resultSelectBtn.addEventListener('click', () => {
      openOrderModal(currentMatchedTier);
    });
  }
}

/* ==========================================================================
   8. FAQ Accordion (Graceful Fallback + Smooth Height)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-accordion .faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerDiv = item.querySelector('.faq-answer');

    if (!questionBtn || !answerDiv) return;

    questionBtn.addEventListener('click', () => {
      const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';

      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherAns = otherItem.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) {
            if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
              window.gsap.to(otherAns, {
                height: 0,
                opacity: 0,
                duration: 0.25,
                ease: 'power2.in',
                onComplete: () => otherAns.setAttribute('hidden', 'true'),
              });
            } else {
              otherAns.setAttribute('hidden', 'true');
            }
          }
        }
      });

      // Toggle current
      if (isExpanded) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          window.gsap.to(answerDiv, {
            height: 0,
            opacity: 0,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => answerDiv.setAttribute('hidden', 'true'),
          });
        } else {
          answerDiv.setAttribute('hidden', 'true');
        }
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answerDiv.removeAttribute('hidden');
        if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          window.gsap.fromTo(
            answerDiv,
            { height: 0, opacity: 0 },
            { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' }
          );
        }
      }
    });
  });
}

/* ==========================================================================
   9. Monthly Newsletter Subscription Form
   ========================================================================== */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('newsletterEmail');
  const feedback = document.getElementById('newsletterFeedback');
  const subscribeBtn = document.getElementById('subscribeBtn');

  if (!form || !emailInput || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email || !email.includes('@') || !email.includes('.')) {
      feedback.textContent = 'Please enter a valid business email address.';
      feedback.className = 'newsletter-feedback error';
      if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.gsap.fromTo(
          feedback,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
        );
      }
      return;
    }

    subscribeBtn.disabled = true;
    subscribeBtn.textContent = 'Subscribing...';

    setTimeout(() => {
      feedback.textContent = '✓ You’re subscribed! Check your inbox for the 2026 Global Founder’s Guide.';
      feedback.className = 'newsletter-feedback success';
      emailInput.value = '';
      subscribeBtn.disabled = false;
      subscribeBtn.textContent = 'Subscribed!';
      if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.gsap.fromTo(
          feedback,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
      }
    }, 600);
  });
}

/* ==========================================================================
   10. Modals: Formation Order Wizard & Client Portal Demo
   ========================================================================== */
function initModals() {
  const startBusinessBtn = document.getElementById('startBusinessBtn');
  const heroStartBtn = document.getElementById('heroStartBtn');
  const bannerStartBtn = document.getElementById('bannerStartBtn');
  const orderModal = document.getElementById('orderModal');
  const orderModalClose = document.getElementById('orderModalClose');

  if (startBusinessBtn) startBusinessBtn.addEventListener('click', () => openOrderModal('Standard'));
  if (heroStartBtn) heroStartBtn.addEventListener('click', () => openOrderModal('Standard'));
  if (bannerStartBtn) bannerStartBtn.addEventListener('click', () => openOrderModal('Standard'));
  if (orderModalClose) orderModalClose.addEventListener('click', closeOrderModal);

  const openPortalBtn = document.getElementById('openPortalBtn');
  const portalModal = document.getElementById('portalModal');
  const portalModalClose = document.getElementById('portalModalClose');

  if (openPortalBtn) openPortalBtn.addEventListener('click', openPortalModal);
  if (portalModalClose) portalModalClose.addEventListener('click', closePortalModal);

  if (orderModal) {
    orderModal.addEventListener('click', (e) => {
      if (e.target === orderModal) closeOrderModal();
    });
  }

  if (portalModal) {
    portalModal.addEventListener('click', (e) => {
      if (e.target === portalModal) closePortalModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOrderModal();
      closePortalModal();
    }
  });

  const pkgRadios = document.querySelectorAll('input[name="wizardPkg"]');
  pkgRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.pkg-radio-card').forEach(c => c.classList.remove('selected'));
      radio.closest('.pkg-radio-card').classList.add('selected');
      updateWizardFeeSummary();
    });
  });
}

window.openOrderModal = function(initialTier = 'Standard') {
  const orderModal = document.getElementById('orderModal');
  if (!orderModal) return;

  orderModal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lenis) window.lenis.stop();

  const targetRadio = document.querySelector(`input[name="wizardPkg"][value="${initialTier}"]`);
  if (targetRadio) {
    targetRadio.checked = true;
    document.querySelectorAll('.pkg-radio-card').forEach(c => c.classList.remove('selected'));
    targetRadio.closest('.pkg-radio-card').classList.add('selected');
  }

  goToWizardStep(1);
  updateWizardFeeSummary();
};

window.closeOrderModal = function() {
  const orderModal = document.getElementById('orderModal');
  if (!orderModal) return;
  orderModal.setAttribute('hidden', 'true');
  document.body.style.overflow = '';
  if (window.lenis) window.lenis.start();
};

window.openPortalModal = function() {
  const portalModal = document.getElementById('portalModal');
  if (!portalModal) return;
  portalModal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lenis) window.lenis.stop();
};

window.closePortalModal = function() {
  const portalModal = document.getElementById('portalModal');
  if (!portalModal) return;
  portalModal.setAttribute('hidden', 'true');
  document.body.style.overflow = '';
  if (window.lenis) window.lenis.start();
};

window.goToWizardStep = function(stepNumber) {
  const pane1 = document.getElementById('pane1');
  const pane2 = document.getElementById('pane2');
  const pane3 = document.getElementById('pane3');

  const wStep1 = document.getElementById('wStep1');
  const wStep2 = document.getElementById('wStep2');
  const wStep3 = document.getElementById('wStep3');

  const panes = [pane1, pane2, pane3];
  const steps = [wStep1, wStep2, wStep3];

  panes.forEach((pane, idx) => {
    if (idx + 1 === stepNumber) {
      pane.removeAttribute('hidden');
      pane.classList.add('active');
    } else {
      pane.setAttribute('hidden', 'true');
      pane.classList.remove('active');
    }
  });

  steps.forEach((step, idx) => {
    if (idx + 1 === stepNumber) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });

  updateWizardFeeSummary();
};

function updateWizardFeeSummary() {
  const selectedRadio = document.querySelector('input[name="wizardPkg"]:checked');
  const summaryTierName = document.getElementById('summaryTierName');
  const summaryServiceFee = document.getElementById('summaryServiceFee');

  if (!selectedRadio || !summaryTierName || !summaryServiceFee) return;

  const tier = selectedRadio.value;
  const price = selectedRadio.getAttribute('data-price') || '499';

  summaryTierName.textContent = `${tier} Package`;
  summaryServiceFee.textContent = `$${price}.00`;
}

window.submitFormationOrder = function() {
  const proposedName = document.getElementById('proposedName');
  const founderName = document.getElementById('founderName');
  const founderEmail = document.getElementById('founderEmail');
  const businessActivity = document.getElementById('businessActivity');

  if (!proposedName.value.trim() || !founderName.value.trim() || !founderEmail.value.trim() || !businessActivity.value.trim()) {
    alert('Please fill in all mandatory fields (Company Name, Founder Name, Contact Email, Business Activity) before submitting.');
    return;
  }

  const form = document.getElementById('orderWizardForm');
  const successState = document.getElementById('wizardSuccess');

  if (form && successState) {
    form.style.display = 'none';
    successState.removeAttribute('hidden');
  }
};

/* ==========================================================================
   11. MOTION LAYER (GSAP, ScrollTrigger, Lenis)
   ========================================================================== */
function initMotion() {
  // 1. Guard against double initialization
  if (window.__motionInit) return;
  window.__motionInit = true;

  // 2. Library availability & reduced-motion guards
  if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') {
    console.warn('Fintrix Motion: GSAP or Lenis not loaded. Operating in fallback mode.');
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.info('Fintrix Motion: prefers-reduced-motion active, skipping motion layer.');
    return;
  }

  document.documentElement.classList.add('has-motion');

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 3. Initialize Lenis Smooth Scroll (Native touch on mobile, smooth wheel on desktop)
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1
  });

  window.lenis = lenis;

  // Connect Lenis to ScrollTrigger and GSAP ticker
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 4. Header Show/Hide on Scroll-Stack Section & Compact State
  // Header hides when entering the scroll-stack section so it does not overlap the sticky tab bar
  ScrollTrigger.create({
    id: 'st-stack-active',
    trigger: '#services',
    start: 'top top+=1',
    end: 'bottom 30%',
    onEnter: () => document.body.classList.add('stack-active'),
    onLeave: () => document.body.classList.remove('stack-active'),
    onEnterBack: () => document.body.classList.add('stack-active'),
    onLeaveBack: () => document.body.classList.remove('stack-active'),
  });

  // Header compact shadow past 80px scroll
  ScrollTrigger.create({
    id: 'st-header-compact',
    start: 'top -80px',
    end: 999999,
    toggleClass: { className: 'header-compact', targets: '#header' },
  });

  // Active navigation link highlighting
  const navSectionIds = ['services', 'comparison', 'packages', 'process', 'addons', 'faq'];
  navSectionIds.forEach((secId) => {
    const section = document.getElementById(secId);
    const link = document.querySelector(`.nav-links a[href="#${secId}"]`);
    if (!section || !link) return;

    ScrollTrigger.create({
      id: 'st-nav-' + secId,
      trigger: section,
      start: 'top center+=80',
      end: 'bottom center',
      onEnter: () => setActiveNav(link),
      onEnterBack: () => setActiveNav(link),
    });
  });

  function setActiveNav(activeLink) {
    document.querySelectorAll('.nav-links a').forEach((l) => l.classList.remove('active'));
    if (activeLink) activeLink.classList.add('active');
  }

  // 5. Scroll-Driven Stacked Cards Suite
  initStackSectionMotion();

  // 6. Hero Word-by-Word Headline Reveal, Subtext, Bullets & CTAs
  const heroTitle = document.getElementById('heroHeadline');
  if (heroTitle) {
    const childNodes = Array.from(heroTitle.childNodes);
    heroTitle.innerHTML = '';

    childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/\s+/).filter(Boolean);
        words.forEach((w) => {
          const wrap = document.createElement('span');
          wrap.className = 'word-wrap';
          wrap.innerHTML = `<span class="word-inner">${w}</span>`;
          heroTitle.appendChild(wrap);
          heroTitle.appendChild(document.createTextNode(' '));
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const wrap = document.createElement('span');
        wrap.className = 'word-wrap';
        const inner = document.createElement('span');
        inner.className = 'word-inner ' + node.className;
        inner.innerHTML = node.innerHTML;
        wrap.appendChild(inner);
        heroTitle.appendChild(wrap);
        heroTitle.appendChild(document.createTextNode(' '));
      }
    });

    const wordInners = heroTitle.querySelectorAll('.word-inner');
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .from(wordInners, {
        y: '110%',
        opacity: 0,
        duration: 0.85,
        stagger: 0.035,
      })
      .from('.hero-subtext', { y: 25, opacity: 0, duration: 0.75 }, '-=0.4')
      .from('.hero-checkmarks .check-item', { y: 20, opacity: 0, duration: 0.55, stagger: 0.07 }, '-=0.45')
      .from('.hero-cta-group, .hero-disclaimer-note', { y: 20, opacity: 0, duration: 0.55, stagger: 0.08 }, '-=0.35')
      .from('.hero-visual-stack .hero-preview-card', {
        scale: 0.92,
        y: 35,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power2.out',
      }, '-=0.5');
  }

  // 7. Hero 3 Preview Cards Gentle Floating & Desktop Mouse Parallax
  const cardTracker = document.querySelector('.card-tracker');
  const cardTax = document.querySelector('.card-tax');
  const cardMail = document.querySelector('.card-mail');

  if (cardTracker) {
    gsap.to(cardTracker, { y: '-=10', duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }
  if (cardTax) {
    gsap.to(cardTax, { y: '-=8', duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.4 });
  }
  if (cardMail) {
    gsap.to(cardMail, { y: '-=7', duration: 3.0, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.8 });
  }

  // Tilted cards gentle float
  const tiltedTracker = document.querySelector('.tilted-tracker');
  const tiltedTax = document.querySelector('.tilted-tax');
  const tiltedBooks = document.querySelector('.tilted-books');
  if (tiltedTracker) {
    gsap.to(tiltedTracker, { y: '-=8', duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }
  if (tiltedTax) {
    gsap.to(tiltedTax, { y: '-=6', duration: 2.9, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.3 });
  }
  if (tiltedBooks) {
    gsap.to(tiltedBooks, { y: '-=7', duration: 3.1, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.6 });
  }

  const isDesktop = window.matchMedia('(min-width: 992px) and (hover: hover)').matches;
  if (isDesktop) {
    const heroSection = document.querySelector('.hero-section');
    const parallaxCards = document.querySelectorAll('.hero-preview-card[data-parallax-factor]');

    if (heroSection && parallaxCards.length) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        parallaxCards.forEach((card) => {
          const factor = parseFloat(card.getAttribute('data-parallax-factor')) || 15;
          gsap.to(card, {
            x: relX * factor * 1.5,
            y: relY * factor * 1.5,
            duration: 0.6,
            ease: 'power1.out',
            overwrite: 'auto',
          });
        });
      });

      heroSection.addEventListener('mouseleave', () => {
        parallaxCards.forEach((card) => {
          gsap.to(card, { x: 0, y: 0, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
        });
      });
    }
  }

  // 8. Generic Section Reveals (.reveal & .reveal-stagger)
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
    });
  });

  const staggerContainers = document.querySelectorAll('.reveal-stagger');
  staggerContainers.forEach((container) => {
    const children = container.children;
    if (!children.length) return;

    gsap.from(children, {
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        once: true,
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
    });
  });

  // 9. Three Stages Icons Scale-in
  const stageIcons = document.querySelectorAll('.stage-icon');
  if (stageIcons.length) {
    stageIcons.forEach((icon) => {
      gsap.from(icon, {
        scrollTrigger: {
          trigger: icon,
          start: 'top 90%',
          once: true,
        },
        scale: 0.7,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
      });
    });
  }

  // 10. Process Vertical Progress Line Scrub & Status Card Updates
  const processList = document.querySelector('.process-steps-list');
  const timelineFill = document.getElementById('processTimelineFill');
  const stepItems = document.querySelectorAll('.process-step-item');
  const visualCompanyName = document.getElementById('visualCompanyName');
  const visualStatusBadge = document.getElementById('visualStatusBadge');
  const visualProgressFill = document.getElementById('visualProgressFill');
  const visualStatusSubtitle = document.getElementById('visualStatusSubtitle');

  const stepStatusData = {
    '1': {
      name: 'Frontier Holdings LLC',
      badge: 'Consultation & Structuring',
      progress: '20%',
      subtitle: 'Reviewing State Tax Benefits & Structuring Plan',
    },
    '2': {
      name: 'NexaTrade Global LLC',
      badge: 'Information Verification',
      progress: '40%',
      subtitle: 'IDs & Residential Proof Validated',
    },
    '3': {
      name: 'Apex Velocity LTD',
      badge: 'State/Companies House Filing',
      progress: '60%',
      subtitle: 'Articles of Organization Lodged',
    },
    '4': {
      name: 'Stratos Digital Systems LLC',
      badge: 'Tax IDs & Formation Pack',
      progress: '80%',
      subtitle: 'IRS EIN Assigned & Stored in Vault',
    },
    '5': {
      name: 'Global Horizon Enterprises LLC',
      badge: 'Active & In Good Standing',
      progress: '100%',
      subtitle: 'Annual Compliance Calendar Initialized',
    },
  };

  if (processList && timelineFill) {
    gsap.to(timelineFill, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: processList,
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: 0.3,
      },
    });

    stepItems.forEach((step) => {
      const stepNum = step.getAttribute('data-step');
      ScrollTrigger.create({
        id: 'st-step-' + stepNum,
        trigger: step,
        start: 'top 65%',
        end: 'bottom 65%',
        onEnter: () => updateProcessStep(stepNum),
        onEnterBack: () => updateProcessStep(stepNum),
      });
    });
  }

  function updateProcessStep(stepNum) {
    stepItems.forEach((item) => {
      if (item.getAttribute('data-step') === stepNum) {
        item.classList.add('active', 'is-current');
      } else {
        item.classList.remove('is-current');
      }
    });

    const data = stepStatusData[stepNum];
    if (data) {
      if (visualCompanyName) visualCompanyName.textContent = data.name;
      if (visualStatusBadge) visualStatusBadge.textContent = data.badge;
      if (visualProgressFill) {
        gsap.to(visualProgressFill, {
          width: data.progress,
          duration: 0.5,
          ease: 'power2.out',
        });
      }
      if (visualStatusSubtitle) visualStatusSubtitle.textContent = data.subtitle;
    }
  }

  // 11. Guarantee Banner Scale-in & Shine Sweep
  const guaranteeCard = document.querySelector('.guarantee-banner-card');
  const shineBadge = document.querySelector('.shine-badge');

  if (guaranteeCard) {
    gsap.from(guaranteeCard, {
      scrollTrigger: {
        trigger: guaranteeCard,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          if (shineBadge) {
            setTimeout(() => {
              shineBadge.classList.add('sweeping');
            }, 350);
          }
        },
      },
      scale: 0.95,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
    });
  }

  // 12. Plan Matcher Result Card Pop
  const matchBtn = document.getElementById('finderMatchBtn');
  const resultDiv = document.getElementById('finderResult');
  if (matchBtn && resultDiv) {
    matchBtn.addEventListener('click', () => {
      gsap.fromTo(
        resultDiv,
        { opacity: 0, scale: 0.94, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.4)' }
      );
    });
  }

  // 13. Social Proof Metrics Count-up & Testimonials Marquee
  const counterElements = document.querySelectorAll('.counter');
  counterElements.forEach((counter) => {
    const targetVal = parseFloat(counter.getAttribute('data-target')) || 0;
    const suffix = counter.getAttribute('data-suffix') || '';
    const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);

    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: targetVal,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            if (decimals > 0) {
              counter.textContent = obj.val.toFixed(decimals) + suffix;
            } else {
              counter.textContent = Math.round(obj.val).toLocaleString() + suffix;
            }
          },
        });
      },
    });
  });

  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    const cards = Array.from(marqueeTrack.children);
    cards.forEach((card) => {
      const clone = card.cloneNode(true);
      marqueeTrack.appendChild(clone);
    });

    const marqueeAnim = gsap.to(marqueeTrack, {
      xPercent: -50,
      ease: 'none',
      duration: 38,
      repeat: -1,
    });

    marqueeTrack.addEventListener('mouseenter', () => marqueeAnim.pause());
    marqueeTrack.addEventListener('mouseleave', () => marqueeAnim.play());
  }

  // 14. CTA Magnetic Button Hover Effect (Desktop Only)
  if (isDesktop) {
    const magneticButtons = document.querySelectorAll('.magnetic');
    magneticButtons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.28,
          y: y * 0.28,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1.1, 0.4)',
        });
      });
    });
  }

  // 15. Stable Refresh Events (Window Load, Fonts Ready, Debounced Resize)
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  if (document.fonts) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
      const currentActive = document.querySelector('.stack-tab-btn.active');
      if (currentActive && window.updateStackTabUnderline) {
        window.updateStackTabUnderline(currentActive);
      }
    }, 200);
  });
}

/* ==========================================================================
   12. Scroll-Driven Stacked Cards Section Motion
   ========================================================================== */
function initStackSectionMotion() {
  const section = document.getElementById('services');
  const cards = gsap.utils.toArray('.stack-card');
  const tabBtns = document.querySelectorAll('.stack-tab-btn');
  const underline = document.getElementById('stackTabUnderline');
  const tabBar = document.getElementById('stackTabBar');

  if (!section || !cards.length || !tabBtns.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Safe no-op for underline
  function updateTabUnderline() {}
  window.updateStackTabUnderline = updateTabUnderline;

  // Set active tab visually
  function activateTab(btn, scrollIntoView = false) {
    if (!btn) return;
    tabBtns.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    // Auto-scroll active tab into view horizontally on mobile
    if (scrollIntoView && window.innerWidth < 768) {
      btn.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
    }
  }

  // Set initial position
  const initialActive = document.querySelector('.stack-tab-btn.active') || tabBtns[0];
  if (initialActive) {
    setTimeout(() => updateTabUnderline(initialActive), 100);
  }

  if (prefersReducedMotion) return;

  // Responsive MatchMedia for Stacking & Active Tabs
  const mm = gsap.matchMedia();

  // Desktop & Tablet (>= 768px): Stacking scale & dim effect + Active Tab
  mm.add('(min-width: 768px)', () => {
    // Stacking scrub animation for cards 0 to 3
    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        const nextCard = cards[i + 1];
        gsap.to(card, {
          scale: 0.94,
          y: -14,
          opacity: 0.88,
          ease: 'none',
          scrollTrigger: {
            id: 'deck-scrub-' + i,
            trigger: nextCard,
            start: 'top bottom',
            end: 'top top+=140',
            scrub: true,
          },
        });
      }

      // Active tab detection
      const cardId = card.id;
      const matchingBtn = document.querySelector(`.stack-tab-btn[data-target-card="${cardId}"]`);

      ScrollTrigger.create({
        id: 'deck-tab-' + cardId,
        trigger: card,
        start: 'top 45%',
        end: 'bottom 45%',
        onEnter: () => activateTab(matchingBtn),
        onEnterBack: () => activateTab(matchingBtn),
      });

      // Entry animations
      const mockup = card.querySelector('.stack-mockup-card');
      const portraitWrap = card.querySelector('.specialist-badge-wrapper');
      const chip = card.querySelector('.specialist-chip');
      const checklistItems = card.querySelectorAll('.stack-card-checklist li');

      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 75%',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      if (mockup) cardTl.from(mockup, { x: -35, opacity: 0, duration: 0.8 });
      if (portraitWrap) cardTl.from(portraitWrap, { y: 35, opacity: 0, duration: 0.7 }, '-=0.5');
      if (chip) cardTl.from(chip, { opacity: 0, duration: 0.4 }, '-=0.3');
      if (checklistItems.length) cardTl.from(checklistItems, { x: 20, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.4');
    });
  });

  // Mobile (< 768px): Keep simple active tab detection with native scroll
  mm.add('(max-width: 767px)', () => {
    cards.forEach((card) => {
      const cardId = card.id;
      const matchingBtn = document.querySelector(`.stack-tab-btn[data-target-card="${cardId}"]`);

      ScrollTrigger.create({
        id: 'deck-mob-tab-' + cardId,
        trigger: card,
        start: 'top 40%',
        end: 'bottom 40%',
        onEnter: () => activateTab(matchingBtn, true),
        onEnterBack: () => activateTab(matchingBtn, true),
      });
    });
  });
}


/* ==========================================================================
   13. Save Hours & Dollars Interactive Pricing (Screenshot 3)
   ========================================================================== */
function initSaveHoursPricing() {
  const tierBtns = document.querySelectorAll('.sh-tier-btn');
  const eyebrow = document.getElementById('shDetailEyebrow');
  const priceVal = document.getElementById('shDetailPriceVal');
  const list = document.getElementById('shDetailList');
  const ctaBtn = document.getElementById('shCtaBtn');

  if (!tierBtns.length) return;

  const data = {
    starter: {
      eyebrow: 'STARTER FORMATION',
      price: '$297',
      sub: '/yr + state fees',
      features: [
        'Complete Articles of Organization / Companies House filing',
        'Official EIN / UK Tax Registration',
        'Registered Agent & physical address (1st year)',
        'Standard Operating Agreement / Articles of Association',
        'Secure Client Portal with digital document vault',
      ],
      btnText: 'Start your business with Starter →',
    },
    tax: {
      eyebrow: 'TAX AND COMPLIANCE',
      price: '$1,999',
      sub: '/yr + state fees',
      features: [
        'Everything in Starter plan, plus:',
        'EIN processed up to two weeks faster',
        'Federal & state tax filing (including Form 5472 for foreign LLCs)',
        '1:1 dedicated consultation with a licensed CPA',
        'Corporate compliance calendar & automatic deadline reminders',
        'DIY Bookkeeping & Invoicing Software access',
      ],
      btnText: 'Start your business with Tax & Compliance →',
    },
    box: {
      eyebrow: 'BUSINESS-IN-A-BOX™',
      price: '$2,999',
      sub: '/yr + state fees',
      features: [
        'Everything in Tax & Compliance plan, plus:',
        'Dedicated monthly human bookkeeper',
        'Monthly reconciliation of bank & processor transactions',
        'Tax returns prepared and filed from start to finish',
        'Unlimited year-round CPA consultation calls',
        'Priority expediting across all state and IRS filings',
      ],
      btnText: 'Start with Business-in-a-Box™ →',
    },
  };

  tierBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tierBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const tier = btn.getAttribute('data-sh-tier');
      const plan = data[tier];
      if (plan) {
        if (eyebrow) eyebrow.textContent = plan.eyebrow;
        if (priceVal) priceVal.innerHTML = plan.price + ' <span>' + plan.sub + '</span>';
        if (ctaBtn) ctaBtn.innerHTML = '<span>' + plan.btnText + '</span>';
        if (list) {
          list.innerHTML = plan.features
            .map((f) => '<li><span class="sh-chk">✓</span><span>' + f + '</span></li>')
            .join('');
        }
      }
    });
  });
}

/* ==========================================================================
   14. Vertical Auto-Scrolling Reviews Track Duplication (Screenshot 4)
   ========================================================================== */
function initVerticalReviews() {
  const tracks = document.querySelectorAll('.vr-track');
  if (!tracks.length) return;
  tracks.forEach((track) => {
    // Clone children to make smooth continuous vertical loop
    const items = Array.from(track.children);
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
  });
}
