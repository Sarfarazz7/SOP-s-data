// ==================== WORKFLOW DISPLAY MODULE ====================
// This file handles displaying workflows, scripts, emails, and conditional options

// ==================== STATE MANAGEMENT ====================
const WorkflowState = {
  currentMainGroup: null,
  currentSubGroup: null,
  currentWorkflow: null,
  selectedOptions: [],
  workflowHistory: []
};

// ==================== DOM ELEMENT REFERENCES ====================
let workflowOutputDiv = null;
let conditionalOptionsDiv = null;
let instructionDiv = null;

/**
 * Initialize workflow module with DOM elements
 */
function initializeWorkflowModule() {
  workflowOutputDiv = document.getElementById('workflowOutput');
  conditionalOptionsDiv = document.getElementById('conditionalOptions');
  instructionDiv = document.getElementById('instruction');
  
  if (!workflowOutputDiv || !conditionalOptionsDiv || !instructionDiv) {
    console.error('Required DOM elements not found for workflow module');
    return false;
  }
  
  return true;
}

// ==================== MAIN WORKFLOW DISPLAY ====================

/**
 * Display complete workflow for a subgroup
 */
function displayWorkflow(mainGroup, subGroup) {
  if (!workflowOutputDiv) {
    console.error('Workflow module not initialized');
    return;
  }
  
  // Clear previous content
  clearWorkflowDisplay();
  
  // Update state
  WorkflowState.currentMainGroup = mainGroup;
  WorkflowState.currentSubGroup = subGroup;
  WorkflowState.selectedOptions = [];
  
  // Get workflow data
  const workflow = WorkflowDataModule.getWorkflowData(mainGroup, subGroup);
  
  if (!workflow) {
    instructionDiv.innerHTML = '<p style="color: #e74c3c;">Workflow not found.</p>';
    return;
  }
  
  WorkflowState.currentWorkflow = workflow;
  
  // Add to history
  addToWorkflowHistory(mainGroup, subGroup);
  
  // Check if workflow is plain text (old format)
  if (typeof workflow === 'string') {
    displayPlainTextWorkflow(workflow);
    return;
  }
  
  // Display structured workflow
  displayStructuredWorkflow(workflow);
  
  // Log action
  ConfigUtils.logUserAction('WORKFLOW_VIEWED', { mainGroup, subGroup });
}

/**
 * Display plain text workflow (backward compatibility)
 */
function displayPlainTextWorkflow(text) {
  instructionDiv.innerHTML = text
    .replace(/\[li\]/g, '<span class="li-factor">[li factor]</span>')
    .replace(/\[ssi\]/g, '<span class="customer-factor">[customer factor]</span>')
    .replace(/\n/g, '<br>');
}

/**
 * Display structured workflow with all components
 */
function displayStructuredWorkflow(workflow) {
  // Check if workflow has ONLY options (no script/workflow at top level)
  if (workflow.options && !workflow.script && !workflow.workflow) {
    displayOnlyOptions(workflow.options);
    return;
  }
  
  // Display script section
  if (workflow.script) {
    displayScriptSection(workflow.script);
  }
  
  // Display workflow steps
  if (workflow.workflow) {
    displayWorkflowSteps(workflow.workflow);
  }
  
  // Display conditional options
  if (workflow.options) {
    displayOptionsDropdown(workflow.options, 'main');
  }
  
  // Display email template
  if (workflow.email) {
    displayEmailTemplate(workflow.email);
  }
  
  // Display notes
  if (workflow.notes) {
    displayNotes(workflow.notes);
  }
  
  // Display tagging
  if (workflow.tagging) {
    displayTagging(workflow.tagging);
  }
}

// ==================== INDIVIDUAL COMPONENT DISPLAYS ====================

/**
 * Display customer script section
 */
