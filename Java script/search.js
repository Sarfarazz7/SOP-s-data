// ==================== SEARCH MODULE ====================
// This file handles all search functionality including workflow search and recent history

// ==================== STATE MANAGEMENT ====================
const SearchState = {
  currentQuery: '',
  searchResults: [],
  recentSearches: [],
  recentlyViewed: [],
  isSearching: false
};

// ==================== DOM REFERENCES ====================
let searchBoxElement = null;
let searchResultsDiv = null;
let searchInstructionDiv = null;

// ==================== INITIALIZATION ====================

/**
 * Initialize search module
 */
function initializeSearchModule() {
  searchBoxElement = document.getElementById('searchBox');
  searchResultsDiv = document.getElementById('searchResults');
  searchInstructionDiv = document.getElementById('instruction');
  
  if (!searchBoxElement) {
    console.error('Search box element not found');
    return false;
  }
  
  setupSearchEventListeners();
  setupKeyboardShortcuts();
  loadRecentSearches();
  
  ConfigUtils.logUserAction('SEARCH_MODULE_INITIALIZED');
  return true;
}

/**
 * Setup search event listeners
 */
function setupSearchEventListeners() {
  if (!searchBoxElement) return;
  
  // Input event for real-time search
  searchBoxElement.addEventListener('input', handleSearchInput);
  
  // Focus event
  searchBoxElement.addEventListener('focus', handleSearchFocus);
  
  // Blur event
  searchBoxElement.addEventListener('blur', handleSearchBlur);
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
  if (!ConfigUtils.isFeatureEnabled('ENABLE_KEYBOARD_SHORTCUTS')) {
    return;
  }
  
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchBoxElement) {
        searchBoxElement.focus();
        searchBoxElement.select();
      }
    }
    
    // Escape to clear search
    if (e.key === 'Escape' && document.activeElement === searchBoxElement) {
      clearSearch();
    }
  });
}

// ==================== SEARCH FUNCTIONALITY ====================

/**
 * Handle search input
 */
function handleSearchInput(event) {
  const query = event.target.value.trim();
  SearchState.currentQuery = query;
  
  if (query.length < AppConfig.MIN_SEARCH_LENGTH) {
    clearSearchResults();
    return;
  }
  
  performSearch(query);
}

/**
 * Perform search operation
 */
function performSearch(query) {
  SearchState.isSearching = true;
  
  // Search workflows
  const results = WorkflowDataModule.searchWorkflows(query);
  SearchState.searchResults = results;
  
  // Add to recent searches
  addToRecentSearches(query);
  
  // Display results
  displaySearchResults(results, query);
  
  // Log search
  ConfigUtils.logUserAction('SEARCH_PERFORMED', {
    query: query,
    resultsCount: results.length
  });
  
  SearchState.isSearching = false;
}

/**
 * Display search results
 */
function displaySearchResults(results, query) {
  if (!searchInstructionDiv) return;
  
  searchInstructionDiv.innerHTML = '';
  
  if (results.length === 0) {
    searchInstructionDiv.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #e74c3c;">
        <h3>🔍 No Results Found</h3>
        <p>No workflows found for "${escapeHtml(query)}"</p>
        <p style="font-size: 14px; color: #7f8c8d;">Try different keywords or browse categories</p>
      </div>
    `;
    return;
  }
  
  const resultsHeader = document.createElement('div');
  resultsHeader.style.cssText = 'padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 15px;';
  resultsHeader.innerHTML = `
    <h3 style="margin: 0; color: #2c3e50;">
      🔍 Search Results for "${escapeHtml(query)}"
    </h3>
    <p style="margin: 5px 0 0 0; color: #7f8c8d; font-size: 14px;">
      Found ${results.length} matching workflow${results.length !== 1 ? 's' : ''}
    </p>
  `;
  searchInstructionDiv.appendChild(resultsHeader);
  
  // Display each result
  results.forEach((result, index) => {
    const resultDiv = createSearchResultElement(result, index);
    searchInstructionDiv.appendChild(resultDiv);
  });
}

/**
 * Create search result element
 */
function createSearchResultElement(result, index) {
  const resultDiv = document.createElement('div');
  resultDiv.className = 'search-result-item';
  resultDiv.style.cssText = `
    padding: 15px;
    margin: 10px 0;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
  `;
  
  // Get preview text
  const preview = getSearchResultPreview(result);
  
  resultDiv.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start;">
      <div style="flex: 1;">
        <h4 style="margin: 0 0 5px 0; color: #2c3e50;">
          ${result.mainGroup} → ${result.subGroup}
        </h4>
        <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
          ${preview}
        </p>
      </div>
      <span style="background: #4a90e2; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
        #${index + 1}
      </span>
    </div>
  `;
  
  // Hover effects
  resultDiv.addEventListener('mouseenter', function() {
    this.style.borderColor = '#4a90e2';
    this.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.2)';
    this.style.transform = 'translateY(-2px)';
  });
  
  resultDiv.addEventListener('mouseleave', function() {
    this.style.borderColor = '#e0e0e0';
    this.style.boxShadow = 'none';
    this.style.transform = 'translateY(0)';
  });
  
  // Click handler
  resultDiv.addEventListener('click', function() {
    selectSearchResult(result);
  });
  
  return resultDiv;
}

