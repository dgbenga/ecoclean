// ===================================
// ECOCLEAN - IMPROVED JAVASCRIPT
// ===================================

// ===================================
// FORM VALIDATION & SUBMISSION
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeFormValidation();
    initializeSmoothScroll();
    initializeNavbarCollapse();
    loadProductsFromStorage();
});

/**
 * Initialize form validation for all forms
 */
function initializeFormValidation() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const contactForm = document.getElementById('contactForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Handle login form submission
 */
function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    clearError('loginEmailError');
    clearError('loginPasswordError');
    
    let isValid = true;

    if (!email) {
        showError('loginEmailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('loginEmailError', 'Please enter a valid email');
        isValid = false;
    }

    if (!password) {
        showError('loginPasswordError', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('loginPasswordError', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (isValid) {
        const userData = {
            email: email,
            loginTime: new Date().toLocaleString()
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        showSuccessAlert('Login Successful', `Welcome back, ${email}!`);
        
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (loginModal) loginModal.hide();
        
        this.reset();
    }
}

/**
 * Handle signup form submission
 */
function handleSignupSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    clearError('signupNameError');
    clearError('signupEmailError');
    clearError('signupPasswordError');
    
    let isValid = true;

    if (!name) {
        showError('signupNameError', 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        showError('signupNameError', 'Name must be at least 2 characters');
        isValid = false;
    }

    if (!email) {
        showError('signupEmailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('signupEmailError', 'Please enter a valid email');
        isValid = false;
    }

    if (!password) {
        showError('signupPasswordError', 'Password is required');
        isValid = false;
    } else if (password.length < 8) {
        showError('signupPasswordError', 'Password must be at least 8 characters');
        isValid = false;
    }

    if (!agreeTerms) {
        showErrorAlert('Terms Required', 'You must agree to the Terms and Conditions');
        isValid = false;
    }

    if (isValid) {
        const userData = {
            name: name,
            email: email,
            joinDate: new Date().toLocaleString()
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        showSuccessAlert('Account Created!', `Welcome, ${name}! Your account has been created successfully.`);
        
        const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
        if (signupModal) signupModal.hide();
        
        this.reset();
    }
}

/**
 * Handle contact form submission
 */
function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    clearError('nameError');
    clearError('emailError');
    clearError('subjectError');
    clearError('messageError');
    
    let isValid = true;

    if (!name) {
        showError('nameError', 'Name is required');
        isValid = false;
    }

    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email');
        isValid = false;
    }

    if (!subject) {
        showError('subjectError', 'Subject is required');
        isValid = false;
    }

    if (!message) {
        showError('messageError', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters');
        isValid = false;
    }

    if (isValid) {
        const messageData = {
            name: name,
            email: email,
            subject: subject,
            message: message,
            timestamp: new Date().toLocaleString()
        };
        
        let messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.push(messageData);
        localStorage.setItem('messages', JSON.stringify(messages));
        
        showSuccessAlert('Message Sent!', 'Thank you for contacting us. We will get back to you soon.');
        
        this.reset();
    }
}

/**
 * Show error message
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
    }
}

/**
 * Clear error message
 */
function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.add('d-none');
    }
}

// ===================================
// PRODUCT FUNCTIONALITY
// ===================================

/**
 * Show product details in sweet alert
 */
function showProductDetail(productName, productDescription) {
    swal({
        title: productName,
        text: productDescription,
        type: 'info',
        confirmButtonText: 'Add to Cart',
        cancelButtonText: 'Close',
        showCancelButton: true
    }, function(isConfirm) {
        if (isConfirm) {
            addToCart(productName);
        }
    });
}

/**
 * Add product to cart
 */
function addToCart(productName) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            quantity: 1,
            addedAt: new Date().toLocaleString()
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showSuccessAlert('Added to Cart', `${productName} has been added to your cart!`);
}

/**
 * Load products from storage (demo function)
 */
function loadProductsFromStorage() {
    console.log('Products loaded');
}

// ===================================
// UI NOTIFICATIONS
// ===================================

/**
 * Show success alert
 */
function showSuccessAlert(title, message) {
    swal({
        title: title,
        text: message,
        type: 'success',
        confirmButtonText: 'OK',
        timer: 3000
    });
}

/**
 * Show error alert
 */
function showErrorAlert(title, message) {
    swal({
        title: title,
        text: message,
        type: 'error',
        confirmButtonText: 'OK'
    });
}

/**
 * Show info alert
 */
function showInfoAlert(title, message) {
    swal({
        title: title,
        text: message,
        type: 'info',
        confirmButtonText: 'OK'
    });
}

// ===================================
// NAVIGATION
// ===================================

/**
 * Initialize smooth scroll
 */
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Close navbar when link is clicked
 */
function initializeNavbarCollapse() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarToggler.offsetParent !== null) {
                navbarToggler.click();
            }
        });
    });
}

// ===================================
// SCROLL EFFECTS
// ===================================

/**
 * Add scroll effects to navbar
 */
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('nav');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
    }
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Get current user from storage
 */
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
}

/**
 * Logout current user
 */
function logout() {
    localStorage.removeItem('currentUser');
    showSuccessAlert('Logged Out', 'You have been logged out successfully.');
    location.reload();
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Debounce function for performance
 */
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

// ===================================
// INITIALIZATION LOGS
// ===================================

console.log('EcoCLean Website Initialized');
console.log('Current User:', getCurrentUser());
console.log('Cart Items:', JSON.parse(localStorage.getItem('cart') || '[]'));