function displayScriptSection(script) {
  const scriptSection = document.createElement('div');
  scriptSection.className = 'workflow-section';
  scriptSection.innerHTML = `
    <h3>📞 Customer Script</h3>
    <p class="script-text">${script}</p>
    <button class="copy-btn" onclick="WorkflowDisplayModule.copyToClipboard('${escapeQuotes(script)}')">
      📋 Copy Script
    </button>
  `;
  workflowOutputDiv.appendChild(scriptSection);
}

/**
 * Display workflow action steps
 */
function displayWorkflowSteps(steps) {
  const workflowSection = document.createElement('div');
  workflowSection.className = 'action-workflow';
  workflowSection.innerHTML = `
    <h3>⚙️ Action Workflow</h3>
    <ul>
      ${steps.map(step => `<li>${step}</li>`).join('')}
    </ul>
  `;
  workflowOutputDiv.appendChild(workflowSection);
}

/**
 * Display only options dropdown (when no script/workflow at top level)
 */
function displayOnlyOptions(options) {
  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'conditional-dropdown';
  optionsDiv.innerHTML = '<h3>🔀 Please Select Scenario:</h3>';
  
  const select = createOptionsDropdown(options, 'main');
  optionsDiv.appendChild(select);
  
  workflowOutputDiv.appendChild(optionsDiv);
}

/**
 * Display conditional options dropdown
 */
function displayOptionsDropdown(options, level = 'main') {
  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'conditional-dropdown';
  
  const title = level === 'main' 
    ? '🔀 Select Customer Response:' 
    : '🔀 Select Next Action:';
  
  optionsDiv.innerHTML = `<h3>${title}</h3>`;
  
  const select = createOptionsDropdown(options, level);
  optionsDiv.appendChild(select);
  
  workflowOutputDiv.appendChild(optionsDiv);
}

/**
 * Create options dropdown element
 */
function createOptionsDropdown(options, level) {
  const select = document.createElement('select');
  select.className = 'sidebar-input';
  select.innerHTML = '<option value="">-- Choose Option --</option>';
  
  Object.keys(options).forEach(optionKey => {
    const option = document.createElement('option');
    option.value = optionKey;
    option.textContent = optionKey;
    select.appendChild(option);
  });
  
  select.addEventListener('change', function() {
    const selectedOption = options[this.value];
    if (selectedOption) {
      displayConditionalWorkflow(selectedOption, this.value, level);
      WorkflowState.selectedOptions.push(this.value);
      
      ConfigUtils.logUserAction('OPTION_SELECTED', {
        mainGroup: WorkflowState.currentMainGroup,
        subGroup: WorkflowState.currentSubGroup,
        option: this.value,
        level: level
      });
    }
  });
  
  return select;
}

/**
 * Display conditional workflow based on selected option
 */
