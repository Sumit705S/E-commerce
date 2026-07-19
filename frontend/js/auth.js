// frontend/js/auth.js
// Authentication Module

class Auth {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        this.isAuthenticated = !!this.token;
        this.authMode = 'login';
    }

    // Initialize auth state
    init() {
        if (this.isAuthenticated) {
            this.updateUI();
            this.loadUserData();
        }
        this.setupEventListeners();
    }

    // Setup auth event listeners
    setupEventListeners() {
        // Auth icon click
        document.getElementById('authIcon')?.addEventListener('click', () => {
            if (this.isAuthenticated) {
                window.navigateTo('profile');
            } else {
                this.openModal('login');
            }
        });

        // Auth modal events
        document.getElementById('authClose')?.addEventListener('click', () => this.closeModal());
        document.getElementById('authSubmit')?.addEventListener('click', () => this.handleAuth());
        document.getElementById('authToggle')?.addEventListener('click', () => this.toggleMode());

        // Close modal on overlay click
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });

        // Logout button (if exists in profile)
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
    }

    // Open auth modal
    openModal(mode = 'login') {
        this.authMode = mode;
        const modal = document.getElementById('authModal');
        const title = document.getElementById('authTitle');
        const submit = document.getElementById('authSubmit');
        const toggle = document.getElementById('authToggle');
        const status = document.getElementById('authStatus');
        const otpSection = document.getElementById('otpSectionAuth');

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        title.textContent = mode === 'login' ? 'Sign In' : 'Create Account';
        submit.textContent = mode === 'login' ? 'Sign In' : 'Sign Up';
        toggle.textContent = mode === 'login' 
            ? "Don't have an account? Sign Up" 
            : "Already have an account? Sign In";

        document.getElementById('authEmail').value = mode === 'login' ? 'demo@user.com' : '';
        document.getElementById('authPassword').value = mode === 'login' ? 'demo123' : '';
        document.getElementById('authOtp').value = '';
        otpSection.classList.remove('active');

        status.textContent = mode === 'login' ? 'Enter your credentials' : 'Create your account';
        status.style.color = '#888';
    }

    // Close auth modal
    closeModal() {
        document.getElementById('authModal').classList.remove('active');
        document.body.style.overflow = '';
    }

    // Toggle between login and signup
    toggleMode() {
        const newMode = this.authMode === 'login' ? 'signup' : 'login';
        this.openModal(newMode);
    }

    // Handle authentication
    async handleAuth() {
        const email = document.getElementById('authEmail').value.trim();
        const password = document.getElementById('authPassword').value.trim();
        const status = document.getElementById('authStatus');

        if (!email || !password) {
            status.textContent = '⚠️ Please fill in all fields';
            status.style.color = '#c0392b';
            return;
        }

        try {
            let data;
            if (this.authMode === 'login') {
                data = await API.AuthAPI.login(email, password);
            } else {
                const name = email.split('@')[0];
                data = await API.AuthAPI.register({ name, email, password });
            }

            this.token = data.token;
            this.user = data.user;
            this.isAuthenticated = true;

            localStorage.setItem('authToken', this.token);
            localStorage.setItem('currentUser', JSON.stringify(this.user));

            this.updateUI();
            await this.loadUserData();
            this.closeModal();
            
            window.showToast(`👋 Welcome ${this.user.name}!`);
            
            // Redirect to home if on auth page
            if (window.currentPage === 'login' || window.currentPage === 'register') {
                window.navigateTo('home');
            }
        } catch (error) {
            status.textContent = `❌ ${error.message}`;
            status.style.color = '#c0392b';
        }
    }

    // Load user data after authentication
    async loadUserData() {
        try {
            const cartData = await API.CartAPI.getCart();
            window.cart = cartData.cart?.items || [];
            window.updateCartBadge();

            const ordersData = await API.OrderAPI.getOrders();
            window.orders = ordersData.orders || [];

            const profileData = await API.AuthAPI.getProfile();
            window.currentUser = profileData.user;

            this.updateUI();
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }

    // Logout
    async logout() {
        try {
            await API.AuthAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }

        this.token = null;
        this.user = null;
        this.isAuthenticated = false;

        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');

        window.cart = [];
        window.orders = [];
        window.wishlist = [];
        window.currentUser = null;

        this.updateUI();
        window.updateCartBadge();
        window.showToast('👋 Logged out successfully');
        window.navigateTo('home');
    }

    // Update UI based on auth state
    updateUI() {
        const userDisplay = document.getElementById('userDisplay');
        const userName = document.getElementById('userNameDisplay');
        const authIcon = document.getElementById('authIcon');

        if (this.isAuthenticated && this.user) {
            userDisplay.style.display = 'flex';
            userName.textContent = this.user.name;
            authIcon.style.display = 'none';
        } else {
            userDisplay.style.display = 'none';
            authIcon.style.display = 'block';
        }
    }

    // Check if user is admin
    isAdmin() {
        return this.isAuthenticated && this.user && this.user.id === 1;
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Get auth token
    getToken() {
        return this.token;
    }
}

// Initialize auth
const auth = new Auth();
window.auth = auth;

// Export for global use
window.isLoggedIn = () => auth.isAuthenticated;
window.currentUser = auth.user;