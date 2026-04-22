// ==================== CALCULATORS MODULE ====================
// This file handles Egg Damage Calculator and Refund Calculator

// ==================== STATE MANAGEMENT ====================
const CalculatorState = {
  lastEggCalculation: null,
  lastRefundCalculation: null,
  calculationHistory: []
};

// ==================== EGG DAMAGE CALCULATOR ====================

/**
 * Calculate refund for damaged eggs
 * @param {number} orderValue - Total order value
 * @param {number} packageSize - Egg package size (6, 12, or 30)
 * @param {number} damagedEggs - Number of damaged eggs
 * @returns {object} Calculation result with refund amount and details
 */
function calculateEggDamageRefund(orderValue, packageSize, damagedEggs) {
  // Validation
  const validation = validateEggInputs(orderValue, packageSize, damagedEggs);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
      refundAmount: 0
    };
  }
  
  let refundAmount = 0;
  let refundLogic = '';
  
  // Calculate refund based on package size and damaged eggs
  if (packageSize === 6) {
    // For 6 eggs: If 1 or more damaged = full refund
    if (damagedEggs >= 1) {
      refundAmount = orderValue;
      refundLogic = '6-egg pack: 1+ damaged = Full refund';
    }
  } 
  else if (packageSize === 12) {
    // For 12 eggs: Less than 6 damaged = 50% refund, 6+ damaged = full refund
    if (damagedEggs < 6) {
      refundAmount = orderValue / 2;
      refundLogic = '12-egg pack: <6 damaged = 50% refund';
    } else {
      refundAmount = orderValue;
      refundLogic = '12-egg pack: 6+ damaged = Full refund';
    }
  } 
  else if (packageSize === 30) {
    // For 30 eggs: Tiered refund system
    if (damagedEggs < 6) {
      refundAmount = (orderValue / 30) * 6;
      refundLogic = '30-egg pack: <6 damaged = 6 eggs worth';
    } else if (damagedEggs < 12) {
      refundAmount = (orderValue / 30) * 12;
      refundLogic = '30-egg pack: 6-11 damaged = 12 eggs worth';
    } else if (damagedEggs < 18) {
      refundAmount = (orderValue / 30) * 18;
      refundLogic = '30-egg pack: 12-17 damaged = 18 eggs worth';
    } else if (damagedEggs < 24) {
      refundAmount = (orderValue / 30) * 24;
      refundLogic = '30-egg pack: 18-23 damaged = 24 eggs worth';
    } else {
      refundAmount = orderValue;
      refundLogic = '30-egg pack: 24+ damaged = Full refund';
    }
  }
  
  // Ensure refund doesn't exceed order value
  refundAmount = Math.min(refundAmount, orderValue);
  
  const result = {
    success: true,
    refundAmount: parseFloat(refundAmount.toFixed(2)),
    orderValue: orderValue,
    packageSize: packageSize,
    damagedEggs: damagedEggs,
    refundPercentage: ((refundAmount / orderValue) * 100).toFixed(1),
    refundLogic: refundLogic,
    timestamp: Date.now()
  };
  
  // Save to state
  CalculatorState.lastEggCalculation = result;
  addToCalculationHistory('egg_damage', result);
  
  // Log action
  ConfigUtils.logUserAction('EGG_DAMAGE_CALCULATED', {
    packageSize,
    damagedEggs,
    refundAmount
  });
  
  return result;
}

/**
 * Validate egg damage calculator inputs
 */
function validateEggInputs(orderValue, packageSize, damagedEggs) {
  if (isNaN(orderValue) || orderValue <= 0) {
    return {
      valid: false,
      error: '⚠️ Please enter a valid order value (must be greater than 0)'
    };
  }
  
  if (!AppConfig.EGG_PACKAGES.includes(packageSize)) {
    return {
      valid: false,
      error: `⚠️ Invalid package size. Must be 6, 12, or 30`
    };
  }
  
  if (isNaN(damagedEggs) || damagedEggs < 0) {
    return {
      valid: false,
      error: '⚠️ Please enter a valid number of damaged eggs (0 or more)'
    };
  }
  
  if (damagedEggs > packageSize) {
    return {
      valid: false,
      error: `⚠️ Damaged eggs (${damagedEggs}) cannot exceed package size (${packageSize})`
    };
  }
  
  return { valid: true };
}

/**
 * Display egg damage calculation result
 */
