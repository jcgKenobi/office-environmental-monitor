// Tab Manager for Office Environmental Monitor - Complete Enhanced Version

const TabManager = {

    currentTab: 'summary',
    validTabs: ['summary', 'technical', 'timeline', 'status'],
    isTransitioning: false,

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

        // Listen for language change events
        Utils.events.on('languageChanged', (data) => {
            this.onLanguageChanged(data);
        });
    },

    /**
     * Switch to specific tab with enhanced transitions
     * @param {string} tabId - ID of tab to switch to
     */
    switchTab(tabId) {
        if (!this.validTabs.includes(tabId)) {
            console.error('Invalid tab ID:', tabId);
            return;
        }

        // Don't reload if already on this tab or currently transitioning
        if (this.currentTab === tabId || this.isTransitioning) {
            return;
        }

        // Set transitioning state
        this.isTransitioning = true;

        // Store previous tab for transition
        const previousTab = this.currentTab;

        // Update UI state with enhanced animations
        this.updateTabButtons(tabId);
        this.updateURL(tabId);

        // Add transition effect to content area
        this.startContentTransition(() => {
            // Load content
            ContentLoader.loadTabContent(tabId);

            // Update current tab
            this.currentTab = tabId;

            // Scroll to top with enhanced smoothness
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Emit tab change event with more data
            Utils.events.emit('tabChanged', {
                from: previousTab,
                to: tabId,
                timestamp: Date.now()
            });

            // Reset transitioning state after animation
            setTimeout(() => {
                this.isTransitioning = false;
            }, 300);
        });
    },

    /**
     * Start content transition animation
     * @param {Function} callback - Function to call during transition
     */
    startContentTransition(callback) {
        const contentArea = document.getElementById('tab-content-area');

        if (contentArea) {
            // Add fade-out class
            contentArea.style.opacity = '0';
            contentArea.style.transform = 'translateY(10px)';

            // Execute callback after fade-out
            setTimeout(() => {
                callback();

                // Fade-in after content loads
                setTimeout(() => {
                    contentArea.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    contentArea.style.opacity = '1';
                    contentArea.style.transform = 'translateY(0)';
                }, 50);
            }, 150);
        } else {
            // Fallback if content area not found
            callback();
        }
    },

    /**
     * Update tab button states with enhanced animations
     * @param {string} activeTabId - ID of active tab
     */
    updateTabButtons(activeTabId) {
        const buttons = document.querySelectorAll('.tab-button');

        buttons.forEach(button => {
            const tabId = button.getAttribute('data-tab');

            if (tabId === activeTabId) {
                // Enhanced activation animation
                button.classList.remove('active');

                // Force reflow for animation
                button.offsetHeight;

                // Add active class with animation
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');

                // Add ripple effect
                this.addRippleEffect(button);

            } else {
                button.classList.remove('active');
                button.setAttribute('aria-selected', 'false');
            }
        });
    },

    /**
     * Add ripple effect to button
     * @param {HTMLElement} button - Button element
     */
    addRippleEffect(button) {
        // Remove existing ripple
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        // Create ripple element
        const ripple = document.createElement('span');
        ripple.className = 'ripple';

        // Position ripple
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';

        // Add ripple styles
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(220, 53, 69, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';

        // Add to button
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
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
        // Tab button clicks with enhanced handling
        document.addEventListener('click', (e) => {
            const tabButton = e.target.closest('.tab-button');
            if (tabButton) {
                e.preventDefault();
                const tabId = tabButton.getAttribute('data-tab');

                // Add visual feedback
                this.addClickFeedback(tabButton);

                // Switch tab
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

        // Handle link clicks within content for cross-tab navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const href = e.target.getAttribute('href').replace('#', '');

                if (this.validTabs.includes(href)) {
                    this.switchTab(href);
                }
            }
        });

        // Add CSS for ripple animation if not exists
        this.addRippleCSS();
    },

    /**
     * Add visual click feedback
     * @param {HTMLElement} button - Button element
     */
    addClickFeedback(button) {
        button.style.transform = 'scale(0.95)';

        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    },

    /**
     * Add CSS for ripple animation
     */
    addRippleCSS() {
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
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
                    this.addClickFeedback(e.target);
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

        // Apply entrance animations to new content
        this.animateContentEntrance();

        // Handle auto-expand functionality for timeline
        if (data.tabId === 'timeline') {
            this.handleTimelineAutoExpand();
        }
    },

    /**
     * Handle auto-expand functionality for timeline phases
     */
    handleTimelineAutoExpand() {
        console.log('🔍 handleTimelineAutoExpand called');

        const targetPhase = sessionStorage.getItem('targetPhase');
        console.log('🎯 Target phase from sessionStorage:', targetPhase);

        if (targetPhase) {
            // Clear the stored target
            sessionStorage.removeItem('targetPhase');
            console.log('✅ Cleared targetPhase from sessionStorage');

            // Find and expand the target phase
            setTimeout(() => {
                console.log('🔍 Looking for selector:', `.timeline-item.${targetPhase} .expand-trigger`);

                // Debug: Check if timeline content exists
                const timelineContent = document.getElementById('timeline-content');
                console.log('📄 Timeline content found:', !!timelineContent);

                // Debug: Check all timeline items
                const allTimelineItems = document.querySelectorAll('.timeline-item');
                console.log('📋 All timeline items found:', allTimelineItems.length);
                allTimelineItems.forEach((item, index) => {
                    console.log(`   Item ${index}:`, item.className);
                });

                // Debug: Check specific phase
                const phaseItem = document.querySelector(`.timeline-item.${targetPhase}`);
                console.log(`🎯 Phase item (.timeline-item.${targetPhase}) found:`, !!phaseItem);

                if (phaseItem) {
                    console.log('✅ Phase item classes:', phaseItem.className);

                    // Debug: Check for expand trigger within phase
                    const expandTrigger = phaseItem.querySelector('.expand-trigger');
                    console.log('🔘 Expand trigger within phase found:', !!expandTrigger);

                    if (expandTrigger) {
                        console.log('✅ Expand trigger classes:', expandTrigger.className);
                        console.log('✅ Expand trigger onclick:', expandTrigger.getAttribute('onclick'));

                        // Check if already active
                        const isActive = expandTrigger.classList.contains('active');
                        console.log('🔄 Already active?', isActive);

                        if (!isActive) {
                            console.log('🎬 Attempting to click expand trigger...');

                            // Try multiple click methods
                            try {
                                // Method 1: Direct click
                                expandTrigger.click();
                                console.log('✅ Method 1 (click) executed');

                                // Method 2: Dispatch click event
                                const clickEvent = new MouseEvent('click', {
                                    bubbles: true,
                                    cancelable: true,
                                    view: window
                                });
                                expandTrigger.dispatchEvent(clickEvent);
                                console.log('✅ Method 2 (dispatchEvent) executed');

                                // Method 3: Manual toggle (fallback)
                                expandTrigger.classList.add('active');
                                const expandContent = expandTrigger.nextElementSibling;
                                if (expandContent) {
                                    expandContent.classList.add('active');
                                    console.log('✅ Method 3 (manual toggle) executed');
                                }

                            } catch (error) {
                                console.error('❌ Error clicking expand trigger:', error);
                            }

                            // Smooth scroll to the expanded section
                            setTimeout(() => {
                                console.log('📍 Attempting smooth scroll...');

                                try {
                                    expandTrigger.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'center'
                                    });
                                    console.log('✅ Smooth scroll executed');
                                } catch (error) {
                                    console.error('❌ Error during scroll:', error);
                                }
                            }, 500); // Increased delay

                        } else {
                            console.log('ℹ️ Expand trigger already active, just scrolling...');
                            expandTrigger.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                        }
                    } else {
                        console.error('❌ Expand trigger not found within phase item');
                    }
                } else {
                    console.error('❌ Phase item not found');

                    // Fallback: Try direct selector
                    const directTargetElement = document.querySelector(`.timeline-item.${targetPhase} .expand-trigger`);
                    console.log('🔄 Direct selector result:', !!directTargetElement);
                }
            }, 500); // Increased delay to 500ms
        } else {
            console.log('ℹ️ No target phase specified');
        }
    },

    /**
     * Called when language changes
     * @param {Object} data - Language change data
     */
    onLanguageChanged(data) {
        console.log('Tab Manager: Language changed from', data.previous, 'to', data.current);
        // Future: Update tab button text based on language
        // For now, just log the change
    },

    /**
     * Animate content entrance
     */
    animateContentEntrance() {
        const content = document.getElementById('tab-content-area');
        if (content) {
            // Add stagger animation to child elements
            const children = content.querySelectorAll('.section, .card, .metric-card');
            children.forEach((child, index) => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(20px)';
                child.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, index * 50 + 100);
            });
        }
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

        // Setup cross-tab navigation links
        this.setupCrossTabLinks();
    },

    /**
     * Setup cross-tab navigation with auto-expand functionality
     */
    setupCrossTabLinks() {
        const content = document.getElementById('tab-content-area');
        if (content) {
            // Find all onclick="TabManager.switchTab()" calls
            const crossTabLinks = content.querySelectorAll('[onclick*="switchTab"]');
            crossTabLinks.forEach(link => {
                // Extract tab ID from onclick attribute
                const onclickAttr = link.getAttribute('onclick');
                const match = onclickAttr.match(/switchTab\(['"]([^'"]+)['"]\)/);

                if (match) {
                    const targetTab = match[1];
                    // Add enhanced click handler
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.switchTab(targetTab);
                    });
                }
            });
        }
    },

    /**
     * Add scroll-based animations
     */
    addScrollAnimations() {
        const cards = document.querySelectorAll('.card, .metric-card, .arch-box, .timeline-content');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.classList.add('animate-in');
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
    },

    /**
     * Get current transition state
     * @returns {boolean} True if currently transitioning
     */
    isCurrentlyTransitioning() {
        return this.isTransitioning;
    }
};

// Global function for backward compatibility and easy access
window.switchTab = function (tabId) {
    TabManager.switchTab(tabId);
};

// Global function for timeline phase navigation (NEW FEATURE)
window.navigateToTimelinePhase = function (phaseId) {
    console.log('🚀 navigateToTimelinePhase called with:', phaseId);

    // Switch to timeline tab
    console.log('📱 Switching to timeline tab...');
    TabManager.switchTab('timeline');

    // Store the target phase for auto-expansion after tab loads
    sessionStorage.setItem('targetPhase', phaseId);
    console.log('💾 Stored targetPhase in sessionStorage:', phaseId);

    // Additional debugging: Check if the phase ID is valid
    const validPhases = ['phase1', 'phase2', 'phase3', 'phase4'];
    if (!validPhases.includes(phaseId)) {
        console.warn('⚠️ Invalid phase ID:', phaseId, 'Valid phases:', validPhases);
    }
};

// Export TabManager to global scope
window.TabManager = TabManager;