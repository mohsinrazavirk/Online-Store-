// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Global State
let currentUser = null;
let cart = { items: [], total: 0 };
let products = [];

// DOM Elements
const cartModal = document.getElementById('cart-modal');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const productModal = document.getElementById('product-modal');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadProducts();
    loadFeaturedProducts();
});

function initializeApp() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
        currentUser = JSON.parse(localStorage.getItem('user'));
        updateAuthUI();
    }
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

function setupEventListeners() {
    // Modal controls
    setupModalControls();
    
    // Navigation
    setupNavigation();
    
    // Forms
    setupForms();
    
    // Product filters
    setupProductFilters();
    
    // Cart controls
    setupCartControls();
    
    // Mobile menu
    setupMobileMenu();
}

function setupModalControls() {
    // Close modals when clicking X
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

function setupNavigation() {
    // Login button
    document.getElementById('login-btn').addEventListener('click', function() {
        loginModal.style.display = 'block';
    });
    
    // Register button
    document.getElementById('register-btn').addEventListener('click', function() {
        registerModal.style.display = 'block';
    });
    
    // Cart button
    document.querySelector('a[href="#cart"]').addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.style.display = 'block';
    });
}

function setupForms() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('register-form').addEventListener('submit', handleRegister);
}

function setupProductFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons in the same section
            const parentSection = this.closest('.products-section');
            parentSection.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter products
            const category = this.dataset.category;
            const subcategory = this.dataset.subcategory;
            filterProducts(category, subcategory);
        });
    });
}

function setupCartControls() {
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.items.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        showNotification('Checkout functionality would be implemented here!', 'info');
    });
    
    // Clear cart button
    document.getElementById('clear-cart-btn').addEventListener('click', function() {
        if (confirm('Are you sure you want to clear your cart?')) {
            clearCart();
        }
    });
}

function setupMobileMenu() {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// API Functions
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options
    };
    
    if (currentUser && currentUser.token) {
        config.headers.Authorization = `Bearer ${currentUser.token}`;
    }
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Product Functions
async function loadProducts() {
    try {
        const data = await apiRequest('/products');
        products = data.products;
        displayProducts('male-products', products.filter(p => p.category === 'male'));
        displayProducts('female-products', products.filter(p => p.category === 'female'));
    } catch (error) {
        console.error('Error loading products:', error);
        // Load sample data if API fails
        loadSampleProducts();
    }
}

async function loadFeaturedProducts() {
    try {
        const data = await apiRequest('/products?featured=true&limit=6');
        displayProducts('featured-products', data.products);
    } catch (error) {
        console.error('Error loading featured products:', error);
        // Load sample featured products
        const featuredProducts = products.filter(p => p.featured).slice(0, 6);
        displayProducts('featured-products', featuredProducts);
    }
}

function displayProducts(containerId, productList) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (productList.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; font-size: 1.2rem;">No products found</p>';
        return;
    }
    
    productList.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.images[0] || 'https://via.placeholder.com/300x300?text=No+Image'}" 
             alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="btn btn-primary btn-small" onclick="viewProduct('${product._id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
                <button class="btn btn-secondary btn-small" onclick="addToCart('${product._id}')">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    return card;
}

function filterProducts(category, subcategory) {
    let filteredProducts = products;
    
    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (subcategory) {
        filteredProducts = filteredProducts.filter(p => p.subcategory === subcategory);
    }
    
    if (category === 'male') {
        displayProducts('male-products', filteredProducts);
    } else if (category === 'female') {
        displayProducts('female-products', filteredProducts);
    }
}

