// ==================== MAIN APPLICATION MODULE ====================
// This file initializes and coordinates all modules

// ==================== APPLICATION STATE ====================
const AppState = {
  initialized: false,
  modulesLoaded: {
    config: false,
    auth: false,
    data: false,
    workflow: false,
    calculators: false,
    search: false
  },
  currentScreen: 'auth', // 'auth' or 'app'
  user: null
};

// ==================== INITIALIZATION ====================

/**
 * Initialize the entire application
 */
function initializeApplication() {
  console.log('🚀 Initializing Amastor Workflow Assistant...');
  
  // Check if all required modules are loaded
  if (!checkModulesLoaded()) {
    console.error('❌ Required modules not loaded');
    return false;
  }
  
  // Initialize modules in order
  try {
    // 1. Check authentication
    initializeAuth();
    
    // 2. Setup UI event listeners
    setupUIEventListeners();
    
    // 3. Initialize workflow display
    WorkflowDisplayModule.initialize();
    AppState.modulesLoaded.workflow = true;
    
    // 4. Initialize calculators
    if (ConfigUtils.isFeatureEnabled('ENABLE_CALCULATORS')) {
      CalculatorsModule.initializeCalculators();
      AppState.modulesLoaded.calculators = true;
    }
    
    // 5. Initialize search
    if (ConfigUtils.isFeatureEnabled('ENABLE_SEARCH')) {
      SearchModule.initialize();
      AppState.modulesLoaded.search = true;
    }
    
    // 6. Setup workflow dropdowns
    setupWorkflowDropdowns();
    
    // 7. Display app info
    displayAppInfo();
    
    AppState.initialized = true;
    console.log('✅ Application initialized successfully');
    
    ConfigUtils.logUserAction('APP_INITIALIZED', AppState.modulesLoaded);
    
    return true;
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    return false;
  }
}

/**
 * Check if all required modules are loaded
 */
function checkModulesLoaded() {
  const requiredModules = [
    { name: 'Config', obj: window.AppConfig },
    { name: 'Auth', obj: window.AuthModule },
    { name: 'WorkflowData', obj: window.WorkflowDataModule },
    { name: 'WorkflowDisplay', obj: window.WorkflowDisplayModule },
    { name: 'Calculators', obj: window.CalculatorsModule },
    { name: 'Search', obj: window.SearchModule }
  ];
  
  let allLoaded = true;
  
  requiredModules.forEach(module => {
    if (!module.obj) {
      console.error(`❌ ${module.name} module not loaded`);
      allLoaded = false;
    } else {
      console.log(`✅ ${module.name} module loaded`);
      AppState.modulesLoaded[module.name.toLowerCase()] = true;
    }
  });
  
  return allLoaded;
}

// ==================== AUTHENTICATION FLOW ====================

/**
 * Initialize authentication
 */
function initializeAuth() {
  const authResult = AuthModule.initializeAuth();
  
  if (authResult.success) {
    // User already logged in
    AppState.user = authResult.user;
    showAppScreen();
  } else {
    // Show login screen
    showAuthScreen();
  }
}

/**
 * Show authentication screen
 */
function showAuthScreen() {
  const authScreen = document.getElementById('authScreen');
  const appScreen = document.getElementById('appScreen');
  
  if (authScreen && appScreen) {
    authScreen.style.display = 'flex';
    appScreen.style.display = 'none';
    AppState.currentScreen = 'auth';
  }
}

/**
 * Show app screen
 */
function showAppScreen() {
  const authScreen = document.getElementById('authScreen');
  const appScreen = document.getElementById('appScreen');
  
  if (authScreen && appScreen) {
    authScreen.style.display = 'none';
    appScreen.style.display = 'block';
    AppState.currentScreen = 'app';
  }
  
  // Update user info
  updateUserInfo();
  
  // Initialize app features
  initializeAppFeatures();
}

/**
 * Update user info display
 */
function updateUserInfo() {
  const user = AuthModule.getCurrentUser();
  
  if (!user) return;
  
  const userEmailElement = document.getElementById('userEmail');
  const greetingElement = document.getElementById('greeting');
  
  if (userEmailElement) {
    userEmailElement.textContent = user.email;
  }
  
  if (greetingElement) {
    const name = user.name || 'Agent';
    greetingElement.textContent = `Hey this is ${name}... how can I help you today?`;
  }
  
  AppState.user = user;
}

/**
 * Initialize app features after login
 */
function initializeAppFeatures() {
  // Populate workflow dropdowns
  populateMainGroups();
  
  // Update recently viewed
  if (ConfigUtils.isFeatureEnabled('ENABLE_RECENT_HISTORY')) {
    SearchModule.updateRecentlyViewedDisplay();
  }
}

// ==================== UI EVENT LISTENERS ====================

/**
 * Setup all UI event listeners
 */