/**
 * Get preview text for search result
 */
function getSearchResultPreview(result) {
  const content = result.content;
  
  if (typeof content === 'string') {
    return content.substring(0, 150) + (content.length > 150 ? '...' : '');
  }
  
  if (content.script) {
    return content.script.substring(0, 150) + (content.script.length > 150 ? '...' : '');
  }
  
  if (content.workflow && Array.isArray(content.workflow)) {
    return content.workflow[0] || 'Click to view workflow details';
  }
  
  return 'Click to view workflow details';
}

/**
 * Select a search result
 */
function selectSearchResult(result) {
  // Update dropdowns
  const mainGroupSelect = document.getElementById('mainGroup');
  const subGroupSelect = document.getElementById('subGroup');
  
  if (mainGroupSelect && subGroupSelect) {
    mainGroupSelect.value = result.mainGroup;
    
    // Trigger change to populate subgroups
    const changeEvent = new Event('change');
    mainGroupSelect.dispatchEvent(changeEvent);
    
    // Wait a bit for subgroups to populate, then select
    setTimeout(() => {
      subGroupSelect.value = result.subGroup;
      subGroupSelect.dispatchEvent(changeEvent);
    }, 100);
  }
  
  // Clear search
  clearSearch();
  
  // Add to recently viewed
  addToRecentlyViewed(result.mainGroup, result.subGroup);
  
  // Scroll to top
  const mainContent = document.getElementById('mainContent');
  if (mainContent) {
    mainContent.scrollTop = 0;
  }
  
  ConfigUtils.logUserAction('SEARCH_RESULT_SELECTED', {
    mainGroup: result.mainGroup,
    subGroup: result.subGroup,
    query: SearchState.currentQuery
  });
}

/**
 * Clear search
 */
function clearSearch() {
  if (searchBoxElement) {
    searchBoxElement.value = '';
  }
  
  SearchState.currentQuery = '';
  clearSearchResults();
}

/**
 * Clear search results display
 */
function clearSearchResults() {
  if (searchInstructionDiv) {
    searchInstructionDiv.innerHTML = '';
  }
  
  SearchState.searchResults = [];
}

/**
 * Handle search focus
 */
function handleSearchFocus() {
  if (SearchState.currentQuery.length >= AppConfig.MIN_SEARCH_LENGTH) {
    displaySearchResults(SearchState.searchResults, SearchState.currentQuery);
  } else {
    displaySearchSuggestions();
  }
}

/**
 * Handle search blur
 */
function handleSearchBlur() {
  // Delay to allow click on results
  setTimeout(() => {
    // Don't clear if actively searching
    if (!SearchState.isSearching && SearchState.currentQuery.length === 0) {
      // Optional: keep results visible
    }
  }, 200);
}

/**
 * Display search suggestions (popular searches, recent searches)
 */
function displaySearchSuggestions() {
  if (!searchInstructionDiv) return;
  
  searchInstructionDiv.innerHTML = '';
  
  const suggestionsDiv = document.createElement('div');
  suggestionsDiv.style.padding = '15px';
  
  let html = '<h3 style="color: #2c3e50;">💡 Quick Search Tips</h3>';
  html += '<ul style="line-height: 1.8; color: #7f8c8d;">';
  html += '<li>Try: "OTP", "MDND", "refund", "delivery"</li>';
  html += '<li>Use Ctrl+K (Cmd+K on Mac) to focus search</li>';
  html += '<li>Press Escape to clear search</li>';
  html += '</ul>';
  
  // Show recent searches if available
  if (SearchState.recentSearches.length > 0) {
    html += '<h4 style="color: #2c3e50; margin-top: 20px;">🕐 Recent Searches</h4>';
    html += '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';
    
    SearchState.recentSearches.slice(0, 5).forEach(query => {
      html += `
        <span onclick="SearchModule.performSearch('${escapeHtml(query)}')" 
              style="background: #e8f4f8; padding: 6px 12px; border-radius: 6px; 
                     cursor: pointer; font-size: 14px; color: #2c3e50;
                     border: 1px solid #4a90e2;">
          ${escapeHtml(query)}
        </span>
      `;
    });
    
    html += '</div>';
  }
  
  suggestionsDiv.innerHTML = html;
  searchInstructionDiv.appendChild(suggestionsDiv);
}

// ==================== RECENT SEARCHES ====================

