## Cart State Management

### Overview
- A dedicated **`CartManager`** class in `cart-manager.js` manages all cart-related logic in one place.
- Cart and orders data are persisted using the browser **LocalStorage** for a smooth, session-resilient experience.

### Cart persistence (LocalStorage)
- **`saveCart()`**: saves the cart to LocalStorage so it remains after page refresh.
- **`loadCart()`**: loads the saved cart when the user revisits the site and restores the previous cart state.

### Cart operations
- **Add item — `addItem()`**
  - Checks if the product already exists in the cart.
  - If it exists, increases the quantity.
  - If it does not exist, adds it as a new item.

- **Remove item — `removeItem()`**
  - Deletes the selected product from the cart.

- **Update quantity — `updateQuantity()`**
  - Updates the item quantity.
  - If quantity becomes **0**, the item is removed automatically.

### UI sync
- **`updateCartUI()`** updates the cart count in the header across pages **without reloading**.

### Orders storage
- A separate **`OrdersManager`** class in `orders-manager.js` saves placed orders in LocalStorage under the key **`shophub_orders`**, allowing users to view order history anytime.

---

## Price Calculation

### Single source of truth
All pricing is calculated inside **`calculatePrices()`** (within `CartManager`).

### Calculation rules
- **Subtotal** = sum of *(price × quantity)* for all cart items
- **Shipping**
  - ₹100 if subtotal is **below ₹2000**
  - Free if subtotal is **₹2000 or above**
- **Final Total** = Subtotal + Shipping

### Where it is used
The result from **`calculatePrices()`** is reused across pages so totals stay consistent:
- **`updateCartSummary()`** on the Cart page
- **`displayCheckoutSummary()`** on the Checkout page

### Auto-updating totals
Whenever the user adds/removes items or changes quantities, **`displayCartItems()`** is triggered so the cart and totals update on-screen **without a page refresh**.
