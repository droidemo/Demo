/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GlassOS - Premium SaaS Website Template
 * Version: 1.0.0
 * 
 * TABLE OF CONTENTS:
 * 1. Configuration
 * 2. DOM Elements
 * 3. Theme System
 * 4. Navigation
 * 5. Modal System
 * 6. Toast Notifications
 * 7. Animated Counters
 * 8. Pricing Calculator
 * 9. FAQ Accordion
 * 10. Testimonials Slider
 * 11. Charts (Pure JS Canvas)
 * 12. Scroll Animations
 * 13. Custom Cursor
 * 14. Floating Action Button
 * 15. Preloader
 * 16. Form Handling
 * 17. Utilities
 * 18. Initialization
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ═══════════════════════════════════════════════════════════════════════════
   1. CONFIGURATION
   Edit these values to customize the template
═══════════════════════════════════════════════════════════════════════════ */

const CONFIG = {
    // Theme settings
    defaultTheme: 'dark',
    saveThemePreference: true,
    
    // Animation settings
    revealThreshold: 0.15,
    revealDelay: 100,
    counterDuration: 2000,
    counterEasing: 'easeOutQuart',
    
    // Preloader
    preloaderMinDuration: 2000,
    
    // Toast notifications
    toastDuration: 4000,
    toastPosition: 'bottom-right',
    
    // Pricing calculator
    pricing: {
        basePrice: 29,
        pricePerThousandUsers: 5,
        minUsers: 1000,
        maxUsers: 100000
    },
    
    // Testimonials slider
    sliderAutoplay: true,
    sliderInterval: 5000,
    
    // Custom cursor
    enableCustomCursor: true,
    
    // Smooth scroll offset (for fixed header)
    scrollOffset: 80
};

/* ═══════════════════════════════════════════════════════════════════════════
   2. DOM ELEMENTS
═══════════════════════════════════════════════════════════════════════════ */

const DOM = {
    // Will be populated on init
};

