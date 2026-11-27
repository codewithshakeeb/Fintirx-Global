/**
 * Fintrix Global - Production Client Script
 * Dual-Jurisdiction US & UK Company Formation & Compliance Ecosystem
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initDropdownMenus();
  initJourneyConsole();
  initFeatureSwitcher();
  initPricingSwitcher();
  initPlanMatcher();
  initComparisonFilters();
  initResourceFilters();
  initFaqAccordion();
  initConsultationForm();
  initSmoothScroll();
  initScrollReveals();
  initContactPrefillAndDock();
  initMasterUxControls();
});

/* ==========================================================================
   1. Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const updateHeaderState = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
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
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   3. Accessible Dropdown Navigation
   ========================================================================== */
function initDropdownMenus() {
  document.querySelectorAll('.nav-item.has-dropdown').forEach((item) => {
    const toggle = item.querySelector('.dropdown-toggle');
    const menu = item.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isExpanded));
    });

    document.addEventListener('click', (e) => {
      if (!item.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ==========================================================================
   4. 5-Step Business Journey + Interactive Fintrix Client Console
   ========================================================================== */
function initJourneyConsole() {
  const stepsList = document.getElementById('journeyStepsList');
  const consoleCard = document.getElementById('fintrixClientConsole');
  if (!stepsList || !consoleCard) return;

  const stepMeta = {
    1: { heading: 'Stage 1: Entity Formation', progress: 'Progress: 20% — Formation Filing Ready' },
    2: { heading: 'Stage 2: Tax IDs & Registrations', progress: 'Progress: 40% — EIN / VAT Preparation' },
    3: { heading: 'Stage 3: Banking & Payment Prep', progress: 'Progress: 60% — Document Pack Ready' },
    4: { heading: 'Stage 4: Brand & Trademark Protection', progress: 'Progress: 80% — IP Search & Filing' },
    5: { heading: 'Stage 5: Annual Compliance & Renewals', progress: 'Progress: 100% — Ongoing Good Standing' }
  };

  const stepItems = stepsList.querySelectorAll('.journey-acc-item');
  const consoleRows = consoleCard.querySelectorAll('.console-step-row');
  const activeHeading = document.getElementById('consoleActiveHeading');
  const stepCounter = document.getElementById('consoleStepCounter');
  const progressText = document.getElementById('consoleProgressText');
  const progressBarFill = document.getElementById('consoleProgressBarFill');

  const activateStep = (stepNum) => {
    stepItems.forEach((btn) => {
      const s = Number(btn.getAttribute('data-step'));
      const isMatch = s === stepNum;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-expanded', String(isMatch));
    });

    consoleRows.forEach((row) => {
      const r = Number(row.getAttribute('data-console-step'));
      const pill = row.querySelector('.console-status-pill');
      row.classList.remove('completed', 'current', 'upcoming');

      if (r < stepNum) {
        row.classList.add('completed');
        if (pill) pill.textContent = 'Completed';
      } else if (r === stepNum) {
        row.classList.add('current');
        if (pill) pill.textContent = 'Active Stage';
      } else {
        row.classList.add('upcoming');
        if (pill) pill.textContent = 'Pending';
      }
    });

    const meta = stepMeta[stepNum];
    if (meta) {
      if (activeHeading) activeHeading.textContent = meta.heading;
      if (stepCounter) stepCounter.textContent = `Step ${stepNum} of 5`;
      if (progressText) progressText.textContent = meta.progress;
      if (progressBarFill) progressBarFill.style.width = `${stepNum * 20}%`;
    }
  };

  stepItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const stepNum = Number(btn.getAttribute('data-step'));
      activateStep(stepNum);
    });
  });
}

/* ==========================================================================
   5. Interactive Feature Switcher ("One Login" Tabbed Card Style)
   ========================================================================== */