function viewProduct(productId) {
    const product = products.find(p => p._id === productId);
    if (!product) return;
    
    // Populate product modal
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-image').src = product.images[0] || 'https://via.placeholder.com/400x400?text=No+Image';
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    
    // Populate size options
    const sizeSelect = document.getElementById('product-size');
    sizeSelect.innerHTML = '<option value="">Select Size</option>';
    product.sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });
    
    // Populate color options
    const colorSelect = document.getElementById('product-color');
    colorSelect.innerHTML = '<option value="">Select Color</option>';
    product.colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        colorSelect.appendChild(option);
    });
    
    // Set up add to cart button
    document.getElementById('add-to-cart-btn').onclick = () => {
        const size = sizeSelect.value;
        const color = colorSelect.value;
        const quantity = parseInt(document.getElementById('product-quantity').value);
        
        if (!size || !color) {
            showNotification('Please select size and color', 'error');
            return;
        }
        
        addToCart(productId, quantity, size, color);
        productModal.style.display = 'none';
    };
    
    productModal.style.display = 'block';
}

// Cart Functions
async function addToCart(productId, quantity = 1, size = '', color = '') {
    try {
        if (!currentUser) {
            showNotification('Please login to add items to cart', 'warning');
            loginModal.style.display = 'block';
            return;
        }
        
        const response = await apiRequest('/cart/add', {
            method: 'POST',
            body: JSON.stringify({
                userId: currentUser.id,
                productId: productId,
                quantity: quantity,
                size: size,
                color: color
            })
        });
        
        cart = response;
        updateCartUI();
        saveCartToStorage();
        
        // Show success message
        showNotification('Product added to cart!', 'success');
    } catch (error) {
        console.error('Error adding to cart:', error);
        // Fallback to local cart
        addToLocalCart(productId, quantity, size, color);
    }
}

function addToLocalCart(productId, quantity = 1, size = '', color = '') {
    const product = products.find(p => p._id === productId);
    if (!product) return;
    
    const existingItem = cart.items.find(item => 
        item.productId === productId && 
        item.size === size && 
        item.color === color
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            productId: productId,
            product: product,
            quantity: quantity,
            size: size,
            color: color,
            price: product.price
        });
    }
    
    updateCartTotal();
    updateCartUI();
    saveCartToStorage();
    showNotification('Product added to cart!', 'success');
}

function updateCartTotal() {
    cart.total = cart.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
}

function updateCartUI() {
    // Update cart count
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.items.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Your cart is empty</p>';
    } else {
        cart.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.product.images[0] || 'https://via.placeholder.com/80x80?text=No+Image'}" 
                     alt="${item.product.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.product.name}</div>
                    <div class="cart-item-details">
                        Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity}
                    </div>
                </div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="btn btn-outline btn-small" onclick="removeFromCart('${item.productId}', '${item.size}', '${item.color}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Update cart total
    cartTotal.textContent = cart.total.toFixed(2);
}

function removeFromCart(productId, size, color) {
    cart.items = cart.items.filter(item => 
        !(item.productId === productId && item.size === size && item.color === color)
    );
    
    updateCartTotal();
    updateCartUI();
    saveCartToStorage();
    showNotification('Item removed from cart', 'info');
}