function cacheDOMElements() {
    DOM.body = document.body;
    DOM.preloader = document.getElementById('preloader');
    DOM.header = document.getElementById('header');
    DOM.navToggle = document.getElementById('nav-toggle');
    DOM.navMenu = document.getElementById('nav-menu');
    DOM.mobileMenu = document.getElementById('mobile-menu');
    DOM.themeToggle = document.getElementById('theme-toggle');
    DOM.themeDropdown = document.getElementById('theme-dropdown');
    DOM.modalOverlay = document.getElementById('modal-overlay');
    DOM.toastContainer = document.getElementById('toast-container');
    DOM.fab = document.getElementById('fab');
    DOM.fabMenu = document.getElementById('fab-menu');
    DOM.cursor = document.getElementById('cursor');
    DOM.cursorFollower = document.getElementById('cursor-follower');
    DOM.usersSlider = document.getElementById('users-slider');
    DOM.currentUsers = document.getElementById('current-users');
    DOM.calculatedPrice = document.getElementById('calculated-price');
    DOM.testimonialsTrack = document.getElementById('testimonials-track');
    DOM.sliderPrev = document.getElementById('slider-prev');
    DOM.sliderNext = document.getElementById('slider-next');
    DOM.sliderDots = document.getElementById('slider-dots');
    DOM.newsletterForm = document.getElementById('newsletter-form');
    DOM.heroChart = document.getElementById('hero-chart');
    DOM.revenueChart = document.getElementById('revenue-chart');
    DOM.trafficChart = document.getElementById('traffic-chart');
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. THEME SYSTEM
═══════════════════════════════════════════════════════════════════════════ */

const ThemeSystem = {
    currentTheme: CONFIG.defaultTheme,
    
    init() {
        // Load saved theme or use default
        if (CONFIG.saveThemePreference) {
            const savedTheme = localStorage.getItem('glassOS-theme');
            if (savedTheme) {
                this.currentTheme = savedTheme;
            }
        }
        
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    },
    
    bindEvents() {
        // Theme toggle button
        DOM.themeToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            DOM.themeDropdown.classList.toggle('active');
        });
        
        // Theme options
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.applyTheme(theme);
                DOM.themeDropdown.classList.remove('active');
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-switcher')) {
                DOM.themeDropdown?.classList.remove('active');
            }
        });
    },
    
    applyTheme(theme) {
        this.currentTheme = theme;
        DOM.body.setAttribute('data-theme', theme);
        
        if (CONFIG.saveThemePreference) {
            localStorage.setItem('glassOS-theme', theme);
        }
        
        // Re-render charts with new theme colors
        if (window.Charts) {
            setTimeout(() => Charts.init(), 100);
        }
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   4. NAVIGATION
═══════════════════════════════════════════════════════════════════════════ */

const Navigation = {
    isMenuOpen: false,
    
    init() {
        this.bindEvents();
        this.handleScroll();
    },
    
    bindEvents() {
        // Mobile menu toggle
        DOM.navToggle?.addEventListener('click', () => this.toggleMenu());
        
        // Close menu on link click
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Scroll event for header
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.smoothScroll(e));
        });
    },
    
    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        DOM.navToggle.classList.toggle('active', this.isMenuOpen);
        DOM.mobileMenu.classList.toggle('active', this.isMenuOpen);
        DOM.body.classList.toggle('no-scroll', this.isMenuOpen);
    },
    
    closeMenu() {
        this.isMenuOpen = false;
        DOM.navToggle?.classList.remove('active');
        DOM.mobileMenu?.classList.remove('active');
        DOM.body.classList.remove('no-scroll');
    },
    
    handleScroll() {
        const scrollY = window.scrollY;
        DOM.header?.classList.toggle('scrolled', scrollY > 50);
    },
    
    smoothScroll(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const top = target.offsetTop - CONFIG.scrollOffset;
                window.scrollTo({
                    top,
                    behavior: 'smooth'
                });
                this.closeMenu();
            }
        }
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   5. MODAL SYSTEM
═══════════════════════════════════════════════════════════════════════════ */

