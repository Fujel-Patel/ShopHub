// ==========================================
// ORDERS STATE MANAGEMENT
// ==========================================

class OrdersManager {
    constructor() {
        this.ordersKey = 'shophub_orders';
        this.loadOrders();
    }

    // Load orders from localStorage
    loadOrders() {
        const orders = localStorage.getItem(this.ordersKey);
        this.orders = orders ? JSON.parse(orders) : [];
    }

    // Save orders to localStorage
    saveOrders() {
        localStorage.setItem(this.ordersKey, JSON.stringify(this.orders));
    }

    // Add new order
    addOrder(orderData) {
        const order = {
            id: orderData.orderId,
            date: new Date().toISOString(),
            displayDate: new Date().toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            }),
            customerName: orderData.formData.fullName,
            email: orderData.formData.email,
            phone: orderData.formData.phone,
            address: orderData.formData.address,
            city: orderData.formData.city,
            state: orderData.formData.state,
            zipcode: orderData.formData.zipcode,
            paymentMethod: orderData.formData.payment,
            items: orderData.items,
            prices: orderData.prices,
            status: 'Placed',
            estimatedDelivery: this.getEstimatedDelivery()
        };
        
        this.orders.unshift(order); // Add to beginning so newest is first
        this.saveOrders();
        return order;
    }

    // Get estimated delivery date (5-7 days from now)
    getEstimatedDelivery() {
        const date = new Date();
        date.setDate(date.getDate() + 5);
        return date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Get all orders
    getAllOrders() {
        return this.orders;
    }

    // Get order by ID
    getOrderById(orderId) {
        return this.orders.find(order => order.id === orderId);
    }

    // Update order status
    updateOrderStatus(orderId, status) {
        const order = this.getOrderById(orderId);
        if (order) {
            order.status = status;
            this.saveOrders();
        }
    }

    // Get orders count
    getOrdersCount() {
        return this.orders.length;
    }
}

// Initialize orders manager
const ordersManager = new OrdersManager();