function initFeatureSwitcher() {
  const tabs = document.querySelectorAll('[data-feature-tab]');
  const card = document.getElementById('featureSplitCard');
  if (!tabs.length || !card) return;

  const featureData = {
    formation: {
      previewTitle: 'Entity Formation Docket',
      previewBadge: 'State & UK Filings',
      rows: [
        ['Name Availability Check', 'Included', '#1F7091'],
        ['Articles / IN01 Filing', 'Prepared & Lodged', '#1F7091'],
        ['Operating Agreement / Articles', 'Digital Delivery', '#1F7091'],
        ['Government Fee Transparency', 'Billed at Cost', '#0F2936']
      ],
      title: 'Form Your US LLC or UK LTD Without Administrative Errors',
      desc: 'We guide you on jurisdiction choice, verify company name availability, and file directly with US Secretaries of State or UK Companies House.',
      bullets: [
        'US LLC or C-Corp formation in Wyoming, Delaware, New Mexico, or Florida',
        'UK Private Limited Company (LTD) incorporation with director ID guidance',
        'Standard Operating Agreement or Articles of Association templates',
        '100% digital ownership and delivery of official stamped certificates'
      ],
      ctaText: 'Explore Formation Services →',
      ctaHref: 'services.html#company-formation'
    },
    agent: {
      previewTitle: 'Registered Office & Mailroom',
      previewBadge: 'Privacy Shield',
      rows: [
        ['In-State Registered Agent', 'Physical Street Address', '#1F7091'],
        ['UK Registered Office', 'London Commercial Suite', '#1F7091'],
        ['Official Mail Intake', 'Scanned to PDF', '#1F7091'],
        ['Home Address Exposure', 'Protected from Public Record', '#0F2936']
      ],
      title: 'Protect Your Privacy with Commercial Registered Representation',
      desc: 'Every US LLC and UK LTD needs an official in-jurisdiction address to receive government and legal notices.',
      bullets: [
        'Physical in-state Registered Agent across Wyoming, Delaware, NM, and Florida',
        'Official UK Registered Office for Companies House and HMRC correspondence',
        'Daily mail scanning with prompt digital notifications',
        'Clear annual renewal terms stated upfront before you pay'
      ],
      ctaText: 'View Address & Agent Details →',
      ctaHref: 'usa-formation.html'
    },
    tax: {
      previewTitle: 'Tax ID & Federal Filings',
      previewBadge: 'IRS & HMRC Prep',
      rows: [
        ['IRS EIN Application (SS-4)', 'No SSN Required', '#1F7091'],
        ['ITIN Individual Tax ID', 'Eligibility & Doc Review', '#1F7091'],
        ['UK VAT & EORI Registration', 'HMRC Coordination', '#1F7091'],
        ['Foreign-Owned LLC Returns', 'Form 5472 & 1120 Prep', '#0F2936']
      ],
      title: 'Obtain Tax Identification Numbers & Stay Ahead of Filings',
      desc: 'We prepare EIN, ITIN, UK VAT, and EORI applications and coordinate federal and statutory reporting.',
      bullets: [
        'IRS EIN application preparation for non-US founders without an SSN',
        'ITIN document review and Certified Acceptance Agent coordination where needed',
        'UK VAT and EORI registration preparation for UK/EU commerce',
        'USA Sales Tax state nexus review and registration support'
      ],
      ctaText: 'Explore Tax ID Support →',
      ctaHref: 'services.html#ein-itin'
    },
    banking: {
      previewTitle: 'Banking Readiness Checklist',
      previewBadge: 'Document Pack',
      rows: [
        ['Formation Document Pack', 'Verified & Compiled', '#1F7091'],
        ['Commercial Address Proof', 'Prepared', '#1F7091'],
        ['Business Activity Summary', 'Structured for Review', '#1F7091'],
        ['Provider Approval Decision', 'Determined by Provider', '#0F2936']
      ],
      title: 'Prepare Clean Bank & Payment Account Applications',
      desc: 'We help eligible clients compile formation packs and commercial summaries for Mercury, Relay, Stripe, Wise, Payoneer, and PayPal. No approval is guaranteed.',
      bullets: [
        'Complete corporate formation and tax ID document bundle',
        'Clear business activity and customer-market summary preparation',
        'Step-by-step application guidance and follow-up question support',
        'Independent assistance only — we are not affiliated with any provider'
      ],
      ctaText: 'Read Banking Support Scope →',
      ctaHref: 'services.html#banking-payment-support'
    },
    compliance: {
      previewTitle: 'Annual Compliance Calendar',
      previewBadge: 'Good Standing',
      rows: [
        ['US State Annual Report', 'Tracked & Reminded', '#1F7091'],
        ['UK Confirmation Statement', 'Companies House Filing', '#1F7091'],
        ['Registered Agent Renewal', 'Advance Notification', '#1F7091'],
        ['Statutory Accounts / CT600', 'Coordinated Support', '#0F2936']
      ],
      title: 'Keep Annual Reports, Taxes & Renewals on Schedule',
      desc: 'Late filings lead to statutory penalties or entity dissolution. We track every due date and help you stay in good standing.',
      bullets: [
        'Automated reminders ahead of state annual report and franchise tax dates',
        'UK annual confirmation statement and statutory accounts coordination',
        'Foreign-owned US LLC Form 5472 / 1120 preparation support',
        'Transparent yearly renewal breakdown itemized before you commit'
      ],
      ctaText: 'Explore Annual Compliance →',
      ctaHref: 'services.html#annual-tax-compliance'
    }
  };

  const previewTitle = document.getElementById('featurePreviewTitle');
  const previewBadge = document.getElementById('featurePreviewBadge');
  const previewRows = document.getElementById('featurePreviewRows');
  const contentTitle = document.getElementById('featureContentTitle');
  const contentDesc = document.getElementById('featureContentDesc');
  const checklist = document.getElementById('featureChecklist');
  const ctaLink = document.getElementById('featureCtaLink');

  const checkSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.getAttribute('data-feature-tab');
      const data = featureData[key];
      if (!data) return;

      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
      });

      card.classList.add('transitioning');
      setTimeout(() => {
        if (previewTitle) previewTitle.textContent = data.previewTitle;
        if (previewBadge) previewBadge.textContent = data.previewBadge;
        if (previewRows) {
          previewRows.innerHTML = data.rows.map(([label, val, color]) => `
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <span style="color: #4A6572;">${label}</span>
              <strong style="color: ${color};">${val}</strong>
            </div>
          `).join('');
        }
        if (contentTitle) contentTitle.textContent = data.title;
        if (contentDesc) contentDesc.textContent = data.desc;
        if (checklist) {
          checklist.innerHTML = data.bullets.map((b) => `<li>${checkSvg}<span>${b}</span></li>`).join('');
        }
        if (ctaLink) {
          ctaLink.textContent = data.ctaText;
          ctaLink.setAttribute('href', data.ctaHref);
        }
        card.classList.remove('transitioning');
      }, 150);
    });
  });
}