function setupUIEventListeners() {
  // Login/OTP handlers
  setupAuthEventListeners();
  
  // Workflow dropdown handlers
  setupWorkflowDropdownListeners();
  
  // Calculator handlers (already handled in CalculatorsModule)
  
  // Search handlers (already handled in SearchModule)
  
  // Logout handler
  setupLogoutHandler();
}

/**
 * Setup authentication event listeners
 */
function setupAuthEventListeners() {
  // Send OTP button
  const sendOtpBtn = document.getElementById('sendOtpBtn');
  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', handleSendOTP);
  }
  
  // Verify OTP button
  const verifyOtpBtn = document.getElementById('verifyOtpBtn');
  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', handleVerifyOTP);
  }
  
  // Resend OTP link
  const resendOtpLink = document.getElementById('resendOtpLink');
  if (resendOtpLink) {
    resendOtpLink.addEventListener('click', handleResendOTP);
  }
  
  // OTP input navigation
  setupOTPInputs();
}

/**
 * Handle Send OTP
 */
function handleSendOTP() {
  const email = document.getElementById('emailInput').value.trim();
  const phone = document.getElementById('phoneInput').value.trim();
  const errorDiv = document.getElementById('loginError');
  const successDiv = document.getElementById('loginSuccess');
  
  // Clear previous messages
  if (errorDiv) errorDiv.style.display = 'none';
  if (successDiv) successDiv.style.display = 'none';
  
  // Initiate login
  const result = AuthModule.initiateLogin(email, phone);
  
  if (result.success) {
    // Show success message
    if (successDiv) {
      successDiv.textContent = result.message;
      successDiv.style.display = 'block';
    }
    
    // Show OTP in alert (for demo only - remove in production)
    alert(`OTP Generated: ${result.otp}\n(In production, this will be sent via email)`);
    
    // Switch to OTP form
    setTimeout(() => {
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('otpForm').style.display = 'block';
      
      // Focus first OTP input
      const firstOtpInput = document.querySelector('.otp-input');
      if (firstOtpInput) firstOtpInput.focus();
    }, 1000);
  } else {
    // Show error message
    if (errorDiv) {
      errorDiv.textContent = result.message;
      errorDiv.style.display = 'block';
    }
  }
}

/**
 * Handle Verify OTP
 */
function handleVerifyOTP() {
  const otpInputs = document.querySelectorAll('.otp-input');
  const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');
  const errorDiv = document.getElementById('otpError');
  const successDiv = document.getElementById('otpSuccess');
  
  // Clear previous messages
  if (errorDiv) errorDiv.style.display = 'none';
  if (successDiv) successDiv.style.display = 'none';
  
  // Verify OTP
  const result = AuthModule.completeLogin(enteredOTP);
  
  if (result.success) {
    // Show success message
    if (successDiv) {
      successDiv.textContent = result.message;
      successDiv.style.display = 'block';
    }
    
    // Switch to app screen
    setTimeout(() => {
      showAppScreen();
    }, 500);
  } else {
    // Show error message
    if (errorDiv) {
      errorDiv.textContent = result.message;
      errorDiv.style.display = 'block';
    }
    
    // Clear OTP inputs
    otpInputs.forEach(input => input.value = '');
    if (otpInputs[0]) otpInputs[0].focus();
  }
}

/**
 * Handle Resend OTP
 */
function handleResendOTP(e) {
  e.preventDefault();
  
  const result = AuthModule.resendOTP();
  const successDiv = document.getElementById('otpSuccess');
  
  if (result.success) {
    // Show success message
    if (successDiv) {
      successDiv.textContent = result.message;
      successDiv.style.display = 'block';
    }
    
    // Show OTP in alert (for demo only - remove in production)
    alert(`New OTP Generated: ${result.otp}`);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      if (successDiv) successDiv.style.display = 'none';
    }, 3000);
  }
}

/**
 * Setup OTP input navigation
 */