function clearCart() {
    cart = { items: [], total: 0 };
    updateCartUI();
    saveCartToStorage();
    cartModal.style.display = 'none';
    showNotification('Cart cleared', 'info');
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await apiRequest('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        currentUser = {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            token: response.token
        };
        
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('token', response.token);
        
        updateAuthUI();
        loginModal.style.display = 'none';
        showNotification('Login successful!', 'success');
        
        // Clear form
        document.getElementById('login-form').reset();
    } catch (error) {
        showNotification('Login failed: ' + error.message, 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const phone = document.getElementById('register-phone').value;
    
    try {
        const response = await apiRequest('/users/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, phone })
        });
        
        currentUser = {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            token: response.token
        };
        
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('token', response.token);
        
        updateAuthUI();
        registerModal.style.display = 'none';
        showNotification('Registration successful!', 'success');
        
        // Clear form
        document.getElementById('register-form').reset();
    } catch (error) {
        showNotification('Registration failed: ' + error.message, 'error');
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    
    if (currentUser) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        loginBtn.onclick = logout;
        registerBtn.style.display = 'none';
    } else {
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        loginBtn.onclick = () => loginModal.style.display = 'block';
        registerBtn.style.display = 'inline-block';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    updateAuthUI();
    showNotification('Logged out successfully!', 'info');
}

// Utility Functions
function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Set color based on type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.style.backgroundColor = colors[type] || colors.success;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Sample data for when API is not available
function loadSampleProducts() {
    products = [
        {
            _id: '1',
            name: 'Classic White Dress Shirt',
            description: 'Premium cotton dress shirt perfect for business and formal occasions',
            price: 45.99,
            category: 'male',
            subcategory: 'shirts',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['White', 'Light Blue', 'Navy'],
            images: ['https://via.placeholder.com/300x300?text=White+Dress+Shirt'],
            stock: 50,
            featured: true
        },
        {
            _id: '2',
            name: 'Elegant Black Dress',
            description: 'Sophisticated black dress perfect for evening events',
            price: 79.99,
            category: 'female',
            subcategory: 'dresses',
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            colors: ['Black', 'Navy', 'Red'],
            images: ['https://via.placeholder.com/300x300?text=Elegant+Black+Dress'],
            stock: 30,
            featured: true
        },
        {
            _id: '3',
            name: 'Slim Fit Jeans',
            description: 'Comfortable slim fit jeans made from premium denim',
            price: 59.99,
            category: 'male',
            subcategory: 'pants',
            sizes: ['28', '30', '32', '34', '36', '38'],
            colors: ['Dark Blue', 'Black', 'Light Blue'],
            images: ['https://via.placeholder.com/300x300?text=Slim+Fit+Jeans'],
            stock: 40,
            featured: true
        },
        {
            _id: '4',
            name: 'Summer Floral Dress',
            description: 'Light and breezy floral dress perfect for summer days',
            price: 54.99,
            category: 'female',
            subcategory: 'dresses',
            sizes: ['XS', 'S', 'M', 'L'],
            colors: ['Floral', 'Blue', 'Pink'],
            images: ['https://via.placeholder.com/300x300?text=Summer+Floral+Dress'],
            stock: 40,
            featured: true
        },
        {
            _id: '5',
            name: 'Leather Bomber Jacket',
            description: 'Stylish leather bomber jacket for a cool, casual look',
            price: 149.99,
            category: 'male',
            subcategory: 'jackets',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Black', 'Brown'],
            images: ['https://via.placeholder.com/300x300?text=Leather+Bomber'],
            stock: 25,
            featured: true
        },
        {
            _id: '6',
            name: 'Silk Blouse',
            description: 'Luxurious silk blouse for professional and elegant looks',
            price: 69.99,
            category: 'female',
            subcategory: 'tops',
            sizes: ['XS', 'S', 'M', 'L'],
            colors: ['White', 'Black', 'Blush'],
            images: ['https://via.placeholder.com/300x300?text=Silk+Blouse'],
            stock: 35,
            featured: true
        },
        {
            _id: '7',
            name: 'Running Sneakers',
            description: 'High-performance running shoes with excellent cushioning',
            price: 89.99,
            category: 'male',
            subcategory: 'shoes',
            sizes: ['8', '9', '10', '11', '12'],
            colors: ['White', 'Black', 'Blue'],
            images: ['https://via.placeholder.com/300x300?text=Running+Sneakers'],
            stock: 35,
            featured: false
        },
        {
            _id: '8',
            name: 'Designer Heels',
            description: 'Elegant high heels perfect for special occasions',
            price: 99.99,
            category: 'female',
            subcategory: 'shoes',
            sizes: ['6', '7', '8', '9', '10'],
            colors: ['Black', 'Nude', 'Red'],
            images: ['https://via.placeholder.com/300x300?text=Designer+Heels'],
            stock: 25,
            featured: false
        }
    ];
    
    displayProducts('male-products', products.filter(p => p.category === 'male'));
    displayProducts('female-products', products.filter(p => p.category === 'female'));
    displayProducts('featured-products', products.filter(p => p.featured));
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});