function displayEggCalculationResult(result, targetElementId = 'calc-result') {
  const resultDiv = document.getElementById(targetElementId);
  
  if (!resultDiv) {
    console.error('Result display element not found');
    return;
  }
  
  if (!result.success) {
    resultDiv.innerHTML = `<span style="color: #e74c3c;">${result.error}</span>`;
    return;
  }
  
  resultDiv.innerHTML = `
    <div style="color: #27ae60; background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #27ae60;">
      <strong>✅ Refund Calculated</strong><br><br>
      <div style="margin: 10px 0;">
        <strong>Package:</strong> ${result.packageSize} Eggs<br>
        <strong>Order Value:</strong> ₹${result.orderValue.toFixed(2)}<br>
        <strong>Damaged Eggs:</strong> ${result.damagedEggs}<br>
        <strong>Logic:</strong> ${result.refundLogic}<br><br>
        <div style="font-size: 18px; color: #e74c3c; font-weight: bold;">
          💰 Refund Amount: ₹${result.refundAmount.toFixed(2)}
        </div>
        <div style="font-size: 14px; color: #7f8c8d; margin-top: 5px;">
          (${result.refundPercentage}% of order value)
        </div>
      </div>
    </div>
  `;
}

// ==================== REFUND CALCULATOR ====================

/**
 * Calculate refund amount
 * @param {number} orderValue - Total order value
 * @param {string} refundType - 'full' or 'partial'
 * @param {number} percentage - Percentage for partial refund (0-100)
 * @returns {object} Calculation result with refund amount and details
 */
function calculateRefund(orderValue, refundType, percentage = 100) {
  // Validation
  const validation = validateRefundInputs(orderValue, refundType, percentage);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
      refundAmount: 0
    };
  }
  
  let refundAmount = 0;
  let actualPercentage = 0;
  
  if (refundType === 'full') {
    refundAmount = orderValue;
    actualPercentage = 100;
  } else {
    refundAmount = (orderValue * percentage) / 100;
    actualPercentage = percentage;
  }
  
  const result = {
    success: true,
    refundAmount: parseFloat(refundAmount.toFixed(2)),
    orderValue: orderValue,
    refundType: refundType,
    percentage: actualPercentage,
    refundTimeline: refundType === 'full' 
      ? AppConfig.REFUND_TIMELINES.SOURCE_ACCOUNT
      : AppConfig.REFUND_TIMELINES.SOURCE_ACCOUNT,
    timestamp: Date.now()
  };
  
  // Save to state
  CalculatorState.lastRefundCalculation = result;
  addToCalculationHistory('refund', result);
  
  // Log action
  ConfigUtils.logUserAction('REFUND_CALCULATED', {
    refundType,
    percentage: actualPercentage,
    refundAmount
  });
  
  return result;
}

/**
 * Validate refund calculator inputs
 */
function validateRefundInputs(orderValue, refundType, percentage) {
  if (isNaN(orderValue) || orderValue <= 0) {
    return {
      valid: false,
      error: '⚠️ Please enter a valid order value (must be greater than 0)'
    };
  }
  
  if (refundType !== 'full' && refundType !== 'partial') {
    return {
      valid: false,
      error: '⚠️ Invalid refund type. Must be "full" or "partial"'
    };
  }
  
  if (refundType === 'partial') {
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      return {
        valid: false,
        error: '⚠️ Please enter a valid percentage (0-100)'
      };
    }
  }
  
  return { valid: true };
}

/**
 * Display refund calculation result
 */
function displayRefundCalculationResult(result, targetElementId = 'refund-result') {
  const resultDiv = document.getElementById(targetElementId);
  
  if (!resultDiv) {
    console.error('Result display element not found');
    return;
  }
  
  if (!result.success) {
    resultDiv.innerHTML = `<span style="color: #e74c3c;">${result.error}</span>`;
    return;
  }
  
  resultDiv.innerHTML = `
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #4a90e2;">
      <strong>✅ Refund Calculated</strong><br><br>
      <div style="margin: 10px 0;">
        <strong>Order Value:</strong> ₹${result.orderValue.toFixed(2)}<br>
        <strong>Refund Type:</strong> ${result.refundType === 'full' ? 'Full Refund' : `Partial (${result.percentage}%)`}<br>
        <strong>Timeline:</strong> ${result.refundTimeline}<br><br>
        <div style="font-size: 18px; color: #27ae60; font-weight: bold;">
          💰 Refund Amount: ₹${result.refundAmount.toFixed(2)}
        </div>
      </div>
    </div>
  `;
}

// ==================== GRAMMAGE CALCULATOR ====================

/**
 * Calculate grammage difference refund
 * @param {number} expectedGrammage - Expected grammage in grams
 * @param {number} receivedGrammage - Received grammage in grams
 * @param {number} pricePerKg - Price per kg
 * @returns {object} Calculation result
 */
function calculateGrammageRefund(expectedGrammage, receivedGrammage, pricePerKg) {
  if (receivedGrammage >= expectedGrammage) {
    return {
      success: true,
      refundAmount: 0,
      message: 'No refund needed - received grammage is equal or more than expected',
      difference: receivedGrammage - expectedGrammage
    };
  }
  
  const difference = expectedGrammage - receivedGrammage;
  const refundAmount = (difference / 1000) * pricePerKg;
  
  return {
    success: true,
    refundAmount: parseFloat(refundAmount.toFixed(2)),
    expectedGrammage,
    receivedGrammage,
    difference,
    pricePerKg,
    message: `Less grammage detected. Auto-refund to Licious Cash within 24 hours.`
  };
}

