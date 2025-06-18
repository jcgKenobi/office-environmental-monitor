// Tab Manager for Office Environmental Monitor

const TabManager = {
    
    currentTab: 'summary',
    validTabs: ['summary', 'technical', 'timeline', 'status'],
    
    /**
     * Initialize tab manager
     */
    init() {
        this.bindEvents();
        this.handleInitialLoad();
        
        // Listen for content loaded events
        Utils.events.on('contentLoaded', (data) => {
            this.onContentLoaded(data);
        });
    },

    /**
     * Switch to specific tab
     * @param {string} tabId - ID of tab to switch to
     */
    switchTab(tabId) {
        if (!this.validTabs.includes(tabId)) {
            console.error('Invalid tab ID:', tabId);
            return;
        }

        // Don't reload if already on this tab
        if (this.currentTab === tabId) {
            return;
        }

        // Update UI state
        this.updateTabButtons(tabId);
        this.updateSubtitle(tabId);
        this.updateURL(tabId);
        
        // Load content
        ContentLoader.loadTabContent(tabId);
        
        // Update current tab
        this.currentTab = tabId;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Emit tab change event
        Utils.events.emit('tabChanged', { 
            from: this.currentTab, 
            to: tabId 
        });
    },

    /**
     * Update tab button states
     * @param {string} activeTabId - ID of active tab
     */
    updateTabButtons(activeTabId) {
        const buttons = document.querySelectorAll('.tab-button');
        
        buttons.forEach(button => {
            const tabId = button.getAttribute('data-tab');
            
            if (tabId === activeTabId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    },

    /**
     * Update dynamic subtitle
     * @param {string} tabId - ID of current tab
     */
    updateSubtitle(tabId) {
        const button = document.querySelector(`[data-tab="${tabId}"]`);
        const subtitle = document.getElementById('dynamic-subtitle');
        
        if (button && subtitle) {
            const subtitleText = button.getAttribute('data-subtitle');
            subtitle.textContent = subtitleText;
        }
    },

    /**
     * Update URL hash
     * @param {string} tabId - ID of current tab
     */
    updateURL(tabId) {
        // Update URL without triggering hashchange event
        history.replaceState(null, null, `#${tabId}`);
    },

    /**
     * Handle initial page load
     */
    handleInitialLoad() {
        const hash = window.location.hash.replace('#', '');
        const initialTab = this.validTabs.includes(hash) ? hash : 'summary';
        
        // Set initial state without triggering content load
        // (ContentLoader handles initial load)
        this.updateTabButtons(initialTab);
        this.updateSubtitle(initialTab);
        this.currentTab = initialTab;
    },

    /**
     * Handle hash change events
     */
    handleHashChange() {
        const hash = window.location.hash.replace('#', '');
        const targetTab = this.validTabs.includes(hash) ? hash : 'summary';
        
        if (targetTab !== this.currentTab) {
            this.switchTab(targetTab);
        }
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Tab button clicks
        document.addEventListener('click', (e) => {
            const tabButton = e.target.closest('.tab-button');
            if (tabButton) {
                e.preventDefault();
                const tabId = tabButton.getAttribute('data-tab');
                this.switchTab(tabId);
            }
        });

        // Hash change events (for browser back/forward)
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Handle link clicks within content
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const href = e.target.getAttribute('href').replace('#', '');
                
                if (this.validTabs.includes(href)) {
                    this.switchTab(href);
                }
            }
        });
    },

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardNavigation(e) {
        // Arrow key navigation for tabs
        if (e.target.classList.contains('tab-button')) {
            const buttons = Array.from(document.querySelectorAll('.tab-button'));
            const currentIndex = buttons.indexOf(e.target);
            
            let nextIndex;
            
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
                    buttons[nextIndex].focus();
                    break;
                    
                case 'ArrowRight':
                    e.preventDefault();
                    nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
                    buttons[nextIndex].focus();
                    break;
                    
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    e.target.click();
                    break;
            }
        }
        
        // Quick tab switching with number keys (1-4)
        if (e.ctrlKey || e.metaKey) {
            const num = parseInt(e.key);
            if (num >= 1 && num <= 4) {
                e.preventDefault();
                const tabIndex = num - 1;
                if (this.validTabs[tabIndex]) {
                    this.switchTab(this.validTabs[tabIndex]);
                }
            }
        }
    },

    /**
     * Called when content is loaded
     * @param {Object} data - Content loaded data
     */
    onContentLoaded(data) {
        // Add any post-load functionality here
        this.enhanceLoadedContent(data.tabId);
    },

    /**
     * Enhance loaded content with interactive features
     * @param {string} tabId - ID of loaded tab
     */
    enhanceLoadedContent(tabId) {
        // Add smooth scrolling to internal links
        const content = document.getElementById('tab-content-area');
        if (content) {
            const internalLinks = content.querySelectorAll('a[href^="#"]');
            internalLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    Utils.smoothScrollTo(targetId);
                });
            });
        }

        // Add intersection observer for animations
        this.addScrollAnimations();
    },

    /**
     * Add scroll-based animations
     */
    addScrollAnimations() {
        const cards = document.querySelectorAll('.card, .metric-card, .arch-box');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });
        }
    },

    /**
     * Get current tab ID
     * @returns {string} Current tab ID
     */
    getCurrentTab() {
        return this.currentTab;
    },

    /**
     * Check if tab is valid
     * @param {string} tabId - Tab ID to check
     * @returns {boolean} True if valid
     */
    isValidTab(tabId) {
        return this.validTabs.includes(tabId);
    },

    /**
     * Get all available tabs
     * @returns {Array} Array of tab IDs
     */
    getAvailableTabs() {
        return [...this.validTabs];
    }
};

// Global function for backward compatibility and easy access
window.switchTab = function(tabId) {
    TabManager.switchTab(tabId);
};