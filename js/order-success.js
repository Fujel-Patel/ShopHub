// ==========================================
// ORDER SUCCESS PAGE - CONFIRMATION DISPLAY
// ==========================================

function displayOrderSuccess() {
    const orderData = sessionStorage.getItem('lastOrder');
    
    if (!orderData) {
        // Redirect to home if no order data
        window.location.href = '../index.html';
        return;
    }

    const order = JSON.parse(orderData);
    
    // Display Order ID
    document.getElementById('orderId').textContent = order.orderId;
    
    // Display Order Date
    document.getElementById('orderDate').textContent = order.orderDate;
    
    // Calculate and display delivery date (5-7 days)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    document.getElementById('deliveryDate').textContent = deliveryDate.toLocaleDateString();
    
    // Display order items
    const orderItemsSummary = document.getElementById('orderItemsSummary');
    order.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item-line';
        itemDiv.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderItemsSummary.appendChild(itemDiv);
    });
    
    // Display total
    document.getElementById('orderTotalAmount').textContent = `₹${order.prices.total.toFixed(2)}`;
    
    // Display shipping details
    const shippingDetails = document.getElementById('shippingDetails');
    shippingDetails.innerHTML = `
        <p><strong>${order.formData.fullName}</strong></p>
        <p>${order.formData.address}</p>
        <p>${order.formData.city}, ${order.formData.state} - ${order.formData.zipcode}</p>
        <p>Phone: ${order.formData.phone}</p>
    `;
    
    // Display payment method
    const paymentMethodMap = {
        'upi': 'UPI (Google Pay / PhonePe)',
        'credit_card': 'Credit/Debit Card',
        'cod': 'Cash on Delivery (COD)'
    };
    
    document.getElementById('paymentMethod').textContent = 
        paymentMethodMap[order.formData.payment] || 'Payment';
    
    // Clear session data after displaying
    sessionStorage.removeItem('lastOrder');
}

// ==========================================
// PAGE INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on load
    cartManager.updateCartUI();

    // Initialize only if we're on the order success page
    const orderId = document.getElementById('orderId');
    if (!orderId) return;

    // Display order success
    displayOrderSuccess();
});
