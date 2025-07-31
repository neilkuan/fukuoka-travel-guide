// Global variables for easier access
let currentPage = 'home';
let currentDay = 'day1';

// Navigation functions
function showPage(pageId) {
    console.log(`Navigating to page: ${pageId}`);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
        console.log(`Successfully navigated to: ${pageId}`);
    } else {
        console.error(`Page not found: ${pageId}`);
        return;
    }

    // Update navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === pageId) {
            btn.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Show success notification
    const pageNames = {
        'home': '首頁',
        'itinerary': '每日行程',
        'categories': '分類資訊',
        'practical': '實用資訊'
    };
    
    if (pageNames[pageId]) {
        showNotification(`已切換到${pageNames[pageId]}頁面`, 'success');
    }

    // Trigger animations for the new page
    triggerPageAnimations(pageId);
}

function showDay(dayId) {
    console.log(`Switching to day: ${dayId}`);
    
    // Hide all day contents
    const dayContents = document.querySelectorAll('.day-content');
    dayContents.forEach(content => {
        content.classList.remove('active');
    });

    // Show selected day content
    const targetDay = document.getElementById(dayId);
    if (targetDay) {
        targetDay.classList.add('active');
        currentDay = dayId;
        console.log(`Successfully switched to: ${dayId}`);
    } else {
        console.error(`Day content not found: ${dayId}`);
        return;
    }

    // Update day tabs
    const dayTabs = document.querySelectorAll('.day-tab');
    dayTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-day') === dayId) {
            tab.classList.add('active');
        }
    });

    // Show success notification
    const dayNames = {
        'day1': '第1天 (8/3)',
        'day2': '第2天 (8/4)', 
        'day3': '第3天 (8/5)',
        'day4': '第4天 (8/6)'
    };
    
    if (dayNames[dayId]) {
        showNotification(`已切換到${dayNames[dayId]}`, 'info');
    }

    // Smooth scroll to day content
    setTimeout(() => {
        const dayHeader = targetDay.querySelector('.day-header');
        if (dayHeader) {
            dayHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}

// Google Maps integration
function openGoogleMaps(locationName, address) {
    try {
        console.log(`Opening Google Maps for: ${locationName} at ${address}`);
        
        // Encode the search query
        const searchQuery = encodeURIComponent(`${locationName}, ${address}`);
        
        // Create Google Maps URL
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
        
        // Open in new tab
        const newWindow = window.open(mapsUrl, '_blank', 'noopener,noreferrer');
        
        if (newWindow) {
            showNotification(`正在開啟 ${locationName} 的地圖...`, 'info');
        } else {
            showNotification('請允許彈出視窗以開啟地圖', 'warning');
        }
        
    } catch (error) {
        console.error('Error opening Google Maps:', error);
        showNotification('無法開啟地圖，請稍後再試', 'error');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        fontSize: '14px',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#1FB8CD';
            break;
        case 'error':
            notification.style.backgroundColor = '#E53935';
            break;
        case 'warning':
            notification.style.backgroundColor = '#FFB300';
            notification.style.color = '#1A1A2E';
            break;
        default:
            notification.style.backgroundColor = '#1E88E5';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Animation functions
function triggerPageAnimations(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;

    // Add entrance animation class
    page.style.opacity = '0';
    page.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        page.style.transition = 'all 0.5s ease';
        page.style.opacity = '1';
        page.style.transform = 'translateY(0)';
    }, 50);

    // Animate cards with stagger effect
    const cards = page.querySelectorAll('.info-card, .overview-card, .category-section, .practical-card, .location-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}

// Application class
class FukuokaTravelApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('Initializing Fukuoka Travel App...');
        this.setupEventListeners();
        this.setupDayTabs();
        this.addScrollAnimations();
        this.enhanceLocationCards();
        
        // Ensure home page is shown initially
        showPage('home');
        
        console.log('App initialization complete');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation buttons (using data-page attribute)
        document.addEventListener('click', (e) => {
            // Handle navigation buttons
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                console.log(`Nav/CTA button clicked: ${page}`);
                if (page) {
                    showPage(page);
                }
            }
            
            // Handle day tabs
            if (e.target.matches('[data-day]')) {
                e.preventDefault();
                const day = e.target.getAttribute('data-day');
                console.log(`Day tab clicked: ${day}`);
                if (day) {
                    showDay(day);
                }
            }
            
            // Handle map buttons
            if (e.target.matches('[data-location]')) {
                e.preventDefault();
                const location = e.target.getAttribute('data-location');
                const address = e.target.getAttribute('data-address');
                console.log(`Map button clicked: ${location}`);
                if (location && address) {
                    openGoogleMaps(location, address);
                }
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        console.log('Event listeners setup complete');
    }

    setupDayTabs() {
        // Ensure first day is shown by default when on itinerary page
        showDay('day1');
    }

    handleKeyboardNavigation(e) {
        // Navigation shortcuts
        if (e.altKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    showPage('home');
                    break;
                case '2':
                    e.preventDefault();
                    showPage('itinerary');
                    break;
                case '3':
                    e.preventDefault();
                    showPage('categories');
                    break;
                case '4':
                    e.preventDefault();
                    showPage('practical');
                    break;
            }
        }

        // Day navigation in itinerary page
        if (currentPage === 'itinerary' && e.key >= '1' && e.key <= '4') {
            e.preventDefault();
            showDay(`day${e.key}`);
        }

        // Escape key to go back to home
        if (e.key === 'Escape') {
            showPage('home');
        }
    }

    addScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Add a subtle entrance animation
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                }
            });
        }, observerOptions);

        // Observe timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.style.transform = 'translateY(20px)';
            item.style.opacity = '0.8';
            item.style.transition = 'all 0.6s ease';
            observer.observe(item);
        });

        // Observe category items
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            observer.observe(item);
        });
    }

    enhanceLocationCards() {
        const locationCards = document.querySelectorAll('.location-card');
        
        locationCards.forEach(card => {
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px) scale(1.02)';
                card.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
            
            // Add keyboard navigation
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const mapBtn = card.querySelector('.map-btn');
                    if (mapBtn) {
                        mapBtn.click();
                    }
                }
            });
        });
    }
}