/**
 * Add to recent searches
 */
function addToRecentSearches(query) {
  if (!query || query.length < AppConfig.MIN_SEARCH_LENGTH) return;
  
  // Remove duplicates
  SearchState.recentSearches = SearchState.recentSearches.filter(
    q => q.toLowerCase() !== query.toLowerCase()
  );
  
  // Add to beginning
  SearchState.recentSearches.unshift(query);
  
  // Keep only last 10
  if (SearchState.recentSearches.length > 10) {
    SearchState.recentSearches = SearchState.recentSearches.slice(0, 10);
  }
  
  // Save to localStorage
  saveRecentSearches();
}

/**
 * Save recent searches to localStorage
 */
function saveRecentSearches() {
  try {
    localStorage.setItem('amastor_recent_searches', JSON.stringify(SearchState.recentSearches));
  } catch (e) {
    console.log('Could not save recent searches');
  }
}

/**
 * Load recent searches from localStorage
 */
function loadRecentSearches() {
  try {
    const saved = localStorage.getItem('amastor_recent_searches');
    if (saved) {
      SearchState.recentSearches = JSON.parse(saved);
    }
  } catch (e) {
    console.log('Could not load recent searches');
  }
}

/**
 * Clear recent searches
 */
function clearRecentSearches() {
  SearchState.recentSearches = [];
  try {
    localStorage.removeItem('amastor_recent_searches');
  } catch (e) {
    console.log('Could not clear recent searches');
  }
}

// ==================== RECENTLY VIEWED ====================

/**
 * Add to recently viewed workflows
 */
function addToRecentlyViewed(mainGroup, subGroup) {
  if (!ConfigUtils.isFeatureEnabled('ENABLE_RECENT_HISTORY')) {
    return;
  }
  
  const item = {
    mainGroup,
    subGroup,
    timestamp: Date.now()
  };
  
  // Remove duplicates
  SearchState.recentlyViewed = SearchState.recentlyViewed.filter(
    i => !(i.mainGroup === mainGroup && i.subGroup === subGroup)
  );
  
  // Add to beginning
  SearchState.recentlyViewed.unshift(item);
  
  // Keep only last items
  const maxItems = AppConfig.MAX_RECENT_ITEMS || 5;
  if (SearchState.recentlyViewed.length > maxItems) {
    SearchState.recentlyViewed = SearchState.recentlyViewed.slice(0, maxItems);
  }
  
  // Update display
  updateRecentlyViewedDisplay();
}

/**
 * Update recently viewed display
 */
function updateRecentlyViewedDisplay() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  
  // Remove existing recent section
  const existingRecent = document.getElementById('recentSection');
  if (existingRecent) {
    existingRecent.remove();
  }
  
  if (SearchState.recentlyViewed.length === 0) return;
  
  const recentSection = document.createElement('div');
  recentSection.id = 'recentSection';
  recentSection.style.marginTop = '30px';
  recentSection.innerHTML = '<h2 style="color: #2c3e50;">📚 Recently Viewed</h2>';
  
  SearchState.recentlyViewed.forEach(item => {
    const recentBlock = document.createElement('div');
    recentBlock.className = 'recent-item';
    recentBlock.style.cssText = `
      padding: 12px;
      margin: 8px 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;
    `;
    
    const timeAgo = getTimeAgo(item.timestamp);
    
    recentBlock.innerHTML = `
      <strong style="color: #2c3e50;">${item.mainGroup}</strong><br>
      <span style="color: #7f8c8d; font-size: 14px;">${item.subGroup}</span><br>
      <small style="color: #bdc3c7; font-size: 12px;">${timeAgo}</small>
    `;
    
    recentBlock.addEventListener('mouseenter', function() {
      this.style.borderColor = '#4a90e2';
      this.style.transform = 'translateX(5px)';
    });
    
    recentBlock.addEventListener('mouseleave', function() {
      this.style.borderColor = '#e0e0e0';
      this.style.transform = 'translateX(0)';
    });
    
    recentBlock.addEventListener('click', function() {
      selectSearchResult(item);
    });
    
    recentSection.appendChild(recentBlock);
  });
  
  sidebar.appendChild(recentSection);
}

/**
 * Get time ago string
 */
function getTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== EXPORT FOR USE IN OTHER FILES ====================

window.SearchModule = {
  // Initialization
  initialize: initializeSearchModule,
  
  // Search functions
  performSearch,
  clearSearch,
  selectSearchResult,
  
  // Recent searches
  addToRecentSearches,
  clearRecentSearches,
  getRecentSearches: () => [...SearchState.recentSearches],
  
  // Recently viewed
  addToRecentlyViewed,
  updateRecentlyViewedDisplay,
  getRecentlyViewed: () => [...SearchState.recentlyViewed],
  
  // State access (read-only)
  getState: () => ({ ...SearchState })
};