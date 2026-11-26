/**
 * Fintrix Global - Production Client Script
 * Dual-Jurisdiction US & UK Company Formation & Compliance Ecosystem
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initDropdownMenus();
  initPricingSwitcher();
  initComparisonFilters();
  initResourceFilters();
  initFaqAccordion();
  initConsultationForm();
  initSmoothScroll();
});

/* ==========================================================================
   1. Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const updateHeaderState = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}

/* ==========================================================================
   2. Mobile Drawer Navigation
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('drawerClose');

  if (!drawer || !toggleBtn) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  // Close when clicking outside drawer content
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) {
      closeDrawer();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Close drawer when clicking any link
  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/* ==========================================================================
   3. Accessible Dropdown Navigation
   ========================================================================== */
function initDropdownMenus() {
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
  dropdownItems.forEach((item) => {
    const toggle = item.querySelector('.dropdown-toggle');
    const menu = item.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!item.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ==========================================================================
   4. Pricing Switcher (Home & Pricing Pages)
   ========================================================================== */
function initPricingSwitcher() {
  // Support both Home preview and Pricing page switchers
  const pairs = [
    { btnUS: 'btnPreviewUS', btnUK: 'btnPreviewUK', type: 'preview' },
    { btnUS: 'btnPricingUS', btnUK: 'btnPricingUK', type: 'full' }
  ];

  pairs.forEach(({ btnUS, btnUK, type }) => {
    const elUS = document.getElementById(btnUS);
    const elUK = document.getElementById(btnUK);
    if (!elUS || !elUK) return;

    const setJurisdiction = (jurisdiction) => {
      const isUS = jurisdiction === 'US';
      elUS.classList.toggle('active', isUS);
      elUS.setAttribute('aria-checked', isUS);
      elUK.classList.toggle('active', !isUS);
      elUK.setAttribute('aria-checked', !isUS);

      if (type === 'preview') {
        updatePreviewCards(isUS);
      } else {
        updateFullPricingCards(isUS);
      }
    };

    elUS.addEventListener('click', () => setJurisdiction('US'));
    elUK.addEventListener('click', () => setJurisdiction('UK'));
  });

  function updatePreviewCards(isUS) {
    const currStarter = document.getElementById('previewCurrStarter');
    const valStarter = document.getElementById('previewValStarter');
    const periodStarter = document.getElementById('previewPeriodStarter');
    const feeStarter = document.getElementById('previewFeeStarter');
    const featStarter = document.getElementById('previewFeatStarter');

    const currStandard = document.getElementById('previewCurrStandard');
    const valStandard = document.getElementById('previewValStandard');
    const feeStandard = document.getElementById('previewFeeStandard');
    const featStandard = document.getElementById('previewFeatStandard');

    const currComplete = document.getElementById('previewCurrComplete');
    const valComplete = document.getElementById('previewValComplete');
    const feeComplete = document.getElementById('previewFeeComplete');
    const featComplete = document.getElementById('previewFeatComplete');

    if (!valStarter || !valStandard || !valComplete) return;

    if (isUS) {
      if (currStarter) currStarter.textContent = '$';
      valStarter.textContent = '199';
      if (periodStarter) periodStarter.textContent = 'one-time';
      if (feeStarter) feeStarter.textContent = '+ applicable state filing fee billed at cost';

      if (currStandard) currStandard.textContent = '$';
      valStandard.textContent = '499';
      if (feeStandard) feeStandard.textContent = '+ state filing fees billed at cost';

      if (currComplete) currComplete.textContent = '$';
      valComplete.textContent = '999';
      if (feeComplete) feeComplete.textContent = '+ state filing fees billed at cost';

      if (featStarter) {
        featStarter.innerHTML = `
          <li><strong>LLC filing assistance:</strong> Complete Articles of Organization submission</li>
          <li><strong>State registration coordination:</strong> Name availability check and state lodgement</li>
          <li><strong>Operating Agreement template:</strong> Customized legal structure document</li>
          <li><strong>Client portal access:</strong> Central digital vault for corporate documents</li>
          <li><strong>Compliance guidance:</strong> Initial statutory calendar and reminder setup</li>
        `;
      }
      if (featStandard) {
        featStandard.innerHTML = `
          <li><strong>Everything in Starter, plus:</strong></li>
          <li><strong>Registered Agent Service:</strong> Full 1st year statutory representation included</li>
          <li><strong>Commercial Business Address:</strong> Mail scanning and instant PDF notices</li>
          <li><strong>EIN Assistance:</strong> Direct IRS application handling for international owners</li>
          <li><strong>Annual Report Management:</strong> State compliance tracking and filing support</li>
        `;
      }
      if (featComplete) {
        featComplete.innerHTML = `
          <li><strong>Everything in Plus, plus:</strong></li>
          <li><strong>Banking Application Support:</strong> Complete document pack preparation (no guarantee)</li>
          <li><strong>Merchant Account Guidance:</strong> Payment processor application preparation</li>
          <li><strong>Priority Direct Liaison:</strong> Dedicated account manager via phone &amp; WhatsApp</li>
          <li><strong>Corporate Amendments:</strong> Free officer/manager updates during the year</li>
        `;
      }
    } else {
      // UK LTD Mode
      if (currStarter) currStarter.textContent = '£';
      valStarter.textContent = '149';
      if (periodStarter) periodStarter.textContent = 'one-time';
      if (feeStarter) feeStarter.textContent = '+ statutory Companies House fee (£50) billed at cost';

      if (currStandard) currStandard.textContent = '£';
      valStandard.textContent = '349';
      if (feeStandard) feeStandard.textContent = '+ Companies House fee billed at cost';

      if (currComplete) currComplete.textContent = '£';
      valComplete.textContent = '699';
      if (feeComplete) feeComplete.textContent = '+ Companies House fee billed at cost';

      if (featStarter) {
        featStarter.innerHTML = `
          <li><strong>Companies House incorporation:</strong> Complete IN01 digital registration</li>
          <li><strong>Digital incorporation pack:</strong> Certificate, Memorandum &amp; Articles</li>
          <li><strong>UK Registered Office:</strong> Official London address (1st year included)</li>
          <li><strong>Director identity verification:</strong> Step-by-step ECCTA compliance</li>
          <li><strong>Client portal access:</strong> 24/7 digital certificate storage</li>
        `;
      }
      if (featStandard) {
        featStandard.innerHTML = `
          <li><strong>Everything in Essential, plus:</strong></li>
          <li><strong>Banking Application Preparation:</strong> Wise/Payoneer document pack (no guarantee)</li>
          <li><strong>Director Identity Guidance:</strong> Priority assistance with UK verification</li>
          <li><strong>Registered Office Renewal Protection:</strong> Ongoing official mail scanning</li>
          <li><strong>Confirmation Statement Reminder:</strong> Annual Companies House tracker</li>
        `;
      }
      if (featComplete) {
        featComplete.innerHTML = `
          <li><strong>Everything in Plus, plus:</strong></li>
          <li><strong>VAT and EORI Registration:</strong> Full HMRC preparation where eligible</li>
          <li><strong>Confirmation Statement Filing:</strong> Annual Companies House submission included</li>
          <li><strong>Dedicated Account Manager:</strong> Direct phone and WhatsApp support desk</li>
          <li><strong>Officer Amendments:</strong> Director/PSC appointment updates during the year</li>
        `;
      }
    }
  }

  function updateFullPricingCards(isUS) {
    const valStarter = document.getElementById('tierValStarter');
    const currStarter = document.getElementById('tierCurrStarter');
    const feeStarter = document.getElementById('tierFeeStarter');
    const featStarter = document.getElementById('tierFeatStarter');

    const valStandard = document.getElementById('tierValStandard');
    const currStandard = document.getElementById('tierCurrStandard');
    const feeStandard = document.getElementById('tierFeeStandard');
    const featStandard = document.getElementById('tierFeatStandard');

    const valComplete = document.getElementById('tierValComplete');
    const currComplete = document.getElementById('tierCurrComplete');
    const feeComplete = document.getElementById('tierFeeComplete');
    const featComplete = document.getElementById('tierFeatComplete');

    if (!valStarter || !valStandard || !valComplete) return;

    if (isUS) {
      if (currStarter) currStarter.textContent = '$';
      valStarter.textContent = '199';
      if (feeStarter) feeStarter.textContent = '+ applicable state filing fee billed at cost';

      if (currStandard) currStandard.textContent = '$';
      valStandard.textContent = '499';
      if (feeStandard) feeStandard.textContent = '+ state filing fees billed at cost';

      if (currComplete) currComplete.textContent = '$';
      valComplete.textContent = '999';
      if (feeComplete) feeComplete.textContent = '+ state filing fees billed at cost';

      if (featStarter) {
        featStarter.innerHTML = `
          <li><strong>LLC filing assistance:</strong> Complete Articles submission</li>
          <li><strong>State registration coordination:</strong> Name availability &amp; clearance</li>
          <li><strong>Operating Agreement template:</strong> Custom governing document</li>
          <li><strong>Client portal access:</strong> 24/7 digital document vault</li>
          <li><strong>Compliance guidance:</strong> Initial statutory calendar and alerts</li>
          <li class="feat-excluded">Registered agent service</li>
          <li class="feat-excluded">Commercial business address</li>
          <li class="feat-excluded">EIN assistance</li>
          <li class="feat-excluded">Banking application support</li>
        `;
      }
      if (featStandard) {
        featStandard.innerHTML = `
          <li><strong>Everything in Starter, plus:</strong></li>
          <li><strong>Registered Agent Service:</strong> Full 1st year statutory representation included</li>
          <li><strong>Commercial Business Address:</strong> Mail scanning and PDF notices</li>
          <li><strong>EIN Assistance:</strong> Direct IRS application handling for non-residents</li>
          <li><strong>Annual Report Management:</strong> State compliance tracking and filing support</li>
          <li class="feat-excluded">Banking application support</li>
          <li class="feat-excluded">Merchant account support</li>
        `;
      }
      if (featComplete) {
        featComplete.innerHTML = `
          <li><strong>Everything in Plus, plus:</strong></li>
          <li><strong>Bank Application Support:</strong> Complete document pack preparation (no guarantee)</li>
          <li><strong>Merchant Account Guidance:</strong> Payment processor application preparation</li>
          <li><strong>Priority Direct Liaison:</strong> Dedicated account manager via phone &amp; WhatsApp</li>
          <li><strong>Corporate Amendments:</strong> Officer and address updates included during year</li>
        `;
      }
    } else {
      if (currStarter) currStarter.textContent = '£';
      valStarter.textContent = '149';
      if (feeStarter) feeStarter.textContent = '+ statutory Companies House fee (£50) billed at cost';

      if (currStandard) currStandard.textContent = '£';
      valStandard.textContent = '349';
      if (feeStandard) feeStandard.textContent = '+ Companies House fee billed at cost';

      if (currComplete) currComplete.textContent = '£';
      valComplete.textContent = '699';
      if (feeComplete) feeComplete.textContent = '+ Companies House fee billed at cost';

      if (featStarter) {
        featStarter.innerHTML = `
          <li><strong>Companies House incorporation:</strong> Complete IN01 digital registration</li>
          <li><strong>Digital incorporation pack:</strong> Certificate, Memorandum &amp; Articles</li>
          <li><strong>UK Registered Office:</strong> Official London address (1st year included)</li>
          <li><strong>Director identity verification:</strong> Step-by-step ECCTA compliance</li>
          <li><strong>Client portal access:</strong> 24/7 digital certificate storage</li>
          <li class="feat-excluded">Banking application preparation</li>
          <li class="feat-excluded">VAT and EORI registration</li>
          <li class="feat-excluded">Confirmation statement filing</li>
        `;
      }
      if (featStandard) {
        featStandard.innerHTML = `
          <li><strong>Everything in Essential, plus:</strong></li>
          <li><strong>Banking Application Preparation:</strong> Wise/Payoneer document pack (no guarantee)</li>
          <li><strong>Director Identity Guidance:</strong> Priority assistance with UK verification</li>
          <li><strong>Registered Office Renewal Protection:</strong> Ongoing official mail scanning</li>
          <li><strong>Confirmation Statement Reminder:</strong> Annual Companies House tracker</li>
          <li class="feat-excluded">VAT and EORI registration</li>
          <li class="feat-excluded">Confirmation statement filing</li>
        `;
      }
      if (featComplete) {
        featComplete.innerHTML = `
          <li><strong>Everything in Plus, plus:</strong></li>
          <li><strong>VAT and EORI Registration:</strong> Full HMRC preparation where eligible</li>
          <li><strong>Confirmation Statement Filing:</strong> Annual Companies House submission included</li>
          <li><strong>Dedicated Account Manager:</strong> Direct phone and WhatsApp support desk</li>
          <li><strong>Officer Amendments:</strong> Director/PSC appointment updates during the year</li>
        `;
      }
    }
  }
}

/* ==========================================================================
   5. Comparison Table Filters (us-llc-vs-uk-ltd.html)
   ========================================================================== */
function initComparisonFilters() {
  const btnAll = document.getElementById('btnFilterAll');
  const btnGov = document.getElementById('btnFilterGov');
  const btnTax = document.getElementById('btnFilterTax');
  const table = document.getElementById('comparisonTable');

  if (!table || !btnAll || !btnGov || !btnTax) return;

  const buttons = [btnAll, btnGov, btnTax];
  const rows = table.querySelectorAll('.comp-row');

  const filterRows = (category, activeBtn) => {
    buttons.forEach((b) => {
      b.classList.remove('active');
      b.style.background = '#FFFFFF';
      b.style.color = '#0F2936';
    });
    activeBtn.classList.add('active');
    activeBtn.style.background = 'var(--color-primary-dark)';
    activeBtn.style.color = '#FFFFFF';

    rows.forEach((row) => {
      if (category === 'all') {
        row.style.display = '';
        row.style.backgroundColor = '';
      } else if (category === 'gov') {
        if (row.classList.contains('row-gov')) {
          row.style.display = '';
          row.style.backgroundColor = '#F4F9FC';
        } else {
          row.style.display = 'none';
        }
      } else if (category === 'tax') {
        if (row.classList.contains('row-tax')) {
          row.style.display = '';
          row.style.backgroundColor = '#EBF5FA';
        } else {
          row.style.display = 'none';
        }
      }
    });

    const matrixSection = document.getElementById('matrixSection');
    if (matrixSection) {
      matrixSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  btnAll.addEventListener('click', () => filterRows('all', btnAll));
  btnGov.addEventListener('click', () => filterRows('gov', btnGov));
  btnTax.addEventListener('click', () => filterRows('tax', btnTax));
}

/* ==========================================================================
   6. Resource Category Filters (resources.html)
   ========================================================================== */
function initResourceFilters() {
  const filterButtons = document.querySelectorAll('[data-res-filter]');
  const cards = document.querySelectorAll('.res-card');
  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-res-filter');

      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.style.background = '#FFFFFF';
        b.style.color = '#0F2936';
      });
      btn.classList.add('active');
      btn.style.background = 'var(--color-primary-dark)';
      btn.style.color = '#FFFFFF';

      cards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (targetCategory === 'all' || categories.includes(targetCategory)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. FAQ Accordion Clean Interactivity
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';

      // Close all others
      faqItems.forEach((other) => {
        const otherBtn = other.querySelector('.faq-question');
        const otherAns = other.querySelector('.faq-answer');
        if (otherBtn && otherAns) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAns.style.maxHeight = null;
          other.classList.remove('active');
        }
      });

      if (!isExpanded) {
        questionBtn.setAttribute('aria-expanded', 'true');
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
      }
    });
  });
}

/* ==========================================================================
   8. Consultation Quote Form Handler (contact.html)
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultationQuoteForm');
  const modal = document.getElementById('contactSuccessModal');
  const modalClose = document.getElementById('btnContactModalClose');

  if (!form || !modal) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check required fields
    const requiredInputs = form.querySelectorAll('[required]');
    let isValid = true;

    requiredInputs.forEach((input) => {
      if (input.type === 'checkbox') {
        if (!input.checked) isValid = false;
      } else {
        if (!input.value.trim()) isValid = false;
      }
    });

    if (!isValid) {
      alert('Please fill in all required fields and accept the Privacy Policy.');
      return;
    }

    // Show success modal cleanly without page reload
    modal.style.display = 'flex';
    form.reset();
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

/* ==========================================================================
   9. Smooth Scroll with Sticky Header Clearance
   ========================================================================== */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 96;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
