Cart State Management
I made a CartManager class in cart-manager.js file to handle all cart work in one place.
When user adds a product, saveCart() function saves the cart data to browser's LocalStorage so data stays safe even after page refresh.
When user opens the site again, loadCart() function reads that saved data and shows the cart as it was before.
For adding item — addItem() function first checks if that product is already in cart. If yes, it increases the quantity. If no, it adds it as new item.
For removing item — removeItem() function simply deletes that product from the list.
For quantity change — updateQuantity() function updates the number. If user decreases quantity to 0, it removes the item automatically.
updateCartUI() function updates the cart count number shown in header on every page without any reload.
I also made a separate OrdersManager class in orders-manager.js file that saves all placed orders in LocalStorage under key shophub_orders so user can see their order history anytime.

Price Calculation
All price calculation is done in one function called calculatePrices() inside CartManager class.
It works like this —
Subtotal is calculated by multiplying price and quantity of each item and adding all together.
Shipping charge is ₹100 if subtotal is below ₹2000. If subtotal is above ₹2000 then shipping is free.
Final Total is Subtotal plus Shipping charge.
This calculatePrices() function returns the result and it is used by updateCartSummary() function on Cart page and displayCheckoutSummary() function on Checkout page — so both pages always show same correct numbers.
Whenever user adds item, removes item or changes quantity — displayCartItems() function is called automatically and price updates on screen without refreshing the page.
