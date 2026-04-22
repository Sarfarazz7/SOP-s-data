// ==================== AUTHENTICATION MODULE ====================
// This file handles all authentication logic: login, OTP, session management

// ==================== STATE MANAGEMENT ====================
const AuthState = {
  currentUser: null,
  currentOTP: null,
  otpEmail: null,
  otpGeneratedTime: null,
  loginAttempts: 0,
  maxLoginAttempts: 5
};

// ==================== SESSION MANAGEMENT ====================

/**
 * Save user session to localStorage
 */
function saveSession(user) {
  try {
    const sessionData = {
      user: user,
      loginTime: Date.now(),
      expiresAt: Date.now() + AppConfig.AUTO_LOGOUT_TIME
    };
    
    localStorage.setItem(
      AppConfig.SESSION_STORAGE_KEY, 
      JSON.stringify(sessionData)
    );
    
    ConfigUtils.logUserAction('SESSION_SAVED', { userId: user.id, email: user.email });
    return true;
  } catch (error) {
    console.error('Failed to save session:', error);
    return false;
  }
}

/**
 * Load user session from localStorage
 */
function loadSession() {
  try {
    const sessionStr = localStorage.getItem(AppConfig.SESSION_STORAGE_KEY);
    
    if (!sessionStr) {
      return null;
    }
    
    const sessionData = JSON.parse(sessionStr);
    
    // Check if session is expired (if auto-logout is enabled)
    if (ConfigUtils.isFeatureEnabled('ENABLE_AUTO_LOGOUT')) {
      if (Date.now() > sessionData.expiresAt) {
        clearSession();
        console.log('Session expired');
        return null;
      }
    }
    
    ConfigUtils.logUserAction('SESSION_LOADED', { 
      userId: sessionData.user.id,
      email: sessionData.user.email 
    });
    
    return sessionData.user;
  } catch (error) {
    console.error('Failed to load session:', error);
    return null;
  }
}

/**
 * Clear user session from localStorage
 */
function clearSession() {
  try {
    localStorage.removeItem(AppConfig.SESSION_STORAGE_KEY);
    AuthState.currentUser = null;
    AuthState.currentOTP = null;
    AuthState.otpEmail = null;
    AuthState.otpGeneratedTime = null;
    
    ConfigUtils.logUserAction('SESSION_CLEARED');
    return true;
  } catch (error) {
    console.error('Failed to clear session:', error);
    return false;
  }
}

/**
 * Check if user session is valid
 */
function isSessionValid() {
  const user = loadSession();
  return user !== null;
}

/**
 * Get current logged-in user
 */
function getCurrentUser() {
  if (!AuthState.currentUser) {
    AuthState.currentUser = loadSession();
  }
  return AuthState.currentUser;
}

// ==================== OTP MANAGEMENT ====================

/**
 * Generate random OTP
 */
function generateOTP() {
  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  
  AuthState.currentOTP = otp;
  AuthState.otpGeneratedTime = Date.now();
  
  ConfigUtils.logUserAction('OTP_GENERATED', { email: AuthState.otpEmail });
  
  return otp;
}

/**
 * Verify if OTP is valid
 */
function verifyOTP(enteredOTP) {
  // Check if OTP exists
  if (!AuthState.currentOTP) {
    return { success: false, message: 'No OTP generated. Please request a new OTP.' };
  }
  
  // Check if OTP is expired
  const otpAge = Date.now() - AuthState.otpGeneratedTime;
  if (otpAge > AppConfig.OTP_EXPIRY_TIME) {
    AuthState.currentOTP = null;
    return { success: false, message: 'OTP expired. Please request a new OTP.' };
  }
  
  // Verify OTP match
  if (enteredOTP === AuthState.currentOTP) {
    ConfigUtils.logUserAction('OTP_VERIFIED_SUCCESS', { email: AuthState.otpEmail });
    return { success: true, message: 'OTP verified successfully!' };
  } else {
    AuthState.loginAttempts++;
    
    if (AuthState.loginAttempts >= AuthState.maxLoginAttempts) {
      AuthState.currentOTP = null;
      ConfigUtils.logUserAction('OTP_MAX_ATTEMPTS_REACHED', { email: AuthState.otpEmail });
      return { 
        success: false, 
        message: 'Maximum attempts reached. Please request a new OTP.' 
      };
    }
    
    ConfigUtils.logUserAction('OTP_VERIFIED_FAILED', { 
      email: AuthState.otpEmail,
      attempts: AuthState.loginAttempts 
    });
    
    return { 
      success: false, 
      message: `Invalid OTP. ${AuthState.maxLoginAttempts - AuthState.loginAttempts} attempts remaining.` 
    };
  }
}

/**
 * Resend OTP
 */
function resendOTP() {
  if (!AuthState.otpEmail) {
    return { success: false, message: 'No email registered for OTP.' };
  }
  
  const newOTP = generateOTP();
  AuthState.loginAttempts = 0; // Reset attempts on resend
  
  // In production, send email here
  console.log(`[RESEND OTP] New OTP for ${AuthState.otpEmail}: ${newOTP}`);
  
  ConfigUtils.logUserAction('OTP_RESENT', { email: AuthState.otpEmail });
  
  return { 
    success: true, 
    message: 'New OTP sent successfully!',
    otp: newOTP // Remove this in production
  };
}