// ==================== CALCULATION HISTORY ====================

/**
 * Add calculation to history
 */
function addToCalculationHistory(type, data) {
  const historyItem = {
    type: type,
    data: data,
    timestamp: Date.now(),
    user: AuthModule.getCurrentUser()?.email || 'Unknown'
  };
  
  CalculatorState.calculationHistory.unshift(historyItem);
  
  // Keep only last 50 calculations
  if (CalculatorState.calculationHistory.length > 50) {
    CalculatorState.calculationHistory = CalculatorState.calculationHistory.slice(0, 50);
  }
}

/**
 * Get calculation history
 */
function getCalculationHistory(type = null, limit = 10) {
  let history = [...CalculatorState.calculationHistory];
  
  if (type) {
    history = history.filter(item => item.type === type);
  }
  
  return history.slice(0, limit);
}

/**
 * Clear calculation history
 */
function clearCalculationHistory() {
  CalculatorState.calculationHistory = [];
}

/**
 * Export calculation history as CSV
 */
function exportCalculationHistory() {
  const history = CalculatorState.calculationHistory;
  
  if (history.length === 0) {
    alert('No calculation history to export');
    return;
  }
  
  let csv = 'Type,Timestamp,User,Details,Refund Amount\n';
  
  history.forEach(item => {
    const date = new Date(item.timestamp).toLocaleString();
    const details = JSON.stringify(item.data).replace(/,/g, ';');
    const refund = item.data.refundAmount || 0;
    
    csv += `${item.type},${date},${item.user},"${details}",${refund}\n`;
  });
  
  // Create download link
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `calculation_history_${Date.now()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
  
  ConfigUtils.logUserAction('HISTORY_EXPORTED', { count: history.length });
}

// ==================== UI HELPER FUNCTIONS ====================

/**
 * Setup egg damage calculator UI
 */
function setupEggDamageCalculator(calculateBtnId = 'calculateBtn', resultDivId = 'calc-result') {
  const calculateBtn = document.getElementById(calculateBtnId);
  
  if (!calculateBtn) {
    console.error('Calculate button not found');
    return;
  }
  
  calculateBtn.addEventListener('click', function() {
    const orderValue = parseFloat(document.getElementById('orderValue').value);
    const packageOption = parseInt(document.getElementById('packageOption').value);
    const damagedEggs = parseInt(document.getElementById('damagedEggs').value);
    
    const result = calculateEggDamageRefund(orderValue, packageOption, damagedEggs);
    displayEggCalculationResult(result, resultDivId);
  });
}

/**
 * Setup refund calculator UI
 */
function setupRefundCalculator(calculateBtnId = 'calculateRefundBtn', resultDivId = 'refund-result') {
  const calculateBtn = document.getElementById(calculateBtnId);
  
  if (!calculateBtn) {
    console.error('Calculate refund button not found');
    return;
  }
  
  calculateBtn.addEventListener('click', function() {
    const orderValue = parseFloat(document.getElementById('refundOrderValue').value);
    const refundType = document.getElementById('refundType').value;
    const percentage = refundType === 'partial' 
      ? parseFloat(document.getElementById('refundPercentage').value)
      : 100;
    
    const result = calculateRefund(orderValue, refundType, percentage);
    displayRefundCalculationResult(result, resultDivId);
  });
  
  // Handle refund type change
  const refundTypeSelect = document.getElementById('refundType');
  if (refundTypeSelect) {
    refundTypeSelect.addEventListener('change', function() {
      const partialSection = document.getElementById('partialSection');
      if (partialSection) {
        partialSection.style.display = this.value === 'partial' ? 'block' : 'none';
      }
    });
  }
}

/**
 * Initialize all calculators
 */
function initializeCalculators() {
  if (ConfigUtils.isFeatureEnabled('ENABLE_CALCULATORS')) {
    setupEggDamageCalculator();
    setupRefundCalculator();
    
    ConfigUtils.logUserAction('CALCULATORS_INITIALIZED');
    return true;
  }
  
  return false;
}

// ==================== EXPORT FOR USE IN OTHER FILES ====================

window.CalculatorsModule = {
  // Egg Damage Calculator
  calculateEggDamageRefund,
  displayEggCalculationResult,
  
  // Refund Calculator
  calculateRefund,
  displayRefundCalculationResult,
  
  // Grammage Calculator
  calculateGrammageRefund,
  
  // History Management
  getCalculationHistory,
  clearCalculationHistory,
  exportCalculationHistory,
  
  // UI Setup
  setupEggDamageCalculator,
  setupRefundCalculator,
  initializeCalculators,
  
  // State Access (read-only)
  getState: () => ({ ...CalculatorState })
};