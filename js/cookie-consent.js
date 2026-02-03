// Cookie Consent Management
(function() {
  'use strict';

  const COOKIE_CONSENT_KEY = 'cookieConsent';
  const COOKIE_EXPIRY_DAYS = 365;

  // Get cookie consent modal elements
  const modal = document.getElementById('cookieConsentModal');
  const closeBtn = document.getElementById('cookieCloseBtn');
  const acceptSelectedBtn = document.getElementById('acceptSelectedBtn');
  const acceptAllBtn = document.getElementById('acceptAllBtn');
  const denyAllBtn = document.getElementById('denyAllBtn');
  const pageContent = document.getElementById('pageContent');
  const body = document.body;

  // Cookie group checkboxes
  const cookieCheckboxes = {
    googleAnalytics: document.getElementById('cookieGoogleAnalytics'),
    googleTagManager: document.getElementById('cookieGoogleTagManager'),
    googleAdvertising: document.getElementById('cookieGoogleAdvertising'),
    hubSpot: document.getElementById('cookieHubSpot'),
    notSpecified: document.getElementById('cookieNotSpecified')
  };

  // Check if user has already given consent
  function hasConsent() {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) return false;
    
    try {
      const consentData = JSON.parse(consent);
      // Check if consent is still valid (not expired)
      if (consentData.expiry && new Date(consentData.expiry) < new Date()) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  // Save consent to localStorage
  function saveConsent(consentData) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
    
    const data = {
      ...consentData,
      timestamp: new Date().toISOString(),
      expiry: expiryDate.toISOString()
    };
    
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(data));
  }

  // Get current consent preferences
  function getConsentPreferences() {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) return null;
    
    try {
      return JSON.parse(consent);
    } catch (e) {
      return null;
    }
  }

  // Show cookie consent modal
  function showCookieConsent() {
    if (modal) {
      modal.classList.remove('hidden');
      body.classList.add('cookie-consent-blocked');
      
      // Load previous preferences if available
      const previousConsent = getConsentPreferences();
      if (previousConsent) {
        if (previousConsent.googleAnalytics) cookieCheckboxes.googleAnalytics.checked = true;
        if (previousConsent.googleTagManager) cookieCheckboxes.googleTagManager.checked = true;
        if (previousConsent.googleAdvertising) cookieCheckboxes.googleAdvertising.checked = true;
        if (previousConsent.hubSpot) cookieCheckboxes.hubSpot.checked = true;
        if (previousConsent.notSpecified) cookieCheckboxes.notSpecified.checked = true;
      }
    }
  }

  // Hide cookie consent modal
  function hideCookieConsent() {
    if (modal) {
      modal.classList.add('hidden');
      body.classList.remove('cookie-consent-blocked');
    }
  }

  // Get selected cookie preferences
  function getSelectedCookies() {
    return {
      googleAnalytics: cookieCheckboxes.googleAnalytics.checked,
      googleTagManager: cookieCheckboxes.googleTagManager.checked,
      googleAdvertising: cookieCheckboxes.googleAdvertising.checked,
      hubSpot: cookieCheckboxes.hubSpot.checked,
      notSpecified: cookieCheckboxes.notSpecified.checked
    };
  }

  // Accept selected cookies
  function acceptSelected() {
    const preferences = getSelectedCookies();
    saveConsent(preferences);
    hideCookieConsent();
    
    // Initialize accepted cookie services
    initializeCookieServices(preferences);
  }

  // Accept all cookies
  function acceptAll() {
    // Check all boxes
    Object.values(cookieCheckboxes).forEach(checkbox => {
      if (checkbox) checkbox.checked = true;
    });
    
    const preferences = getSelectedCookies();
    saveConsent(preferences);
    hideCookieConsent();
    
    // Initialize all cookie services
    initializeCookieServices(preferences);
  }

  // Deny all cookies
  function denyAll() {
    // Uncheck all boxes
    Object.values(cookieCheckboxes).forEach(checkbox => {
      if (checkbox) checkbox.checked = false;
    });
    
    const preferences = getSelectedCookies();
    saveConsent(preferences);
    hideCookieConsent();
    
    // Don't initialize any cookie services
    initializeCookieServices(preferences);
  }

  // Initialize cookie services based on consent
  function initializeCookieServices(preferences) {
    // Only initialize services that user has consented to
    if (preferences.googleAnalytics) {
      // Initialize Google Analytics
      console.log('Google Analytics initialized');
    }
    
    if (preferences.googleTagManager) {
      // Initialize Google Tag Manager
      console.log('Google Tag Manager initialized');
    }
    
    if (preferences.googleAdvertising) {
      // Initialize Google Advertising
      console.log('Google Advertising initialized');
    }
    
    if (preferences.hubSpot) {
      // Initialize HubSpot
      console.log('HubSpot initialized');
    }
    
    if (preferences.notSpecified) {
      // Initialize other services
      console.log('Other services initialized');
    }
  }

  // Event Listeners
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Don't allow closing without making a choice
      // You can remove this if you want to allow closing
    });
  }

  if (acceptSelectedBtn) {
    acceptSelectedBtn.addEventListener('click', acceptSelected);
  }

  if (acceptAllBtn) {
    acceptAllBtn.addEventListener('click', acceptAll);
  }

  if (denyAllBtn) {
    denyAllBtn.addEventListener('click', denyAll);
  }

  // Prevent closing modal by clicking outside (mandatory consent)
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        // Prevent closing by clicking outside
        e.stopPropagation();
      }
    });
  }

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    if (!hasConsent()) {
      showCookieConsent();
    } else {
      // Load previous consent and initialize services
      const preferences = getConsentPreferences();
      if (preferences) {
        initializeCookieServices(preferences);
      }
    }
  });

  // Export functions for external use if needed
  window.cookieConsent = {
    show: showCookieConsent,
    hide: hideCookieConsent,
    getPreferences: getConsentPreferences,
    hasConsent: hasConsent
  };

})();

