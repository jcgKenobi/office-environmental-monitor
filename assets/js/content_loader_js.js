// Content Loader for Office Environmental Monitor
// Loads content from separate HTML files (industry standard)

const ContentLoader = {
    
    // Content file mapping
    contentFiles: {
        summary: './content/summary.html',
        technical: './content/technical.html', 
        timeline: './content/timeline.html',
        status: './content/status.html'
    },

    // Cache for loaded content
    cache: {},

    /**
     * Initialize content loader
     */
    init() {
        this.loadInitialTab();
    },

    /**
     * Load content for specific tab
     * @param {string} tabId - ID of tab to load
     */
    async loadTabContent(tabId) {
        const contentArea = document.getElementById('tab-content-area');
        
        if (!contentArea) {
            console.error('Content area not found');
            return;
        }

        if (!this.contentFiles[tabId]) {
            console.error('Tab content file not found:', tabId);
            return;
        }

        // Show loading state
        contentArea.innerHTML = this.getLoadingHTML();

        try {
            // Check cache first
            let content = this.cache[tabId];
            
            if (!content) {
                // Fetch content from file
                content = await this.fetchContent(tabId);
                // Cache it
                this.cache[tabId] = content;
            }

            // Insert content with smooth transition
            setTimeout(() => {
                contentArea.innerHTML = content;
                
                // Activate content and add animations
                const newContent = contentArea.querySelector('.tab-content');
                if (newContent) {
                    Utils.fadeIn(newContent);
                    newContent.classList.add('active');
                }
                
                // Emit content loaded event
                Utils.events.emit('contentLoaded', { tabId, content });
                
            }, 150); // Small delay for smooth UX

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = this.getErrorHTML(tabId);
        }
    },

    /**
     * Fetch content from HTML file
     * @param {string} tabId - Tab ID
     * @returns {Promise<string>} HTML content
     */
    async fetchContent(tabId) {
        const filePath = this.contentFiles[tabId];
        
        const response = await fetch(filePath);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}: ${response.status}`);
        }
        
        return await response.text();
    },

    /**
     * Load initial tab content
     */
    loadInitialTab() {
        // Check URL hash for initial tab
        const hash = window.location.hash.replace('#', '');
        const validTabs = Object.keys(this.contentFiles);
        const initialTab = validTabs.includes(hash) ? hash : 'summary';
        
        this.loadTabContent(initialTab);
    },

    /**
     * Get loading HTML
     * @returns {string} Loading HTML
     */
    getLoadingHTML() {
        return `
            <div class="loading-indicator">
                <div class="loading-spinner"></div>
                <p>Loading content...</p>
            </div>
        `;
    },

    /**
     * Get error HTML
     * @param {string} tabId - Tab ID that failed
     * @returns {string} Error HTML
     */
    getErrorHTML(tabId) {
        return `
            <div class="tab-content error-content active">
                <div class="section">
                    <div class="alert alert-warning">
                        <strong>Content Loading Error</strong><br>
                        Failed to load content for "${tabId}" tab. Please refresh the page and try again.
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Preload specific tab content
     * @param {string} tabId - Tab ID to preload
     */
    async preloadContent(tabId) {
        if (!this.cache[tabId] && this.contentFiles[tabId]) {
            try {
                this.cache[tabId] = await this.fetchContent(tabId);
                console.log(`Preloaded content for ${tabId}`);
            } catch (error) {
                console.warn(`Failed to preload ${tabId}:`, error);
            }
        }
    },

    /**
     * Preload all content (for better UX)
     */
    async preloadAllContent() {
        const preloadPromises = Object.keys(this.contentFiles).map(tabId => 
            this.preloadContent(tabId)
        );
        
        await Promise.allSettled(preloadPromises);
        console.log('Content preloading completed');
    },

    /**
     * Check if tab content exists
     * @param {string} tabId - ID of tab to check
     * @returns {boolean} True if tab exists
     */
    hasTabContent(tabId) {
        return this.contentFiles.hasOwnProperty(tabId);
    },

    /**
     * Clear content cache
     */
    clearCache() {
        this.cache = {};
        console.log('Content cache cleared');
    },

    /**
     * Get cache status
     * @returns {Object} Cache status information
     */
    getCacheStatus() {
        const totalTabs = Object.keys(this.contentFiles).length;
        const cachedTabs = Object.keys(this.cache).length;
        
        return {
            total: totalTabs,
            cached: cachedTabs,
            percentage: Math.round((cachedTabs / totalTabs) * 100),
            tabs: Object.keys(this.cache)
        };
    }
};