function setupOTPInputs() {
  const otpInputs = document.querySelectorAll('.otp-input');
  
  otpInputs.forEach((input, index) => {
    // Auto-focus next input
    input.addEventListener('input', function(e) {
      if (this.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });
    
    // Backspace handling
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Backspace' && this.value === '' && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });
}

/**
 * Setup logout handler
 */
function setupLogoutHandler() {
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

/**
 * Handle logout
 */
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    AuthModule.logout();
    
    // Clear forms
    const emailInput = document.getElementById('emailInput');
    const phoneInput = document.getElementById('phoneInput');
    const otpInputs = document.querySelectorAll('.otp-input');
    
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';
    otpInputs.forEach(input => input.value = '');
    
    // Clear workflow display
    WorkflowDisplayModule.clearWorkflowDisplay();
    
    // Reset dropdowns
    const mainGroupSelect = document.getElementById('mainGroup');
    const subGroupSelect = document.getElementById('subGroup');
    if (mainGroupSelect) mainGroupSelect.value = '';
    if (subGroupSelect) subGroupSelect.value = '';
    
    // Show auth screen
    document.getElementById('otpForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    showAuthScreen();
    
    AppState.user = null;
  }
}

// ==================== WORKFLOW DROPDOWNS ====================

/**
 * Setup workflow dropdown listeners
 */
function setupWorkflowDropdownListeners() {
  const mainGroupSelect = document.getElementById('mainGroup');
  const subGroupSelect = document.getElementById('subGroup');
  
  if (mainGroupSelect) {
    mainGroupSelect.addEventListener('change', handleMainGroupChange);
  }
  
  if (subGroupSelect) {
    subGroupSelect.addEventListener('change', handleSubGroupChange);
  }
}

/**
 * Populate main groups dropdown
 */
function populateMainGroups() {
  const mainGroupSelect = document.getElementById('mainGroup');
  
  if (!mainGroupSelect) return;
  
  mainGroupSelect.innerHTML = '<option value="">-- Select Main Group --</option>';
  
  const mainGroups = WorkflowDataModule.getAllMainGroups();
  
  mainGroups.forEach(mainGroup => {
    const option = document.createElement('option');
    option.value = mainGroup;
    option.textContent = mainGroup;
    mainGroupSelect.appendChild(option);
  });
  
  mainGroupSelect.style.display = 'inline-block';
}

/**
 * Handle main group change
 */
function handleMainGroupChange() {
  const mainGroupSelect = document.getElementById('mainGroup');
  const subGroupSelect = document.getElementById('subGroup');
  
  if (!mainGroupSelect || !subGroupSelect) return;
  
  const mainGroup = mainGroupSelect.value;
  
  // Clear previous content
  WorkflowDisplayModule.clearWorkflowDisplay();
  
  // Populate subgroups
  populateSubGroups(mainGroup);
}

/**
 * Populate subgroups dropdown
 */
function populateSubGroups(mainGroup) {
  const subGroupSelect = document.getElementById('subGroup');
  
  if (!subGroupSelect) return;
  
  subGroupSelect.innerHTML = '<option value="">-- Select Sub Group --</option>';
  
  if (!mainGroup) {
    subGroupSelect.style.display = 'none';
    return;
  }
  
  const subGroups = WorkflowDataModule.getSubGroups(mainGroup);
  
  subGroups.forEach(subGroup => {
    const option = document.createElement('option');
    option.value = subGroup;
    option.textContent = subGroup;
    subGroupSelect.appendChild(option);
  });
  
  subGroupSelect.style.display = 'inline-block';
}

/**
 * Handle subgroup change
 */
function handleSubGroupChange() {
  const mainGroupSelect = document.getElementById('mainGroup');
  const subGroupSelect = document.getElementById('subGroup');
  
  if (!mainGroupSelect || !subGroupSelect) return;
  
  const mainGroup = mainGroupSelect.value;
  const subGroup = subGroupSelect.value;
  
  if (!mainGroup || !subGroup) {
    WorkflowDisplayModule.clearWorkflowDisplay();
    return;
  }
  
  // Display workflow
  WorkflowDisplayModule.displayWorkflow(mainGroup, subGroup);
  
  // Add to recently viewed
  SearchModule.addToRecentlyViewed(mainGroup, subGroup);
}

/**
 * Setup workflow dropdowns (main initialization)
 */
function setupWorkflowDropdowns() {
  populateMainGroups();
}

// ==================== APP INFO ====================

/**
 * Display app information
 */
function displayAppInfo() {
  const appInfo = ConfigUtils.getAppInfo();
  console.log(`📱 ${appInfo.name} v${appInfo.version}`);
  console.log(`🔧 Enabled Features:`, appInfo.features);
}

// ==================== ERROR HANDLING ====================

/**
 * Global error handler
 */
window.addEventListener('error', function(event) {
  console.error('Global Error:', event.error);
  ConfigUtils.logUserAction('ERROR_OCCURRED', {
    message: event.error?.message,
    stack: event.error?.stack
  });
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled Promise Rejection:', event.reason);
  ConfigUtils.logUserAction('PROMISE_REJECTION', {
    reason: event.reason
  });
});

// ==================== PAGE LOAD ====================

/**
 * Initialize on DOM content loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM Content Loaded');
  
  // Small delay to ensure all scripts are loaded
  setTimeout(() => {
    initializeApplication();
  }, 100);
});

// ==================== EXPORT FOR DEBUGGING ====================

window.App = {
  state: () => ({ ...AppState }),
  initialize: initializeApplication,
  showAuthScreen,
  showAppScreen,
  getModulesStatus: () => AppState.modulesLoaded
};