function displayConditionalWorkflow(workflow, optionName, level) {
  // Remove existing conditional workflow at this level
  const existingId = level === 'main' ? 'conditionalWorkflow' : 'nestedWorkflow';
  const existing = document.getElementById(existingId);
  if (existing) {
    existing.remove();
  }
  
  const conditionalDiv = document.createElement('div');
  conditionalDiv.id = existingId;
  conditionalDiv.className = 'workflow-section';
  
  // Style based on level
  if (level === 'main') {
    conditionalDiv.style.background = '#e8f5e9';
    conditionalDiv.style.borderLeft = '4px solid #4caf50';
  } else {
    conditionalDiv.style.background = '#e3f2fd';
    conditionalDiv.style.borderLeft = '4px solid #2196f3';
    conditionalDiv.style.marginTop = '15px';
  }
  
  conditionalDiv.innerHTML = `<h3>✅ ${optionName}</h3>`;
  
  // Display script
  if (workflow.script) {
    const scriptHTML = `
      <p><strong>Script:</strong> ${workflow.script}</p>
      <button class="copy-btn" onclick="WorkflowDisplayModule.copyToClipboard('${escapeQuotes(workflow.script)}')">
        📋 Copy Script
      </button>
    `;
    conditionalDiv.innerHTML += scriptHTML;
  }
  
  // Display workflow steps
  if (workflow.workflow) {
    const workflowHTML = `
      <div class="action-workflow">
        <h4>Workflow:</h4>
        <ul>
          ${workflow.workflow.map(step => `<li>${step}</li>`).join('')}
        </ul>
      </div>
    `;
    conditionalDiv.innerHTML += workflowHTML;
  }
  
  // Display nested options
  if (workflow.options) {
    const nestedOptionsDiv = document.createElement('div');
    nestedOptionsDiv.style.marginTop = '15px';
    nestedOptionsDiv.innerHTML = '<h4>🔀 Select Next Action:</h4>';
    
    const nestedSelect = createOptionsDropdown(workflow.options, 'nested');
    nestedOptionsDiv.appendChild(nestedSelect);
    conditionalDiv.appendChild(nestedOptionsDiv);
  }
  
  // Display email
  if (workflow.email) {
    const emailSection = createEmailSection(workflow.email);
    conditionalDiv.appendChild(emailSection);
  }
  
  // Display notes
  if (workflow.notes) {
    const notesHTML = `
      <div style="background: #fff3e0; padding: 10px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #ff9800;">
        <strong>📝 Notes:</strong> ${workflow.notes}
      </div>
    `;
    conditionalDiv.innerHTML += notesHTML;
  }
  
  // Display tagging
  if (workflow.tagging) {
    const taggingHTML = `
      <div class="tagging-info">
        <strong>🏷️ Tagging:</strong> ${workflow.tagging}
      </div>
    `;
    conditionalDiv.innerHTML += taggingHTML;
  }
  
  workflowOutputDiv.appendChild(conditionalDiv);
}

/**
 * Display email template
 */
function displayEmailTemplate(email) {
  const emailSection = createEmailSection(email);
  workflowOutputDiv.appendChild(emailSection);
}

/**
 * Create email section element
 */
function createEmailSection(email) {
  const emailSection = document.createElement('div');
  emailSection.className = 'workflow-section email-section';
  
  let emailHTML = '<h3>📧 Email Template</h3>';
  emailHTML += '<div class="email-template">';
  emailHTML += `<strong>Subject:</strong> ${email.subject}\n\n`;
  emailHTML += `<strong>To:</strong> ${email.to}\n`;
  
  if (email.cc) {
    emailHTML += `<strong>CC:</strong> ${email.cc}\n`;
  }
  
  emailHTML += `\n${email.body}`;
  emailHTML += '</div>';
  
  const emailText = formatEmailForCopy(email);
  emailHTML += `
    <button class="copy-btn" onclick="WorkflowDisplayModule.copyToClipboard(\`${escapeBackticks(emailText)}\`)">
      📧 Copy Email
    </button>
  `;
  
  emailSection.innerHTML = emailHTML;
  return emailSection;
}

/**
 * Display notes section
 */
function displayNotes(notes) {
  const notesSection = document.createElement('div');
  notesSection.className = 'workflow-section';
  notesSection.style.background = '#fff3e0';
  notesSection.style.borderLeft = '4px solid #ff9800';
  notesSection.innerHTML = `<strong>📝 Notes:</strong> ${notes}`;
  workflowOutputDiv.appendChild(notesSection);
}

/**
 * Display tagging information
 */
function displayTagging(tagging) {
  const taggingSection = document.createElement('div');
  taggingSection.className = 'tagging-info';
  taggingSection.innerHTML = `<strong>🏷️ Tagging:</strong> ${tagging}`;
  workflowOutputDiv.appendChild(taggingSection);
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    showCopyNotification('✅ Copied to clipboard!');
    
    ConfigUtils.logUserAction('TEXT_COPIED', {
      mainGroup: WorkflowState.currentMainGroup,
      subGroup: WorkflowState.currentSubGroup,
      textLength: text.length
    });
  } catch (err) {
    console.error('Failed to copy:', err);
    showCopyNotification('❌ Failed to copy', true);
  }
  
  document.body.removeChild(textarea);
}

