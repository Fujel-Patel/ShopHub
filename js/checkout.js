// ==========================================
// CHECKOUT PAGE - FORM & ORDER LOGIC
// ==========================================

// Store form data temporarily for confirmation
let pendingOrderData = null;

function displayCheckoutSummary() {
    const summaryItems = document.getElementById('summaryItems');
    if (!summaryItems) return;

    summaryItems.innerHTML = '';

    cartManager.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'summary-item-card';
        itemDiv.innerHTML = `
            <div>
                <div class="summary-item-name">${item.name}</div>
                <div class="summary-item-name">Qty: ${item.quantity}</div>
            </div>
            <div class="summary-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
        `;
        summaryItems.appendChild(itemDiv);
    });

    const { subtotal, shipping, total } = cartManager.calculatePrices();
    
    document.getElementById('summarySubtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('summaryShipping').textContent = `₹${shipping.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `₹${total.toFixed(2)}`;
}

// Form Validation
function validateCheckoutForm() {
    const errors = {};
    
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const zipcode = document.getElementById('zipcode').value.trim();

    // Name validation
    if (!fullName || fullName.length < 2) {
        errors.nameError = 'Please enter a valid name';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.emailError = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
        errors.phoneError = 'Please enter a valid 10-digit mobile number';
    }

    // Address validation
    if (!address || address.length < 5) {
        errors.addressError = 'Please enter a valid address';
    }

    // City validation
    if (!city || city.length < 2) {
        errors.cityError = 'Please enter a valid city name';
    }

    // State validation
    if (!state || state.length < 2) {
        errors.stateError = 'Please enter a valid state name';
    }

    // Zipcode validation
    const zipcodeRegex = /^[0-9]{6}$/;
    if (!zipcode || !zipcodeRegex.test(zipcode)) {
        errors.zipcodeError = 'Please enter a valid 6-digit pin code';
    }

    // Display errors
    Object.keys(errors).forEach(key => {
        const errorEl = document.getElementById(key);
        if (errorEl) {
            errorEl.textContent = errors[key];
            const fieldId = key.replace('Error', '');
            const field = document.getElementById(fieldId);
            if (field) field.classList.add('error');
        }
    });

    return Object.keys(errors).length === 0;
}

// Clear error messages
function clearCheckoutErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input').forEach(el => el.classList.remove('error'));
}

// Show confirmation modal
function showConfirmationModal(formData) {
    const { subtotal, shipping, total } = cartManager.calculatePrices();
    
    // Map payment method to readable format
    const paymentMethods = {
        'upi': '📱 UPI (Google Pay / PhonePe)',
        'credit_card': '💳 Credit/Debit Card',
        'cod': '💵 Cash on Delivery (COD)'
    };
    
    document.getElementById('confirmTotal').textContent = `₹${total.toFixed(2)}`;
    document.getElementById('confirmPayment').textContent = paymentMethods[formData.payment] || formData.payment;
    document.getElementById('confirmAddress').textContent = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zipcode}`;
    
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Close confirmation modal
function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.style.display = 'none';
    }
    pendingOrderData = null;
}

// Confirm and place order
function confirmPlaceOrder() {
    if (!pendingOrderData) return;

    // Generate order ID
    const orderId = `#RTS-ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    const orderData = {
        orderId,
        formData: pendingOrderData,
        items: cartManager.items,
        prices: cartManager.calculatePrices(),
        orderDate: new Date().toLocaleDateString()
    };

    // Save to orders manager
    ordersManager.addOrder(orderData);

    // Save order data to sessionStorage for display on success page
    sessionStorage.setItem('lastOrder', JSON.stringify(orderData));

    // Clear cart
    cartManager.clearCart();

    // Close modal and redirect
    closeConfirmationModal();
    window.location.href = 'order-success.html';
}

// Handle checkout form submission
function handleCheckoutSubmit(e) {
    e.preventDefault();
    clearCheckoutErrors();

    if (!validateCheckoutForm()) {
        return;
    }

    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipcode: document.getElementById('zipcode').value,
        payment: document.querySelector('input[name="payment"]:checked').value
    };

    // Store for confirmation and show modal
    pendingOrderData = formData;
    showConfirmationModal(formData);
}

// ==========================================
// PAGE INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on load
    cartManager.updateCartUI();

    // Initialize only if we're on the checkout page
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm) return;

    // Display checkout summary
    displayCheckoutSummary();

    // Handle form submission
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);

    // Clear errors on input
    checkoutForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function() {
            this.classList.remove('error');
            const errorId = this.id + 'Error';
            const errorEl = document.getElementById(errorId);
            if (errorEl) errorEl.textContent = '';
        });
    });

    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const q = searchInput.value.trim();
            if (q) {
                window.location.href = '../index.html?search=' + encodeURIComponent(q);
            }
        });
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const q = searchInput.value.trim();
                if (q) {
                    window.location.href = '../index.html?search=' + encodeURIComponent(q);
                }
            }
        });
    }
});