/* ==========================================================================
   6. Pricing Switcher (Home & Pricing Pages)
   ========================================================================== */
function initPricingSwitcher() {
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
      elUS.setAttribute('aria-checked', String(isUS));
      elUK.classList.toggle('active', !isUS);
      elUK.setAttribute('aria-checked', String(!isUS));

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
    const map = isUS
      ? {
          t1: 'Starter', t2: 'Plus', t3: 'Complete',
          c: '$', v1: '199', v2: '499', v3: '999',
          p1: 'one-time', p2: '/year', p3: '/year',
          f: '+ state filing fee charged separately at cost',
          d1: 'Essential formation filing and portal access for lean founders.',
          d2: 'Registered agent privacy, commercial address, and EIN support.',
          d3: 'Full formation plus bank and merchant application preparation.',
          l1: '<li><strong>LLC filing assistance:</strong> State submission coordination</li><li><strong>Operating Agreement template:</strong> Customized governing file</li><li><strong>Client portal access:</strong> Digital corporate vault</li><li><strong>Compliance guidance:</strong> Initial calendar &amp; reminders</li>',
          l2: '<li><strong>Everything in Starter, plus:</strong></li><li><strong>Registered agent service:</strong> Full 1st year included</li><li><strong>Business address service:</strong> Commercial address &amp; mail scanning</li><li><strong>EIN assistance:</strong> IRS application preparation</li>',
          l3: '<li><strong>Everything in Plus, plus:</strong></li><li><strong>Bank application support:</strong> Document pack prep (no guarantee)</li><li><strong>Merchant account support:</strong> Gateway guidance (no guarantee)</li><li><strong>Priority support desk:</strong> Direct liaison &amp; amendments</li>'
        }
      : {
          t1: 'Essential', t2: 'Plus', t3: 'Complete',
          c: '£', v1: '149', v2: '349', v3: '699',
          p1: 'one-time', p2: '/year', p3: '/year',
          f: '+ Companies House fee charged separately at cost',
          d1: 'Core Companies House incorporation and digital documents.',
          d2: 'Includes registered office, director ID guidance, and bank prep.',
          d3: 'Full UK setup including VAT/EORI and annual confirmation statement.',
          l1: '<li><strong>Companies House filing:</strong> Digital IN01 incorporation</li><li><strong>Digital incorporation pack:</strong> Certificate &amp; Articles</li><li><strong>Registered office address:</strong> 1st year London address</li><li><strong>Director ID guidance:</strong> ECCTA verification steps</li>',
          l2: '<li><strong>Everything in Essential, plus:</strong></li><li><strong>Bank application prep:</strong> Document pack (no guarantee)</li><li><strong>Priority verification review:</strong> Pre-submission ID check</li><li><strong>Official mail scanning:</strong> Digital HMRC &amp; registry alerts</li>',
          l3: '<li><strong>Everything in Plus, plus:</strong></li><li><strong>VAT &amp; EORI support:</strong> HMRC registration where eligible</li><li><strong>Confirmation statement:</strong> Annual Companies House filing</li><li><strong>Dedicated account liaison:</strong> Direct WhatsApp &amp; email desk</li>'
        };

    const set = (id, val, html = false) => {
      const el = document.getElementById(id);
      if (el) html ? (el.innerHTML = val) : (el.textContent = val);
    };

    set('previewTierStarter', map.t1);
    set('previewTierStandard', map.t2);
    set('previewTierComplete', map.t3);
    set('previewTargetStarter', map.d1);
    set('previewTargetStandard', map.d2);
    set('previewTargetComplete', map.d3);
    set('previewCurrStarter', map.c);
    set('previewCurrStandard', map.c);
    set('previewCurrComplete', map.c);
    set('previewValStarter', map.v1);
    set('previewValStandard', map.v2);
    set('previewValComplete', map.v3);
    set('previewPeriodStarter', map.p1);
    set('previewPeriodStandard', map.p2);
    set('previewPeriodComplete', map.p3);
    set('previewFeeStarter', map.f);
    set('previewFeeStandard', map.f);
    set('previewFeeComplete', map.f);
    set('previewFeatStarter', map.l1, true);
    set('previewFeatStandard', map.l2, true);
    set('previewFeatComplete', map.l3, true);

    const c1 = document.querySelector('#cardPreviewStarter a.btn');
    const c2 = document.querySelector('#cardPreviewStandard a.btn');
    const c3 = document.querySelector('#cardPreviewComplete a.btn');
    if (c1) {
      c1.textContent = isUS ? 'Choose Starter' : 'Choose Essential';
      c1.href = isUS ? 'contact.html?plan=us-starter' : 'contact.html?plan=uk-essential';
    }
    if (c2) {
      c2.textContent = 'Choose Plus';
      c2.href = isUS ? 'contact.html?plan=us-plus' : 'contact.html?plan=uk-plus';
    }
    if (c3) {
      c3.textContent = 'Choose Complete';
      c3.href = isUS ? 'contact.html?plan=us-complete' : 'contact.html?plan=uk-complete';
    }
  }

  function updateFullPricingCards(isUS) {
    const valStarter = document.getElementById('tierValStarter');
    const currStarter = document.getElementById('tierCurrStarter');
    const feeStarter = document.getElementById('tierFeeStarter');
    const featStarter = document.getElementById('tierFeatStarter');
    const nameStarter = document.getElementById('tierNameStarter');

    const valStandard = document.getElementById('tierValStandard');
    const currStandard = document.getElementById('tierCurrStandard');
    const feeStandard = document.getElementById('tierFeeStandard');
    const featStandard = document.getElementById('tierFeatStandard');

    const valComplete = document.getElementById('tierValComplete');
    const currComplete = document.getElementById('tierCurrComplete');
    const feeComplete = document.getElementById('tierFeeComplete');
    const featComplete = document.getElementById('tierFeatComplete');

    if (!valStarter || !valStandard || !valComplete) return;
    const p1 = document.querySelector('#pricingCardStarter a.btn');
    const p2 = document.querySelector('#pricingCardStandard a.btn');
    const p3 = document.querySelector('#pricingCardComplete a.btn');
    if (p1) {
      p1.textContent = isUS ? 'Choose Starter' : 'Choose Essential';
      p1.href = isUS ? 'contact.html?plan=us-starter' : 'contact.html?plan=uk-essential';
    }
    if (p2) {
      p2.textContent = 'Choose Plus (Most Popular)';
      p2.href = isUS ? 'contact.html?plan=us-plus' : 'contact.html?plan=uk-plus';
    }
    if (p3) {
      p3.textContent = 'Choose Complete';
      p3.href = isUS ? 'contact.html?plan=us-complete' : 'contact.html?plan=uk-complete';
    }

    if (isUS) {
      if (nameStarter) nameStarter.textContent = 'Starter';
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
      if (nameStarter) nameStarter.textContent = 'Essential';
      if (currStarter) currStarter.textContent = '£';
      valStarter.textContent = '149';
      if (feeStarter) feeStarter.textContent = '+ statutory Companies House fee billed at cost';

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
          <li><strong>Banking Application Preparation:</strong> Document pack (no guarantee)</li>
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
   7. Interactive 2-Question Plan Matcher
   ========================================================================== */
function initPlanMatcher() {
  const q1Row = document.getElementById('matcherQ1');
  const q2Row = document.getElementById('matcherQ2');
  const planName = document.getElementById('matcherPlanName');
  const planDesc = document.getElementById('matcherPlanDesc');
  const planCta = document.getElementById('matcherPlanCta');
  const resultBox = document.getElementById('matcherResultBox');

  if (!q1Row || !q2Row || !planName || !planDesc || !planCta) return;

  let state = { q1: 'us', q2: 'standard' };

  const recommendations = {
    us: {
      basic: {
        name: 'USA Starter Package ($199 one-time + state fee)',
        desc: 'Best for lean founders who only need LLC state filing coordination, Operating Agreement template, and portal access.',
        href: 'contact.html?plan=starter'
      },
      standard: {
        name: 'USA Plus Package ($499/year + state fee)',
        desc: 'Most Popular: Includes LLC filing, 1st year Registered Agent, commercial address, and IRS EIN preparation.',
        href: 'contact.html?plan=plus'
      },
      full: {
        name: 'USA Complete Package ($999/year + state fee)',
        desc: 'Includes everything in Plus plus bank & merchant application document preparation (no approval guarantee) and priority support.',
        href: 'contact.html?plan=complete'
      }
    },
    uk: {
      basic: {
        name: 'UK Essential Package (£149 one-time + Companies House fee)',
        desc: 'Best for founders needing Companies House incorporation, digital documents, 1st year registered office, and director ID guidance.',
        href: 'contact.html?plan=essential'
      },
      standard: {
        name: 'UK Plus Package (£349/year + Companies House fee)',
        desc: 'Most Popular: Includes Essential items plus banking application preparation (no approval guarantee) and priority ID check.',
        href: 'contact.html?plan=plus'
      },
      full: {
        name: 'UK Complete Package (£699/year + Companies House fee)',
        desc: 'Includes VAT and EORI registration support, annual confirmation statement filing, and dedicated account liaison.',
        href: 'contact.html?plan=complete'
      }
    }
  };

  const renderResult = () => {
    const rec = recommendations[state.q1][state.q2];
    if (resultBox) resultBox.classList.add('updating');
    setTimeout(() => {
      planName.textContent = rec.name;
      planDesc.textContent = rec.desc;
      planCta.setAttribute('href', rec.href);
      if (resultBox) resultBox.classList.remove('updating');
    }, 120);
  };

  q1Row.querySelectorAll('[data-q1]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.q1 = btn.getAttribute('data-q1');
      q1Row.querySelectorAll('[data-q1]').forEach((b) => b.classList.toggle('active', b === btn));
      renderResult();
    });
  });

  q2Row.querySelectorAll('[data-q2]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.q2 = btn.getAttribute('data-q2');
      q2Row.querySelectorAll('[data-q2]').forEach((b) => b.classList.toggle('active', b === btn));
      renderResult();
    });
  });
}