/**
 * Show copy notification
 */
function showCopyNotification(message, isError = false) {
  // Remove existing notification
  const existing = document.getElementById('copyNotification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.id = 'copyNotification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${isError ? '#e74c3c' : '#27ae60'};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

/**
 * Format email for copying
 */
function formatEmailForCopy(email) {
  let text = `Subject: ${email.subject}\n`;
  text += `To: ${email.to}\n`;
  if (email.cc) {
    text += `CC: ${email.cc}\n`;
  }
  text += `\n${email.body}`;
  return text;
}

/**
 * Escape quotes for HTML attributes
 */
function escapeQuotes(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

/**
 * Escape backticks for template literals
 */
function escapeBackticks(text) {
  return text.replace(/`/g, '\\`');
}

/**
 * Clear all workflow displays
 */
function clearWorkflowDisplay() {
  if (workflowOutputDiv) workflowOutputDiv.innerHTML = '';
  if (conditionalOptionsDiv) conditionalOptionsDiv.innerHTML = '';
  if (instructionDiv) instructionDiv.innerHTML = '';
  
  WorkflowState.selectedOptions = [];
}

// ==================== WORKFLOW HISTORY ====================

/**
 * Add workflow to history
 */
function addToWorkflowHistory(mainGroup, subGroup) {
  const historyItem = {
    mainGroup,
    subGroup,
    timestamp: Date.now()
  };
  
  // Remove duplicates
  WorkflowState.workflowHistory = WorkflowState.workflowHistory.filter(
    item => !(item.mainGroup === mainGroup && item.subGroup === subGroup)
  );
  
  // Add to beginning
  WorkflowState.workflowHistory.unshift(historyItem);
  
  // Keep only last 10 items
  if (WorkflowState.workflowHistory.length > 10) {
    WorkflowState.workflowHistory = WorkflowState.workflowHistory.slice(0, 10);
  }
}

/**
 * Get workflow history
 */
function getWorkflowHistory() {
  return [...WorkflowState.workflowHistory];
}

/**
 * Clear workflow history
 */
function clearWorkflowHistory() {
  WorkflowState.workflowHistory = [];
}

// ==================== EXPORT FOR USE IN OTHER FILES ====================

window.WorkflowDisplayModule = {
  // Initialization
  initialize: initializeWorkflowModule,
  
  // Main display functions
  displayWorkflow,
  clearWorkflowDisplay,
  
  // Utility functions
  copyToClipboard,
  
  // History management
  getWorkflowHistory,
  clearWorkflowHistory,
  
  // State access (read-only)
  getState: () => ({ ...WorkflowState })
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .workflow-section {
    margin: 15px 0;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #4a90e2;
  }
  
  .script-text {
    font-size: 15px;
    line-height: 1.6;
    color: #2c3e50;
    margin: 10px 0;
  }
  
  .action-workflow ul {
    margin: 10px 0;
    padding-left: 20px;
  }
  
  .action-workflow li {
    margin: 8px 0;
    line-height: 1.5;
  }
  
  .email-template {
    background: white;
    padding: 15px;
    border-radius: 6px;
    font-family: 'Courier New', monospace;
    white-space: pre-wrap;
    margin: 10px 0;
    border: 1px solid #ddd;
  }
  
  .copy-btn {
    background: #4a90e2;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    margin-top: 10px;
    transition: background 0.3s;
  }
  
  .copy-btn:hover {
    background: #357abd;
  }
  
  .tagging-info {
    background: #e8f4f8;
    padding: 10px;
    border-radius: 6px;
    margin: 10px 0;
    font-size: 13px;
    color: #2c3e50;
  }
  
  .conditional-dropdown {
    margin: 15px 0;
  }
  
  .conditional-dropdown select {
    width: 100%;
    padding: 10px;
    border: 2px solid #4a90e2;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
  }
`;
document.head.appendChild(style);