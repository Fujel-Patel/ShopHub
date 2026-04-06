// ==========================================
// CART PAGE - DISPLAY & MANAGEMENT
// ==========================================

function displayCartItems() {
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;

    if (cartManager.items.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty 🛒</p>
                <a href="../index.html" class="continue-shopping-btn">Continue Shopping</a>
            </div>
        `;
        document.getElementById('checkoutBtn').disabled = true;
        document.getElementById('checkoutBtn').style.opacity = '0.5';
        return;
    }

    cartContent.innerHTML = '';

    cartManager.items.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" title="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>₹${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease-btn" data-product-id="${item.id}">−</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn increase-btn" data-product-id="${item.id}">+</button>
            </div>
            <div>₹${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-btn" data-product-id="${item.id}">Remove</button>
        `;
        
        cartContent.appendChild(cartItemDiv);
    });

    // Add event listeners
    document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const item = cartManager.items.find(i => i.id === productId);
            cartManager.updateQuantity(productId, item.quantity + 1);
            displayCartItems();
            updateCartSummary();
        });
    });

    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const item = cartManager.items.find(i => i.id === productId);
            cartManager.updateQuantity(productId, item.quantity - 1);
            displayCartItems();
            updateCartSummary();
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            cartManager.removeItem(productId);
            displayCartItems();
            updateCartSummary();
        });
    });

    updateCartSummary();
}

function updateCartSummary() {
    const { subtotal, shipping, total } = cartManager.calculatePrices();
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `₹${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
    
    if (shipping === 0 && subtotal > 0) {
        const discountSection = document.getElementById('discountSection');
        if (discountSection) {
            discountSection.style.display = 'flex';
            document.getElementById('discount').textContent = `-₹100.00`;
        }
    }
}

// ==========================================
// PAGE INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on load
    cartManager.updateCartUI();

    // Initialize only if we're on the cart page
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;

    // Display cart items
    displayCartItems();
});