/* ==========================================================================
   8. Comparison Table Filters (Index & us-llc-vs-uk-ltd.html)
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
    buttons.forEach((b) => b.classList.remove('active'));
    activeBtn.classList.add('active');

    rows.forEach((row) => {
      if (category === 'all') {
        row.style.display = '';
        row.style.backgroundColor = '';
      } else if (category === 'gov') {
        const match = row.classList.contains('row-gov');
        row.style.display = match ? '' : 'none';
        row.style.backgroundColor = match ? '#F4F9FC' : '';
      } else if (category === 'tax') {
        const match = row.classList.contains('row-tax');
        row.style.display = match ? '' : 'none';
        row.style.backgroundColor = match ? '#EBF5FA' : '';
      }
    });
  };

  btnAll.addEventListener('click', () => filterRows('all', btnAll));
  btnGov.addEventListener('click', () => filterRows('gov', btnGov));
  btnTax.addEventListener('click', () => filterRows('tax', btnTax));
}

/* ==========================================================================
   9. Resource Category Filters (resources.html)
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
        card.style.display = (targetCategory === 'all' || categories.includes(targetCategory)) ? 'flex' : 'none';
      });
    });
  });
}

/* ==========================================================================
   10. FAQ Accordion
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
   11. Consultation Quote Form Handler
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultationQuoteForm');
  const modal = document.getElementById('contactSuccessModal');
  const modalClose = document.getElementById('btnContactModalClose');

  if (!form || !modal) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const requiredInputs = form.querySelectorAll('[required]');
    let isValid = true;

    requiredInputs.forEach((input) => {
      if (input.type === 'checkbox') {
        if (!input.checked) isValid = false;
      } else if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#DC2626';
      } else {
        input.style.borderColor = '#D7E7F0';
      }
    });

    if (!isValid) {
      return;
    }

    modal.style.display = 'flex';
    form.reset();
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
}

/* ==========================================================================
   12. Smooth Scroll with Sticky Header Clearance
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 96;
        const offsetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   13. Safe Scroll-Triggered Section & Card Reveals
   ========================================================================== */
