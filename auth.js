// auth.js - VENTURE AI AUTHENTICATION
class Auth {
    constructor() {
        this.user = null;
        this.init();
    }
    
    init() {
        // Load user from localStorage
        this.loadUser();
        
        // Check authentication status on page load
        this.checkAuth();
    }
    
    loadUser() {
        try {
            const userData = localStorage.getItem('ventureAI_user');
            if (userData) {
                this.user = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Kullanıcı yükleme hatası:', error);
            this.user = null;
        }
    }
    
    saveUser(userData) {
        try {
            this.user = userData;
            localStorage.setItem('ventureAI_user', JSON.stringify(userData));
            localStorage.setItem('ventureAI_loggedIn', 'true');
            return true;
        } catch (error) {
            console.error('Kullanıcı kaydetme hatası:', error);
            return false;
        }
    }
    
    checkAuth() {
        const isLoggedIn = localStorage.getItem('ventureAI_loggedIn');
        const currentPage = window.location.pathname.split('/').pop();
        
        // Protected pages that require login
        const protectedPages = ['dashboard.html', 'profile.html'];
        
        if (protectedPages.includes(currentPage) && !isLoggedIn) {
            window.location.href = 'login.html';
            return false;
        }
        
        // If already logged in, redirect from login/register to dashboard
        if ((currentPage === 'login.html' || currentPage === 'register.html') && isLoggedIn) {
            window.location.href = 'dashboard.html';
            return false;
        }
        
        return true;
    }
    
    async register(userData) {
        try {
            // Validate required fields
            if (!userData.fullName || !userData.email || !userData.password) {
                throw new Error('Lütfen tüm zorunlu alanları doldurun.');
            }
            
            if (userData.password.length < 8) {
                throw new Error('Şifre en az 8 karakter olmalıdır.');
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Lütfen geçerli bir e-posta adresi girin.');
            }
            
            // Add timestamp
            userData.createdAt = new Date().toISOString();
            userData.updatedAt = new Date().toISOString();
            
            // Save user
            const saved = this.saveUser(userData);
            if (!saved) {
                throw new Error('Kullanıcı kaydedilemedi.');
            }
            
            // Generate demo token
            localStorage.setItem('ventureAI_token', 'demo_token_' + Date.now());
            
            return {
                success: true,
                message: 'Kayıt başarılı!',
                user: userData
            };
            
        } catch (error) {
            console.error('Kayıt hatası:', error);
            return {
                success: false,
                message: error.message || 'Kayıt sırasında bir hata oluştu.'
            };
        }
    }
    
    async login(email, password) {
        try {
            // Demo users
            const demoUsers = [
                { email: 'demo@ventureai.com', password: 'demo123', name: 'Demo Kullanıcı' },
                { email: 'test@test.com', password: 'test123', name: 'Test Kullanıcı' }
            ];
            
            // Check saved user
            const savedUser = localStorage.getItem('ventureAI_user');
            if (savedUser) {
                const userData = JSON.parse(savedUser);
                if (userData.email === email && userData.password === password) {
                    this.saveUser(userData);
                    return {
                        success: true,
                        message: 'Giriş başarılı!',
                        user: userData
                    };
                }
            }
            
            // Check demo users
            const demoUser = demoUsers.find(u => u.email === email && u.password === password);
            if (demoUser) {
                this.saveUser(demoUser);
                return {
                    success: true,
                    message: 'Giriş başarılı!',
                    user: demoUser
                };
            }
            
            throw new Error('E-posta veya şifre hatalı.');
            
        } catch (error) {
            console.error('Giriş hatası:', error);
            return {
                success: false,
                message: error.message || 'Giriş sırasında bir hata oluştu.'
            };
        }
    }
    
    logout() {
        try {
            this.user = null;
            localStorage.removeItem('ventureAI_loggedIn');
            localStorage.removeItem('ventureAI_token');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Çıkış hatası:', error);
            window.location.href = 'index.html';
        }
    }
    
    isLoggedIn() {
        return localStorage.getItem('ventureAI_loggedIn') === 'true';
    }
    
    getCurrentUser() {
        return this.user;
    }
    
    updateProfile(updates) {
        try {
            if (!this.user) {
                throw new Error('Kullanıcı bulunamadı.');
            }
            
            // Merge updates
            this.user = { ...this.user, ...updates, updatedAt: new Date().toISOString() };
            
            // Save updated user
            localStorage.setItem('ventureAI_user', JSON.stringify(this.user));
            
            return {
                success: true,
                message: 'Profil güncellendi.',
                user: this.user
            };
            
        } catch (error) {
            console.error('Profil güncelleme hatası:', error);
            return {
                success: false,
                message: error.message || 'Profil güncellenirken bir hata oluştu.'
            };
        }
    }
}

// Create global auth instance
window.auth = new Auth();

// Make auth methods globally available
window.registerUser = (userData) => window.auth.register(userData);
window.loginUser = (email, password) => window.auth.login(email, password);
window.logoutUser = () => window.auth.logout();
window.getCurrentUser = () => window.auth.getCurrentUser();
window.updateUserProfile = (updates) => window.auth.updateProfile(updates);
window.isLoggedIn = () => window.auth.isLoggedIn();