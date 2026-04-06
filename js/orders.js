// ==========================================
// ORDERS PAGE - DISPLAY & MANAGEMENT
// ==========================================

function displayOrders() {
    const ordersContent = document.getElementById('ordersContent');
    if (!ordersContent) return;

    const allOrders = ordersManager.getAllOrders();

    if (allOrders.length === 0) {
        ordersContent.innerHTML = `
            <div class="empty-orders">
                <p>📦</p>
                <p>You haven't placed any orders yet.</p>
                <p>Start shopping and place your first order today!</p>
                <a href="../index.html">Continue Shopping</a>
            </div>
        `;
        return;
    }

    ordersContent.innerHTML = '<div class="orders-list"></div>';
    const ordersList = ordersContent.querySelector('.orders-list');

    allOrders.forEach(order => {
        const orderCard = createOrderCard(order);
        ordersList.appendChild(orderCard);
    });
}

function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    const itemsCount = order.items.length;
    const itemsPreview = order.items.slice(0, 3).map(item => `<span class="order-item-badge">${item.name}</span>`).join('');
    const moreItems = itemsCount > 3 ? `<span class="order-item-count">+${itemsCount - 3} more</span>` : '';

    const statusClass = order.status.toLowerCase() === 'placed' ? 'pending' : order.status.toLowerCase();

    card.innerHTML = `
        <div class="order-card-header">
            <div>
                <div class="order-id">${order.id}</div>
                <div class="order-date">${order.displayDate}</div>
            </div>
            <div class="order-total">₹${order.prices.total.toFixed(2)}</div>
            <span class="order-status ${statusClass}">${order.status}</span>
        </div>
        <div class="order-card-body">
            <div class="order-items-preview">
                ${itemsPreview}
                ${moreItems}
            </div>
            <div class="order-customer-info">
                <div>
                    <strong>Customer</strong>
                    ${order.customerName}
                </div>
                <div>
                    <strong>Delivery Address</strong>
                    ${order.city}, ${order.state}
                </div>
            </div>
            <div class="order-card-footer">
                <button class="view-details-btn" onclick="viewOrderDetails('${order.id}')">View Details</button>
                <button class="track-order-btn" onclick="trackOrder('${order.id}')">Track Order</button>
            </div>
        </div>
    `;

    return card;
}