function initScrollReveals() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const targets = document.querySelectorAll(
    '.market-card, .service-clean-card, .package-card, .guide-card-clean, .support-mini-card, .provider-logo-tile, .console-preview-card, .feature-split-card, .plan-matcher-card'
  );
  if (!targets.length || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('js-reveal-ready');
  targets.forEach((el) => el.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: '0px 0px -24px 0px' }
  );

  targets.forEach((el) => observer.observe(el));

  // Safety fallback: never leave elements stuck hidden if observer misses fast scroll
  setTimeout(() => {
    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 120) {
        el.classList.add('is-visible');
      }
    });
  }, 900);
}

/* ==========================================================================
   14. Contact ?plan= / ?service= Prefill & Footer WhatsApp Dock
   ========================================================================== */
function initContactPrefillAndDock() {
  // 1. Prefill /contact dropdown & message from URLSearchParams
  const params = new URLSearchParams(window.location.search);
  const plan = (params.get('plan') || '').toLowerCase();
  const service = (params.get('service') || '').toLowerCase();
  const subject = (params.get('subject') || '').toLowerCase();

  const selectEl = document.getElementById('serviceInterest') || document.querySelector('select[name="serviceInterest"]');
  const msgEl = document.getElementById('message') || document.querySelector('textarea[name="message"]');

  if (selectEl) {
    if (plan.startsWith('uk')) {
      selectEl.value = 'UK formation';
    } else if (plan.startsWith('us') || ['starter', 'plus', 'complete'].includes(plan)) {
      selectEl.value = 'USA formation';
    } else if (plan === 'essential') {
      selectEl.value = 'UK formation';
    } else if (service === 'formation') {
      selectEl.value = 'USA formation';
    } else if (service === 'ein-itin') {
      selectEl.value = 'EIN or ITIN';
    } else if (service === 'compliance') {
      selectEl.value = 'Tax and compliance';
    } else if (service === 'banking') {
      selectEl.value = 'Banking support';
    } else if (service === 'trademark') {
      selectEl.value = 'Trademark registration';
    } else if (subject === 'dual-entity') {
      selectEl.value = 'Dual US and UK bundle';
    } else if (service) {
      selectEl.value = 'Other';
    }
  }

  if (msgEl && !msgEl.value.trim()) {
    if (plan) {
      msgEl.value = `Interested in package: ${plan.toUpperCase()}. Please send an itemized quote.`;
    } else if (service) {
      msgEl.value = `Interested in service: ${service}. Please send an itemized quote.`;
    } else if (subject === 'dual-entity') {
      msgEl.value = 'Interested in Dual US LLC + UK LTD registration. Please send an itemized quote.';
    }
  }

  // 2. Dock/hide floating WhatsApp button when #footer is in view so it never overlaps footer text
  const waBtn = document.querySelector('.floating-whatsapp-btn');
  const footer = document.getElementById('footer');
  if (waBtn && footer && 'IntersectionObserver' in window) {
    const footerObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          waBtn.classList.toggle('hidden-near-footer', entry.isIntersecting);
        });
      },
      { threshold: 0.05 }
    );
    footerObs.observe(footer);
  }
}

