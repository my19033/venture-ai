// script.js - VENTURE AI ANA JAVASCRIPT
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthStatus();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize smooth scroll
    initSmoothScroll();
});

// Check authentication status
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('ventureAI_loggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Protected pages
    const protectedPages = ['dashboard.html', 'profile.html'];
    
    if (protectedPages.includes(currentPage) && !isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    // If already logged in, redirect from login/register to dashboard
    if ((currentPage === 'login.html' || currentPage === 'register.html') && isLoggedIn) {
        window.location.href = 'dashboard.html';
        return;
    }
}

// Initialize mobile menu
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            
            if (window.innerWidth <= 768) {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'white';
                navLinks.style.padding = '2rem';
                navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                navLinks.style.zIndex = '1000';
            }
        });
        
        // Reset menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'row';
                navLinks.style.position = 'static';
                navLinks.style.background = 'transparent';
                navLinks.style.padding = '0';
                navLinks.style.boxShadow = 'none';
            }
        });
    }
}

// Initialize smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    const navLinks = document.querySelector('.nav-links');
                    if (navLinks) navLinks.style.display = 'none';
                }
            }
        });
    });
}

// Logout function
function logout() {
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
        localStorage.removeItem('ventureAI_loggedIn');
        localStorage.removeItem('ventureAI_token');
        window.location.href = 'index.html';
    }
}

// Get current user
function getCurrentUser() {
    try {
        const userData = localStorage.getItem('ventureAI_user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Kullanıcı bilgisi alma hatası:', error);
        return null;
    }
}

// Update user data
function updateUserData(key, value) {
    try {
        const userData = getCurrentUser();
        if (userData) {
            userData[key] = value;
            localStorage.setItem('ventureAI_user', JSON.stringify(userData));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Kullanıcı verisi güncelleme hatası:', error);
        return false;
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
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
`;
document.head.appendChild(notificationStyles);

// Make functions globally available
window.checkAuthStatus = checkAuthStatus;
window.initMobileMenu = initMobileMenu;
window.initSmoothScroll = initSmoothScroll;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.updateUserData = updateUserData;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.showNotification = showNotification;