function viewOrderDetails(orderId) {
    const order = ordersManager.getOrderById(orderId);
    if (!order) return;

    const modal = document.getElementById('orderDetailsModal');
    const detailsContent = document.getElementById('orderDetailsContent');

    // Build order items HTML
    const itemsHTML = order.items.map(item => `
        <div class="order-item-detail">
            <img src="${item.image}" alt="${item.name}" title="${item.name}" class="order-item-image">
            <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-price">₹${item.price.toFixed(2)} per unit</div>
                <div class="order-item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="order-item-price" style="font-weight: 600; align-self: center;">
                ₹${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');

    // Map payment method to readable format
    const paymentMethods = {
        'upi': '📱 UPI (Google Pay / PhonePe)',
        'credit_card': '💳 Credit/Debit Card',
        'cod': '💵 Cash on Delivery (COD)'
    };

    const paymentDisplay = paymentMethods[order.paymentMethod] || order.paymentMethod;

    const statusClass = order.status.toLowerCase() === 'placed' ? 'pending' : order.status.toLowerCase();

    detailsContent.innerHTML = `
        <div class="order-detail-section">
            <h4>Order Information</h4>
            <div class="detail-row">
                <span class="detail-label">Order ID:</span>
                <strong>${order.id}</strong>
            </div>
            <div class="detail-row">
                <span class="detail-label">Order Date:</span>
                <strong>${order.displayDate}</strong>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="order-status ${statusClass}">${order.status}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Estimated Delivery:</span>
                <strong>${order.estimatedDelivery}</strong>
            </div>
        </div>

        <div class="order-detail-section">
            <h4>Order Items</h4>
            <div class="order-items-detail">
                ${itemsHTML}
            </div>
        </div>

        <div class="order-detail-section">
            <h4>Price Breakdown</h4>
            <div class="order-price-breakdown">
                <div class="price-item subtotal">
                    <span>Subtotal:</span>
                    <span>₹${order.prices.subtotal.toFixed(2)}</span>
                </div>
                <div class="price-item subtotal">
                    <span>Shipping:</span>
                    <span>₹${order.prices.shipping.toFixed(2)}</span>
                </div>
                <div class="price-item total">
                    <span>Total:</span>
                    <span>₹${order.prices.total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <div class="order-detail-section">
            <h4>Shipping Address</h4>
            <div class="shipping-address">
                <strong>${order.customerName}</strong><br>
                ${order.address}<br>
                ${order.city}, ${order.state} - ${order.zipcode}<br>
                <strong>Phone:</strong> ${order.phone}<br>
                <strong>Email:</strong> ${order.email}
            </div>
        </div>

        <div class="order-detail-section">
            <h4>Payment Method</h4>
            <div class="detail-row">
                <span>${paymentDisplay}</span>
            </div>
        </div>
    `;

    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeOrderDetailsModal() {
    const modal = document.getElementById('orderDetailsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function trackOrder(orderId) {
    const order = ordersManager.getOrderById(orderId);
    if (!order) return;

    const modal = document.getElementById('trackOrderModal');
    const trackingContent = document.getElementById('trackingContent');

    let trackingSteps = '';
    if (order.status.toLowerCase() === 'placed') {
        trackingSteps = `
            <div class="tracking-step active">
                <div class="step-number">✓</div>
                <div class="step-info">
                    <strong>Order Placed</strong>
                    <p>${order.displayDate}</p>
                </div>
            </div>
            <div class="tracking-step">
                <div class="step-number">2</div>
                <div class="step-info">
                    <strong>Processing</strong>
                    <p>Your order is being prepared</p>
                </div>
            </div>
            <div class="tracking-step">
                <div class="step-number">3</div>
                <div class="step-info">
                    <strong>Shipped</strong>
                    <p>On the way to you</p>
                </div>
            </div>
            <div class="tracking-step">
                <div class="step-number">4</div>
                <div class="step-info">
                    <strong>Delivered</strong>
                    <p>Est. ${order.estimatedDelivery}</p>
                </div>
            </div>
        `;
    } else if (order.status.toLowerCase() === 'processing') {
        trackingSteps = `
            <div class="tracking-step active">
                <div class="step-number">✓</div>
                <div class="step-info">
                    <strong>Order Placed</strong>
                    <p>${order.displayDate}</p>
                </div>
            </div>
            <div class="tracking-step active">
                <div class="step-number">✓</div>
                <div class="step-info">
                    <strong>Processing</strong>
                    <p>Being prepared for shipment</p>
                </div>
            </div>
            <div class="tracking-step">
                <div class="step-number">3</div>
                <div class="step-info">
                    <strong>Shipped</strong>
                    <p>On the way to you</p>
                </div>
            </div>
            <div class="tracking-step">
                <div class="step-number">4</div>
                <div class="step-info">
                    <strong>Delivered</strong>
                    <p>Est. ${order.estimatedDelivery}</p>
                </div>
            </div>
        `;
    } else if (order.status.toLowerCase() === 'delivered') {
        trackingSteps = `
            <div class="tracking-step active">
                <div class="step-number">✓</div>
                <div class="step-info">
                    <strong>Order Placed</strong>
                    <p>${order.displayDate}</p>
                </div>
            </div>
            <div class="tracking-step active">
                <div class="step-number">✓</div>
                <div class="step-info">
                    <strong>Processing</strong>
                    <p>Prepared and shipped</p>
                </div>
            </div>
            <div class="tracking-step active">
                <div class="step-number">✓</div>
                <div class="step-info">
                    <strong>Shipped</strong>
                    <p>In transit</p>
                </div>
            </div>
            <div class="tracking-step active">
                <div class="step-number">✓</div>
                <div class="step-info">
                    <strong>Delivered</strong>
                    <p>Order delivered!</p>
                </div>
            </div>
        `;
    }

    trackingContent.innerHTML = `
        <div class="tracking-header">
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Status:</strong> <span class="order-status ${order.status.toLowerCase()}">${order.status}</span></p>
        </div>
        <div class="tracking-timeline">
            ${trackingSteps}
        </div>
        <div class="tracking-footer">
            <p>📧 Tracking updates will be sent to:</p>
            <p><strong>${order.email}</strong></p>
            <p style="margin-top: 12px; color: var(--light-text); font-size: 13px;">Est. Delivery: <strong>${order.estimatedDelivery}</strong></p>
        </div>
    `;

    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeTrackOrderModal() {
    const modal = document.getElementById('trackOrderModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const detailsModal = document.getElementById('orderDetailsModal');
    const trackModal = document.getElementById('trackOrderModal');
    
    if (detailsModal) {
        detailsModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeOrderDetailsModal();
            }
        });
    }

    if (trackModal) {
        trackModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeTrackOrderModal();
            }
        });
    }
});

// ==========================================
// PAGE INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on load
    cartManager.updateCartUI();

    // Display orders
    displayOrders();
});