/* ==========================================================================
   15. Master UX Controls (Compare Matrix, Load More FAQs, Newsletter, Cookie)
   ========================================================================== */
function initMasterUxControls() {
  // 1. Expandable Compare All Features Matrix
  const compareBtn = document.getElementById('btnCompareAllFeatures');
  const comparePanel = document.getElementById('compareMatrixCollapse');
  if (compareBtn && comparePanel) {
    compareBtn.addEventListener('click', () => {
      const open = comparePanel.classList.toggle('open');
      compareBtn.setAttribute('aria-expanded', String(open));
      compareBtn.innerHTML = open ? 'Hide Full Comparison &uarr;' : 'Compare All Features &darr;';
    });
  }

  // 2. Load More FAQs toggle
  const loadFaqBtn = document.getElementById('btnLoadMoreFaqs');
  const faqAccordion = document.getElementById('homeFaqAccordion');
  if (loadFaqBtn && faqAccordion) {
    loadFaqBtn.addEventListener('click', () => {
      const showingAll = faqAccordion.classList.toggle('show-all-faqs');
      loadFaqBtn.setAttribute('aria-expanded', String(showingAll));
      loadFaqBtn.innerHTML = showingAll ? 'Show Fewer FAQs &uarr;' : 'Load More FAQs &rarr;';
    });
  }

  // 3. Monthly Compliance Newsletter form
  const nlForm = document.getElementById('newsletterForm');
  const nlEmail = document.getElementById('newsletterEmail');
  const nlFeedback = document.getElementById('newsletterFeedback');
  if (nlForm && nlEmail && nlFeedback) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = nlEmail.value.trim();
      if (!val || !val.includes('@')) {
        nlEmail.style.borderColor = '#DC2626';
        nlFeedback.style.color = '#DC2626';
        nlFeedback.textContent = 'Please enter a valid email address.';
        nlFeedback.style.display = 'block';
        return;
      }
      nlEmail.style.borderColor = '#D7E7F0';
      nlFeedback.style.color = '#1F7091';
      nlFeedback.textContent = 'Subscribed. We will send one monthly US & UK compliance calendar reminder.';
      nlFeedback.style.display = 'block';
      nlForm.reset();
    });
  }

  // 4. Essential Cookie Pill (localStorage)
  const cookiePill = document.getElementById('cookiePillNotice');
  const cookieOk = document.getElementById('cookieOkBtn');
  if (cookiePill && cookieOk) {
    try {
      if (localStorage.getItem('fintrix_cookie_ok') === '1') {
        cookiePill.classList.add('hidden');
      }
    } catch (_) {}
    cookieOk.addEventListener('click', () => {
      cookiePill.classList.add('hidden');
      try {
        localStorage.setItem('fintrix_cookie_ok', '1');
      } catch (_) {}
    });
  }

  // 5. Close mega-menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown-toggle[aria-expanded="true"]').forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
      });
    }
  });
}
