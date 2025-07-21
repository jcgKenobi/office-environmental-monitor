// Utility Functions for Office Environmental Monitor

const Utils = {
    
    /**
     * Smooth scroll to element
     * @param {string} elementId - ID of element to scroll to
     */
    smoothScrollTo(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    /**
     * Add fade in animation to element
     * @param {HTMLElement} element - Element to animate
     */
    fadeIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        // Force reflow
        element.offsetHeight;
        
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    },

    /**
     * Create loading spinner element
     * @returns {HTMLElement} Loading spinner element
     */
    createLoadingSpinner() {
        const container = document.createElement('div');
        container.className = 'loading-indicator';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const text = document.createElement('p');
        text.textContent = 'Loading content...';
        
        container.appendChild(spinner);
        container.appendChild(text);
        
        return container;
    },

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} True if element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Format numbers with commas
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Local storage helper (with fallback)
     */
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('LocalStorage not available, using session storage');
                return false;
            }
        },
        
        get(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.warn('LocalStorage not available');
                return null;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('LocalStorage not available');
                return false;
            }
        }
    },

    /**
     * Simple event emitter for component communication
     */
    events: {
        listeners: {},
        
        on(event, callback) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
        },
        
        emit(event, data) {
            if (this.listeners[event]) {
                this.listeners[event].forEach(callback => callback(data));
            }
        },
        
        off(event, callback) {
            if (this.listeners[event]) {
                this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
            }
        }
    }
};

/**
 * Language Management System
 * Handles internationalization infrastructure and language switching
 */
const LanguageManager = {
    
    currentLanguage: 'en',
    supportedLanguages: ['en', 'tr'],
    storageKey: 'atvise-project-language',
    
    /**
     * Initialize language system
     */
    init() {
        // Load saved language preference
        this.loadLanguagePreference();
        
        // Set up event listeners
        this.bindEvents();
        
        // Update UI to reflect current language
        this.updateLanguageUI();
        
        // Set document language attribute
        document.documentElement.lang = this.currentLanguage;
        
        console.log('Language Manager initialized with language:', this.currentLanguage);
    },

    /**
     * Load language preference from localStorage
     */
    loadLanguagePreference() {
        const savedLanguage = Utils.storage.get(this.storageKey);
        
        if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
        } else {
            // Default to English if no preference or invalid language
            this.currentLanguage = 'en';
        }
    },

    /**
     * Save language preference to localStorage
     */
    saveLanguagePreference() {
        Utils.storage.set(this.storageKey, this.currentLanguage);
    },

    /**
     * Switch to specified language
     * @param {string} languageCode - Language code (en/tr)
     */
    switchLanguage(languageCode) {
        if (!this.supportedLanguages.includes(languageCode)) {
            console.warn('Unsupported language:', languageCode);
            return;
        }

        const previousLanguage = this.currentLanguage;
        this.currentLanguage = languageCode;
        
        // Save preference
        this.saveLanguagePreference();
        
        // Update document language
        document.documentElement.lang = languageCode;
        
        // Update UI
        this.updateLanguageUI();
        
        // Emit language change event for other components
        Utils.events.emit('languageChanged', {
            current: languageCode,
            previous: previousLanguage
        });

        console.log('Language switched from', previousLanguage, 'to', languageCode);
    },

    /**
     * Update language toggle button states
     */
    updateLanguageUI() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(button => {
            const buttonLang = button.getAttribute('data-lang');
            
            if (buttonLang === this.currentLanguage) {
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
            }
        });
    },

    /**
     * Bind event listeners for language toggle
     */
    bindEvents() {
        // Use event delegation for language buttons
        document.addEventListener('click', (e) => {
            const langButton = e.target.closest('.lang-btn');
            if (langButton) {
                e.preventDefault();
                const targetLanguage = langButton.getAttribute('data-lang');
                if (targetLanguage && targetLanguage !== this.currentLanguage) {
                    this.switchLanguage(targetLanguage);
                }
            }
        });

        // Handle keyboard navigation for language buttons
        document.addEventListener('keydown', (e) => {
            const langButton = e.target.closest('.lang-btn');
            if (langButton && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                const targetLanguage = langButton.getAttribute('data-lang');
                if (targetLanguage && targetLanguage !== this.currentLanguage) {
                    this.switchLanguage(targetLanguage);
                }
            }
        });
    },

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    },

    /**
     * Check if current language is Turkish
     * @returns {boolean} True if Turkish is selected
     */
    isTurkish() {
        return this.currentLanguage === 'tr';
    },

    /**
     * Check if current language is English
     * @returns {boolean} True if English is selected
     */
    isEnglish() {
        return this.currentLanguage === 'en';
    },

    /**
     * Get translated text (placeholder for future implementation)
     * @param {string} key - Translation key
     * @param {string} fallback - Fallback text if translation not found
     * @returns {string} Translated text or fallback
     */
    getText(key, fallback = '') {
        // Placeholder for future translation implementation
        // For now, return fallback text
        return fallback || key;
    },

    /**
     * Update text content for elements with data-lang-key attributes
     * This is a placeholder for future translation implementation
     */
    updateContentTranslations() {
        const elementsWithLangKey = document.querySelectorAll('[data-lang-key]');
        
        elementsWithLangKey.forEach(element => {
            const langKey = element.getAttribute('data-lang-key');
            const translatedText = this.getText(langKey, element.textContent);
            element.textContent = translatedText;
        });
    },

    /**
     * Get language display name
     * @param {string} langCode - Language code
     * @returns {string} Display name of language
     */
    getLanguageDisplayName(langCode) {
        const displayNames = {
            'en': 'English',
            'tr': 'Türkçe'
        };
        return displayNames[langCode] || langCode;
    },

    /**
     * Reset language to default (English)
     */
    resetToDefault() {
        this.switchLanguage('en');
    }
};

/**
 * Enhanced Glossary System (placeholder for future implementation)
 * Will provide tooltips for technical terms
 */
const GlossaryManager = {
    
    glossaryTerms: {},
    
    /**
     * Initialize glossary system
     */
    init() {
        console.log('Glossary Manager initialized (placeholder)');
        // Future implementation will handle technical term tooltips
    },

    /**
     * Add glossary term
     * @param {string} term - Technical term
     * @param {string} definition - Definition of the term
     */
    addTerm(term, definition) {
        this.glossaryTerms[term.toLowerCase()] = definition;
    },

    /**
     * Get definition for a term
     * @param {string} term - Technical term
     * @returns {string|null} Definition or null if not found
     */
    getDefinition(term) {
        return this.glossaryTerms[term.toLowerCase()] || null;
    }
};

// Global function for backward compatibility and easy access
window.switchLanguage = function(languageCode) {
    LanguageManager.switchLanguage(languageCode);
};

// Export for global access
window.LanguageManager = LanguageManager;
window.GlossaryManager = GlossaryManager;