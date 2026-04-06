// ==========================================
// CART STATE MANAGEMENT
// ==========================================

class CartManager {
    constructor() {
        this.cartKey = 'shophub_cart';
        this.loadCart();
    }

    // Load cart from localStorage
    loadCart() {
        const cart = localStorage.getItem(this.cartKey);
        this.items = cart ? JSON.parse(cart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem(this.cartKey, JSON.stringify(this.items));
        this.updateCartUI();
    }

    // Add item to cart
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    // Calculate prices
    calculatePrices() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 2000 ? 0 : 100;
        const total = subtotal + shipping;
        
        return { subtotal, shipping, total };
    }

    // Get cart count
    getCartCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Clear cart
    clearCart() {
        this.items = [];
        this.saveCart();
    }

    // Update cart UI across all pages
    updateCartUI() {
        const cartCounts = document.querySelectorAll('#cartCount');
        const count = this.getCartCount();
        cartCounts.forEach(el => el.textContent = count);
    }
}

// Initialize cart manager
const cartManager = new CartManager();