const ModalSystem = {
    currentModal: null,
    
    init() {
        this.bindEvents();
    },
    
    bindEvents() {
        // Close on overlay click
        DOM.modalOverlay?.addEventListener('click', (e) => {
            if (e.target === DOM.modalOverlay) {
                this.close();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.close();
            }
        });
    },
    
    open(modalId) {
        const modal = document.getElementById(`modal-${modalId}`);
        if (!modal) return;
        
        // Close any open modal first
        if (this.currentModal) {
            this.currentModal.classList.remove('active');
        }
        
        this.currentModal = modal;
        modal.classList.add('active');
        DOM.modalOverlay.classList.add('active');
        DOM.body.classList.add('no-scroll');
    },
    
    close() {
        if (this.currentModal) {
            this.currentModal.classList.remove('active');
            DOM.modalOverlay.classList.remove('active');
            DOM.body.classList.remove('no-scroll');
            this.currentModal = null;
        }
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   6. TOAST NOTIFICATIONS
═══════════════════════════════════════════════════════════════════════════ */

const ToastSystem = {
    toasts: [],
    
    icons: {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
        warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
    },
    
    show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${this.icons[type]}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
        `;
        
        DOM.toastContainer.appendChild(toast);
        this.toasts.push(toast);
        
        // Bind close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.remove(toast);
        });
        
        // Auto remove
        setTimeout(() => {
            this.remove(toast);
        }, CONFIG.toastDuration);
    },
    
    remove(toast) {
        if (!toast.classList.contains('removing')) {
            toast.classList.add('removing');
            setTimeout(() => {
                toast.remove();
                this.toasts = this.toasts.filter(t => t !== toast);
            }, 300);
        }
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   7. ANIMATED COUNTERS
═══════════════════════════════════════════════════════════════════════════ */

const AnimatedCounters = {
    counters: [],
    observed: new Set(),
    
    init() {
        this.counters = document.querySelectorAll('.counter');
        this.setupObserver();
    },
    
    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observed.has(entry.target)) {
                    this.observed.add(entry.target);
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => observer.observe(counter));
    },
    
    animateCounter(element) {
        const target = parseInt(element.dataset.target, 10);
        const duration = CONFIG.counterDuration;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeOutQuart(progress);
            const current = Math.floor(eased * target);
            
            element.textContent = this.formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = this.formatNumber(target);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    },
    
    formatNumber(num) {
        if (num >= 1000) {
            return num.toLocaleString();
        }
        return num.toString();
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   8. PRICING CALCULATOR
═══════════════════════════════════════════════════════════════════════════ */

const PricingCalculator = {
    init() {
        if (!DOM.usersSlider) return;
        
        this.bindEvents();
        this.updatePrice();
    },
    
    bindEvents() {
        DOM.usersSlider.addEventListener('input', () => this.updatePrice());
    },
    
    updatePrice() {
        const users = parseInt(DOM.usersSlider.value, 10);
        const { basePrice, pricePerThousandUsers, minUsers } = CONFIG.pricing;
        
        // Calculate price based on users
        const additionalUsers = Math.max(0, users - minUsers);
        const additionalPrice = Math.floor(additionalUsers / 1000) * pricePerThousandUsers;
        const totalPrice = basePrice + additionalPrice;
        
        // Update display
        DOM.currentUsers.textContent = users.toLocaleString();
        
        // Animate price change
        this.animatePrice(totalPrice);
    },
    
    animatePrice(newPrice) {
        const currentPrice = parseInt(DOM.calculatedPrice.textContent, 10) || 0;
        const diff = newPrice - currentPrice;
        const duration = 300;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.round(currentPrice + diff * progress);
            
            DOM.calculatedPrice.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   9. FAQ ACCORDION
═══════════════════════════════════════════════════════════════════════════ */

const FAQAccordion = {
    init() {
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => this.toggle(question));
        });
    },
    
    toggle(question) {
        const item = question.closest('.faq-item');
        const isActive = item.classList.contains('active');
        
        // Close all items
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   10. TESTIMONIALS SLIDER
═══════════════════════════════════════════════════════════════════════════ */

const TestimonialsSlider = {
    currentIndex: 0,
    totalSlides: 0,
    slidesPerView: 3,
    autoplayInterval: null,
    
    init() {
        if (!DOM.testimonialsTrack) return;
        
        this.totalSlides = DOM.testimonialsTrack.children.length;
        this.updateSlidesPerView();
        this.createDots();
        this.bindEvents();
        
        if (CONFIG.sliderAutoplay) {
            this.startAutoplay();
        }
    },
    
    bindEvents() {
        DOM.sliderPrev?.addEventListener('click', () => this.prev());
        DOM.sliderNext?.addEventListener('click', () => this.next());
        
        window.addEventListener('resize', () => {
            this.updateSlidesPerView();
            this.goTo(this.currentIndex);
        });
        
        // Pause on hover
        DOM.testimonialsTrack?.addEventListener('mouseenter', () => this.stopAutoplay());
        DOM.testimonialsTrack?.addEventListener('mouseleave', () => {
            if (CONFIG.sliderAutoplay) this.startAutoplay();
        });
    },
    
    updateSlidesPerView() {
        if (window.innerWidth <= 768) {
            this.slidesPerView = 1;
        } else if (window.innerWidth <= 1024) {
            this.slidesPerView = 2;
        } else {
            this.slidesPerView = 3;
        }
    },
    
    createDots() {
        const maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
        DOM.sliderDots.innerHTML = '';
        
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('span');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goTo(i));
            DOM.sliderDots.appendChild(dot);
        }
    },
    
    goTo(index) {
        const maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
        this.currentIndex = Math.max(0, Math.min(index, maxIndex));
        
        const slideWidth = DOM.testimonialsTrack.children[0].offsetWidth;
        const gap = 32; // var(--space-xl)
        const offset = this.currentIndex * (slideWidth + gap);
        
        DOM.testimonialsTrack.style.transform = `translateX(-${offset}px)`;
        
        // Update dots
        document.querySelectorAll('#slider-dots .dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
    },
    
    prev() {
        this.goTo(this.currentIndex - 1);
    },
    
    next() {
        const maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
        if (this.currentIndex >= maxIndex) {
            this.goTo(0);
        } else {
            this.goTo(this.currentIndex + 1);
        }
    },
    
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.next(), CONFIG.sliderInterval);
    },
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   11. CHARTS (Pure JS Canvas)
═══════════════════════════════════════════════════════════════════════════ */

const Charts = {
    init() {
        this.drawHeroChart();
        this.drawRevenueChart();
        this.drawTrafficChart();
    },
    
    getThemeColors() {
        const style = getComputedStyle(document.body);
        return {
            primary: style.getPropertyValue('--accent-primary').trim() || '#6366f1',
            secondary: style.getPropertyValue('--accent-secondary').trim() || '#8b5cf6',
            text: style.getPropertyValue('--text-tertiary').trim() || 'rgba(255,255,255,0.5)',
            grid: style.getPropertyValue('--glass-border').trim() || 'rgba(255,255,255,0.1)'
        };
    },
    
    drawHeroChart() {
        const container = DOM.heroChart;
        if (!container) return;
        
        // Create canvas if not exists
        let canvas = container.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            container.appendChild(canvas);
        }
        
        const ctx = canvas.getContext('2d');
        const rect = container.getBoundingClientRect();
        
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(2, 2);
        
        const colors = this.getThemeColors();
        const width = rect.width;
        const height = rect.height;
        
        // Generate smooth data
        const points = 12;
        const data = [];
        for (let i = 0; i < points; i++) {
            data.push(30 + Math.random() * 60);
        }
        
        // Draw gradient area
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, colors.primary + '40');
        gradient.addColorStop(1, colors.primary + '00');
        
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        data.forEach((val, i) => {
            const x = (i / (points - 1)) * width;
            const y = height - (val / 100) * height;
            
            if (i === 0) {
                ctx.lineTo(x, y);
            } else {
                const prevX = ((i - 1) / (points - 1)) * width;
                const prevY = height - (data[i - 1] / 100) * height;
                const cpX = (prevX + x) / 2;
                ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
            }
        });
        
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw line
        ctx.beginPath();
        data.forEach((val, i) => {
            const x = (i / (points - 1)) * width;
            const y = height - (val / 100) * height;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                const prevX = ((i - 1) / (points - 1)) * width;
                const prevY = height - (data[i - 1] / 100) * height;
                const cpX = (prevX + x) / 2;
                ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
            }
        });
        
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw dots
        data.forEach((val, i) => {
            const x = (i / (points - 1)) * width;
            const y = height - (val / 100) * height;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = colors.primary;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    },
    
    drawRevenueChart() {
        const canvas = DOM.revenueChart;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(2, 2);
        
        const colors = this.getThemeColors();
        const width = rect.width;
        const height = rect.height;
        const padding = { top: 20, right: 20, bottom: 40, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        
        // Data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        const revenue = [45, 52, 48, 61, 55, 72, 89];
        const profit = [25, 32, 28, 41, 35, 52, 65];
        
        // Draw grid
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
            
            // Y-axis labels
            ctx.fillStyle = colors.text;
            ctx.font = '11px Inter';
            ctx.textAlign = 'right';
            ctx.fillText(`$${100 - i * 25}k`, padding.left - 10, y + 4);
        }
        
        // X-axis labels
        months.forEach((month, i) => {
            const x = padding.left + (chartWidth / (months.length - 1)) * i;
            ctx.fillStyle = colors.text;
            ctx.font = '11px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(month, x, height - 15);
        });
        
        // Draw revenue line
        this.drawLine(ctx, revenue, months.length, chartWidth, chartHeight, padding, colors.primary);
        
        // Draw profit line
        this.drawLine(ctx, profit, months.length, chartWidth, chartHeight, padding, '#22c55e');
    },
    
    drawLine(ctx, data, points, chartWidth, chartHeight, padding, color) {
        const maxVal = 100;
        
        // Draw gradient area
        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        gradient.addColorStop(0, color + '30');
        gradient.addColorStop(1, color + '00');
        
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top + chartHeight);
        
        data.forEach((val, i) => {
            const x = padding.left + (chartWidth / (points - 1)) * i;
            const y = padding.top + chartHeight - (val / maxVal) * chartHeight;
            
            if (i === 0) {
                ctx.lineTo(x, y);
            } else {
                const prevX = padding.left + (chartWidth / (points - 1)) * (i - 1);
                const prevY = padding.top + chartHeight - (data[i - 1] / maxVal) * chartHeight;
                const cpX = (prevX + x) / 2;
                ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
            }
        });
        
        ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw line
        ctx.beginPath();
        data.forEach((val, i) => {
            const x = padding.left + (chartWidth / (points - 1)) * i;
            const y = padding.top + chartHeight - (val / maxVal) * chartHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                const prevX = padding.left + (chartWidth / (points - 1)) * (i - 1);
                const prevY = padding.top + chartHeight - (data[i - 1] / maxVal) * chartHeight;
                const cpX = (prevX + x) / 2;
                ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
            }
        });
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        
        // Draw dots
        data.forEach((val, i) => {
            const x = padding.left + (chartWidth / (points - 1)) * i;
            const y = padding.top + chartHeight - (val / maxVal) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        });
    },
    
    drawTrafficChart() {
        const canvas = DOM.trafficChart;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(2, 2);
        
        const width = rect.width;
        const height = rect.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2.5;
        
        // Data
        const data = [
            { value: 45, color: '#6366f1' },
            { value: 30, color: '#8b5cf6' },
            { value: 25, color: '#a855f7' }
        ];
        
        const total = data.reduce((sum, d) => sum + d.value, 0);
        let startAngle = -Math.PI / 2;
        
        // Draw donut segments
        data.forEach(segment => {
            const sliceAngle = (segment.value / total) * Math.PI * 2;
            const endAngle = startAngle + sliceAngle;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.arc(centerX, centerY, radius * 0.6, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = segment.color;
            ctx.fill();
            
            startAngle = endAngle;
        });
        
        // Center text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('100%', centerX, centerY - 5);
        
        ctx.font = '12px Inter';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText('Traffic', centerX, centerY + 15);
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   12. SCROLL ANIMATIONS
═══════════════════════════════════════════════════════════════════════════ */

const ScrollAnimations = {
    init() {
        this.setupRevealAnimations();
        this.setupTiltEffect();
    },
    
    setupRevealAnimations() {
        const reveals = document.querySelectorAll('.reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: CONFIG.revealThreshold,
            rootMargin: '0px 0px -50px 0px'
        });
        
        reveals.forEach(el => observer.observe(el));
    },
    
    setupTiltEffect() {
        if ('ontouchstart' in window) return; // Disable on touch devices
        
        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   13. CUSTOM CURSOR
═══════════════════════════════════════════════════════════════════════════ */

const CustomCursor = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    
    init() {
        if (!CONFIG.enableCustomCursor) return;
        if ('ontouchstart' in window) return;
        
        this.bindEvents();
        this.animate();
    },
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });
        
        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, input, textarea, [data-tilt]');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                DOM.cursor?.classList.add('hover');
                DOM.cursorFollower?.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                DOM.cursor?.classList.remove('hover');
                DOM.cursorFollower?.classList.remove('hover');
            });
        });
    },
    
    animate() {
        // Smooth follow for cursor
        this.x += (this.targetX - this.x) * 0.2;
        this.y += (this.targetY - this.y) * 0.2;
        
        if (DOM.cursor) {
            DOM.cursor.style.left = this.targetX + 'px';
            DOM.cursor.style.top = this.targetY + 'px';
        }
        
        if (DOM.cursorFollower) {
            DOM.cursorFollower.style.left = this.x + 'px';
            DOM.cursorFollower.style.top = this.y + 'px';
        }
        
        requestAnimationFrame(() => this.animate());
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   14. FLOATING ACTION BUTTON
═══════════════════════════════════════════════════════════════════════════ */

const FloatingActionButton = {
    isOpen: false,
    
    init() {
        this.bindEvents();
    },
    
    bindEvents() {
        DOM.fab?.addEventListener('click', () => this.toggle());
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.fab') && !e.target.closest('.fab-menu')) {
                this.close();
            }
        });
    },
    
    toggle() {
        this.isOpen = !this.isOpen;
        DOM.fab?.classList.toggle('active', this.isOpen);
        DOM.fabMenu?.classList.toggle('active', this.isOpen);
    },
    
    close() {
        this.isOpen = false;
        DOM.fab?.classList.remove('active');
        DOM.fabMenu?.classList.remove('active');
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   15. PRELOADER
═══════════════════════════════════════════════════════════════════════════ */

const Preloader = {
    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                DOM.preloader?.classList.add('hidden');
                
                // Remove from DOM after animation
                setTimeout(() => {
                    DOM.preloader?.remove();
                }, 500);
            }, CONFIG.preloaderMinDuration);
        });
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   16. FORM HANDLING
═══════════════════════════════════════════════════════════════════════════ */

const FormHandling = {
    init() {
        // Newsletter form
        DOM.newsletterForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            ToastSystem.show(`Thanks for subscribing with ${email}!`, 'success');
            e.target.reset();
        });
    }
};

// Expose form handlers globally
window.GlassOS = {
    modal: ModalSystem,
    toast: ToastSystem,
    
    handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        ModalSystem.close();
        ToastSystem.show(`Welcome, ${name}! Your account has been created.`, 'success');
    },
    
    handleContact(e) {
        e.preventDefault();
        ModalSystem.close();
        ToastSystem.show('Message sent! We\'ll get back to you within 24 hours.', 'success');
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   17. UTILITIES
═══════════════════════════════════════════════════════════════════════════ */

const Utils = {
    // Debounce function
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
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Add ripple effect to buttons
    addRippleEffect() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.style.setProperty('--ripple-x', x + 'px');
                this.style.setProperty('--ripple-y', y + 'px');
                
                this.classList.remove('ripple');
                void this.offsetWidth; // Trigger reflow
                this.classList.add('ripple');
            });
        });
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   18. INITIALIZATION
═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    cacheDOMElements();
    
    // Initialize all modules
    Preloader.init();
    ThemeSystem.init();
    Navigation.init();
    ModalSystem.init();
    AnimatedCounters.init();
    PricingCalculator.init();
    FAQAccordion.init();
    TestimonialsSlider.init();
    ScrollAnimations.init();
    CustomCursor.init();
    FloatingActionButton.init();
    FormHandling.init();
    Utils.addRippleEffect();
    
    // Initialize charts after a short delay
    setTimeout(() => {
        Charts.init();
        window.Charts = Charts;
    }, 100);
    
    // Resize handler for charts
    window.addEventListener('resize', Utils.debounce(() => {
        Charts.init();
    }, 250));
    
    // Demo tab navigation
    document.querySelectorAll('.demo-nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.demo-nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            ToastSystem.show(`Switched to ${btn.dataset.tab} view`, 'info');
        });
    });
});

// Log initialization
console.log('%c GlassOS Template Loaded ', 'background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 10px 20px; border-radius: 5px; font-weight: bold;');
