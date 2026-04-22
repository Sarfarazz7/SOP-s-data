// ==================== CONFIGURATION FILE ====================
// This file contains all app configuration and constants

const CONFIG = {
  // App Information
  APP_NAME: "Amastor Workflow Assistant",
  VERSION: "2.0.0",
  
  // Session Configuration
  SESSION_STORAGE_KEY: "amastor_user",
  SESSION_TIME_KEY: "amastor_login_time",
  
  // OTP Configuration
  OTP_LENGTH: 6,
  OTP_EXPIRY_TIME: 300000, // 5 minutes in milliseconds
  OTP_RESEND_DELAY: 30000, // 30 seconds
  
  // Search Configuration
  MIN_SEARCH_LENGTH: 2,
  MAX_RECENT_ITEMS: 5,
  
  // Email Configuration
  DEFAULT_EMAIL_DOMAINS: {
    HUB: "hub@licious.com",
    TECHNICAL: "technical@licious.com",
    TALK_TO_US: "talktous@licious.com",
    TL_CHC: "tlchc@licious.com",
    SME: "sme@licious.com",
    CITY_QUALITY: "city-quality@licious.com"
  },
  
  // Refund Configuration
  REFUND_TIMELINES: {
    SOURCE_ACCOUNT: "3-5 working days",
    LICIOUS_CASH: "24 hours",
    AUTO_GRAMMAGE_REFUND: "24 hours after delivery"
  },
  
  // Delivery Configuration
  DEFAULT_TAT: 30, // Default TAT in minutes
  SLA_THRESHOLD: 15, // Minutes before SLA breach
  
  // Calculator Configuration
  EGG_PACKAGES: [6, 12, 30],
  
  // UI Configuration
  THEME_COLORS: {
    PRIMARY: "#4a90e2",
    SUCCESS: "#27ae60",
    DANGER: "#e74c3c",
    WARNING: "#f39c12",
    INFO: "#3498db"
  },
  
  // Keyboard Shortcuts
  SHORTCUTS: {
    SEARCH_FOCUS: "k", // Ctrl/Cmd + K
    CLEAR_SEARCH: "Escape"
  },
  
  // Feature Flags
  FEATURES: {
    ENABLE_SEARCH: true,
    ENABLE_RECENT_HISTORY: true,
    ENABLE_CALCULATORS: true,
    ENABLE_KEYBOARD_SHORTCUTS: true,
    ENABLE_AUTO_LOGOUT: false // Set to true if you want session timeout
  },
  
  // Auto Logout Configuration (if enabled)
  AUTO_LOGOUT_TIME: 3600000, // 1 hour in milliseconds
  AUTO_LOGOUT_WARNING_TIME: 300000 // Show warning 5 minutes before logout
};

// ==================== AUTHORIZED USERS ====================
const AUTHORIZED_USERS = [
  { 
    email: "sarfaraz@licious.com", 
    phone: "+919876543210", 
    name: "Sarfaraz",
    role: "CHC Agent",
    id: "usr001"
  },
  { 
    email: "saumya@licious.com", 
    phone: "+917999581257", 
    name: "Saumya",
    role: "CHC Agent",
    id: "usr002"
  },
  { 
    email: "jubiya@licious.com", 
    phone: "+919876543212", 
    name: "Jubiya",
    role: "CHC Agent",
    id: "usr003"
  },
  { 
    email: "asfiya@licious.com", 
    phone: "+919876543213", 
    name: "Asfiya",
    role: "CHC Agent",
    id: "usr004"
  },
  { 
    email: "aisha@licious.com", 
    phone: "+919876543214", 
    name: "Aisha",
    role: "CHC Agent",
    id: "usr005"
  },
  { 
    email: "abhi@licious.com", 
    phone: "+919876543215", 
    name: "Abhi",
    role: "CHC Agent",
    id: "usr006"
  }
];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get configuration value by key path
 * Example: getConfig('EMAIL_DOMAINS.HUB') returns 'hub@licious.com'
 */
function getConfig(keyPath) {
  const keys = keyPath.split('.');
  let value = CONFIG;
  
  for (const key of keys) {
    if (value[key] === undefined) {
      console.warn(`Config key not found: ${keyPath}`);
      return null;
    }
    value = value[key];
  }
  
  return value;
}

/**
 * Check if a feature is enabled
 */
function isFeatureEnabled(featureName) {
  return CONFIG.FEATURES[featureName] === true;
}

/**
 * Get user by email
 */
function getUserByEmail(email) {
  return AUTHORIZED_USERS.find(
    user => user.email.toLowerCase() === email.toLowerCase()
  );
}

/**
 * Get user by phone
 */
function getUserByPhone(phone) {
  return AUTHORIZED_USERS.find(user => user.phone === phone);
}

/**
 * Validate user credentials
 */
function validateUserCredentials(email, phone) {
  return AUTHORIZED_USERS.find(
    user => 
      user.email.toLowerCase() === email.toLowerCase() && 
      user.phone === phone
  );
}

/**
 * Get all users (useful for admin features)
 */
function getAllUsers() {
  return [...AUTHORIZED_USERS];
}

/**
 * Format email template with variables
 */
function formatEmailTemplate(template, variables = {}) {
  let formatted = template;
  
  // Replace common placeholders
  const replacements = {
    '[SHIPMENT_ID]': variables.shipmentId || '[SHIPMENT_ID]',
    '[CUSTOMER_NUMBER]': variables.customerNumber || '[CUSTOMER_NUMBER]',
    '[CUSTOMER_NAME]': variables.customerName || '[CUSTOMER_NAME]',
    '[PHONE]': variables.phone || '[PHONE]',
    '[PRODUCT_LIST]': variables.productList || '[PRODUCT_LIST]',
    '[CORRECT_PRODUCT]': variables.correctProduct || '[CORRECT_PRODUCT]',
    '[WRONG_PRODUCT]': variables.wrongProduct || '[WRONG_PRODUCT]',
    '[LANDMARK]': variables.landmark || '[LANDMARK]'
  };
  
  Object.keys(replacements).forEach(key => {
    formatted = formatted.replace(new RegExp(key, 'g'), replacements[key]);
  });
  
  return formatted;
}

/**
 * Log user action (useful for analytics)
 */
function logUserAction(action, details = {}) {
  if (CONFIG.FEATURES.ENABLE_ANALYTICS) {
    console.log('[USER ACTION]', {
      timestamp: new Date().toISOString(),
      action: action,
      details: details
    });
  }
}

/**
 * Get app version info
 */
function getAppInfo() {
  return {
    name: CONFIG.APP_NAME,
    version: CONFIG.VERSION,
    features: Object.keys(CONFIG.FEATURES).filter(
      key => CONFIG.FEATURES[key]
    )
  };
}

// ==================== EXPORT FOR USE IN OTHER FILES ====================
// If using ES6 modules (with type="module"), uncomment these:
// export { CONFIG, AUTHORIZED_USERS, getConfig, isFeatureEnabled, 
//          validateUserCredentials, formatEmailTemplate, logUserAction };

// For non-module usage, these are available globally via window object
window.AppConfig = CONFIG;
window.AuthorizedUsers = AUTHORIZED_USERS;
window.ConfigUtils = {
  getConfig,
  isFeatureEnabled,
  getUserByEmail,
  getUserByPhone,
  validateUserCredentials,
  getAllUsers,
  formatEmailTemplate,
  logUserAction,
  getAppInfo
};