// Utility functions
function formatCurrency(amount, currency = 'JPY') {
    try {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0
        }).format(amount);
    } catch (error) {
        return `¥${amount.toLocaleString()}`;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Helper function to check if user prefers reduced motion
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Optimize animations based on user preferences
function optimizeAnimations() {
    if (prefersReducedMotion()) {
        // Disable complex animations for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    showNotification('發生未預期的錯誤，請重新整理頁面', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('載入資料時發生錯誤', 'error');
});

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM loaded, initializing application...');
        
        // Optimize animations based on user preferences
        optimizeAnimations();
        
        // Initialize main application
        const app = new FukuokaTravelApp();
        window.fukuokaApp = app; // Store reference for debugging
        
        // Show success message
        setTimeout(() => {
            showNotification('福岡旅行規劃載入完成！🎌', 'success');
        }, 1000);
        
        console.log('Fukuoka Travel App initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showNotification('應用程式初始化失敗，請重新整理頁面', 'error');
    }
});

// Make functions globally available for debugging
window.showPage = showPage;
window.showDay = showDay;
window.openGoogleMaps = openGoogleMaps;
window.showNotification = showNotification;

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        console.log('Service Worker support detected - ready for PWA implementation');
    });
}

// Additional utility function for future enhancements
function trackUserAction(action, details = {}) {
    console.log(`User action: ${action}`, details);
    // This could be connected to analytics in the future
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FukuokaTravelApp,
        showPage,
        showDay,
        openGoogleMaps,
        showNotification,
        formatCurrency,
        debounce
    };
}