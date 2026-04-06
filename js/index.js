// ==========================================
// INDEX PAGE - PRODUCT DISPLAY & FILTERING
// ==========================================

let currentCategory = 'all';
let filteredProducts = products;

function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const isInCart = cartManager.items.some(item => item.id === product.id);
        
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.className = 'product-image';
        img.onerror = function() {
            // Fallback: use a solid color as background if image fails
            this.style.backgroundColor = '#e0e0e0';
            this.style.display = 'none';
        };
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" title="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">₹${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn ${isInCart ? 'added' : ''}" 
                        data-product-id="${product.id}"
                        data-product-name="${product.name}"
                        data-product-price="${product.price}">
                    ${isInCart ? '✓ Added' : 'Add to Cart'}
                </button>
            </div>
        `;

        productsGrid.appendChild(productCard);
        
        // Add error handling to the actual image element
        const imgElement = productCard.querySelector('img');
        imgElement.addEventListener('error', function() {
            this.style.backgroundColor = '#e0e0e0';
        });
    });

    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const imgElement = productCard.querySelector('img');
            
            const product = {
                id: parseInt(this.dataset.productId),
                name: this.dataset.productName,
                price: parseFloat(this.dataset.productPrice),
                image: imgElement.src
            };
            
            cartManager.addItem(product);
            
            // Update button state
            this.classList.add('added');
            this.textContent = '✓ Added';
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.classList.remove('added');
                this.textContent = 'Add to Cart';
            }, 2000);
        });
    });
}

// Filter products by category
function filterByCategory(category) {
    currentCategory = category;
    
    if (category === 'all') {
        filteredProducts = products;
        const sectionTitle = document.getElementById('sectionTitle');
        if (sectionTitle) sectionTitle.textContent = 'All Products';
    } else {
        filteredProducts = products.filter(p => p.category === category);
        const sectionTitle = document.getElementById('sectionTitle');
        if (sectionTitle) {
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            sectionTitle.textContent = categoryName;
        }
    }
    
    displayProducts();
}

// Search Products
function searchProducts(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
        filteredProducts = currentCategory === 'all' 
            ? products 
            : products.filter(p => p.category === currentCategory);
    } else {
        filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                 product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
            return matchesSearch && matchesCategory;
        });
    }
    
    displayProducts();
}

// ==========================================
// PAGE INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on load
    cartManager.updateCartUI();

    // Initialize only if we're on the index page
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // Display products
    displayProducts();

    // Category filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterByCategory(this.dataset.category);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Helper function to perform search with validation
    const performSearch = function() {
        const query = searchInput ? searchInput.value.trim() : '';
        if (query && query.length > 0) {
            searchProducts(query);
        } else if (searchBtn) {
            alert('Please enter a search term');
        }
    };

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});