/**
 * Clear OTP data
 */
function clearOTP() {
  AuthState.currentOTP = null;
  AuthState.otpEmail = null;
  AuthState.otpGeneratedTime = null;
  AuthState.loginAttempts = 0;
}

// ==================== LOGIN FLOW ====================

/**
 * Step 1: Validate credentials and send OTP
 */
function initiateLogin(email, phone) {
  // Validate input
  if (!email || !phone) {
    return { 
      success: false, 
      message: 'Please enter both email and phone number' 
    };
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { 
      success: false, 
      message: 'Please enter a valid email address' 
    };
  }
  
  // Validate phone format (Indian format)
  const phoneRegex = /^\+91\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return { 
      success: false, 
      message: 'Please enter a valid phone number (+91XXXXXXXXXX)' 
    };
  }
  
  // Check if user is authorized
  const user = ConfigUtils.validateUserCredentials(email, phone);
  
  if (!user) {
    ConfigUtils.logUserAction('LOGIN_FAILED_INVALID_CREDENTIALS', { email, phone });
    return { 
      success: false, 
      message: 'Invalid credentials. Access denied.' 
    };
  }
  
  // Generate and send OTP
  AuthState.otpEmail = email;
  const otp = generateOTP();
  
  // In production, send OTP via email service
  console.log(`[OTP GENERATED] OTP for ${email}: ${otp}`);
  
  ConfigUtils.logUserAction('LOGIN_INITIATED', { 
    email: user.email, 
    userId: user.id 
  });
  
  return { 
    success: true, 
    message: 'OTP sent to your email!',
    otp: otp, // Remove this in production
    user: user
  };
}

/**
 * Step 2: Verify OTP and complete login
 */
function completeLogin(enteredOTP) {
  const verificationResult = verifyOTP(enteredOTP);
  
  if (!verificationResult.success) {
    return verificationResult;
  }
  
  // Get user data
  const user = ConfigUtils.getUserByEmail(AuthState.otpEmail);
  
  if (!user) {
    return { 
      success: false, 
      message: 'User not found. Please try again.' 
    };
  }
  
  // Save session
  AuthState.currentUser = user;
  const sessionSaved = saveSession(user);
  
  if (!sessionSaved) {
    return { 
      success: false, 
      message: 'Failed to save session. Please try again.' 
    };
  }
  
  // Clear OTP data
  clearOTP();
  
  ConfigUtils.logUserAction('LOGIN_COMPLETED', { 
    email: user.email, 
    userId: user.id,
    name: user.name 
  });
  
  return { 
    success: true, 
    message: 'Login successful!',
    user: user
  };
}

/**
 * Logout user
 */
function logout() {
  const currentUser = getCurrentUser();
  
  if (currentUser) {
    ConfigUtils.logUserAction('LOGOUT', { 
      email: currentUser.email, 
      userId: currentUser.id 
    });
  }
  
  clearSession();
  clearOTP();
  
  return { 
    success: true, 
    message: 'Logged out successfully!' 
  };
}

// ==================== AUTO SESSION CHECK ====================

/**
 * Initialize session check on page load
 */
function initializeAuth() {
  const savedUser = loadSession();
  
  if (savedUser) {
    AuthState.currentUser = savedUser;
    ConfigUtils.logUserAction('AUTO_LOGIN', { 
      email: savedUser.email, 
      userId: savedUser.id 
    });
    return { 
      success: true, 
      user: savedUser,
      message: 'Session restored successfully!' 
    };
  }
  
  return { 
    success: false, 
    message: 'No active session found.' 
  };
}

/**
 * Setup auto-logout timer (if enabled)
 */
function setupAutoLogout() {
  if (!ConfigUtils.isFeatureEnabled('ENABLE_AUTO_LOGOUT')) {
    return;
  }
  
  // Check session expiry every minute
  setInterval(() => {
    const sessionData = localStorage.getItem(AppConfig.SESSION_STORAGE_KEY);
    
    if (sessionData) {
      const session = JSON.parse(sessionData);
      const timeRemaining = session.expiresAt - Date.now();
      
      // Show warning 5 minutes before expiry
      if (timeRemaining <= AppConfig.AUTO_LOGOUT_WARNING_TIME && timeRemaining > 0) {
        const minutesRemaining = Math.ceil(timeRemaining / 60000);
        console.warn(`Session expires in ${minutesRemaining} minutes`);
        // You can show a UI notification here
      }
      
      // Auto logout if expired
      if (timeRemaining <= 0) {
        logout();
        alert('Your session has expired. Please login again.');
        window.location.reload();
      }
    }
  }, 60000); // Check every minute
}

// ==================== EXPORT FOR USE IN OTHER FILES ====================

window.AuthModule = {
  // Session Management
  saveSession,
  loadSession,
  clearSession,
  isSessionValid,
  getCurrentUser,
  
  // OTP Management
  generateOTP,
  verifyOTP,
  resendOTP,
  clearOTP,
  
  // Login Flow
  initiateLogin,
  completeLogin,
  logout,
  
  // Initialization
  initializeAuth,
  setupAutoLogout,
  
  // State Access (read-only)
  getAuthState: () => ({ ...AuthState })
};

// Initialize auth on load
document.addEventListener('DOMContentLoaded', () => {
  setupAutoLogout();
});