// Product data for search
const products = [
    {
        name: "Aura OF25",
        description: "Hair Oil",
        price: "255 MAD",
        image: "auraof25.jpg",
        category: "Skincare",
        whatsappLink: "https://wa.me/+21265493851?text=I'm interested in ordering Aura OF25 (Sun Protection)"
    },
    {
        name: "Aura Eyes",
        description: "Illuminating Eye Serum",
        price: "349 MAD",
        image: "auraeyes.jpg",
        category: "Skincare",
        whatsappLink: "https://wa.me/+21265493851?text=I'm interested in ordering Aura Eyes (Illuminating Eye Serum)"
    },
    {
        name: "Cocoberry",
        description: "Raspberry & Coco Body Moisturizer",
        price: "229 MAD",
        image: "cocoberry.jpg",
        category: "Body Care",
        whatsappLink: "https://wa.me/+21265493851?text=I'm interested in ordering Cocoberry Body Butter"
    },
    {
        name: "Beldi Breeze",
        description: "Traditional Moroccan Black Soap",
        price: "from 66 MAD",
        image: "beldibreeze.jpg",
        category: "Body Care",
        variants: ["Akkar Fassi - 69 MAD", "Citron Beldi - 66 MAD", "Nila Beldi - 75 MAD"],
        whatsappLink: "https://wa.me/+21265493851?text=I'm interested in ordering Beldi Breeze"
    },
    {
        name: "Silk Bliss",
        description: "Rice & Snail Mask Face",
        price: "90 MAD",
        image: "silkbliss.jpg",
        category: "Hair Care",
        whatsappLink: "https://wa.me/+21265493851?text=I'm interested in ordering Silk Bliss Hair Mask"
    },
    {
        name: "Macca Boost",
        description: "Hair Shampoo",
        price: "275 MAD",
        image: "maccaboostshampoo.jpg",
        category: "Hair Care",
        whatsappLink: "https://wa.me/+21265493851?text=I'm interested in ordering Macca Boost (Revitalizing Hair Shampoo)"
    },
    {
        name: "Glimmer Hair",
        description: "Hair Wax",
        price: "162 MAD",
        image: "glimmerhair.jpg",
        category: "Hair Care",
        whatsappLink: "https://wa.me/+21265493851?text=I'm interested in ordering Glimmer Hair (Moroccan Argan Hair Oil)"
    }
];

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
const navLinksItems = document.querySelectorAll('.nav-links a');
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        body.style.overflow = '';
    });
});

// Create search overlay and modal
const searchOverlay = document.createElement('div');
searchOverlay.className = 'search-overlay';
const searchModal = document.createElement('div');
searchModal.className = 'search-modal';

searchModal.innerHTML = `
    <div class="search-header">
        <input type="text" placeholder="Search products..." id="searchInput">
        <button class="close-search"><i class="fas fa-times"></i></button>
    </div>
    <div class="search-results"></div>
`;

searchOverlay.appendChild(searchModal);
document.body.appendChild(searchOverlay);

// Search functionality
const searchIcon = document.querySelector('.fa-search')?.parentElement;
const searchInput = document.getElementById('searchInput');
const searchResults = document.querySelector('.search-results');

if (searchIcon) {
    // Show search modal
    searchIcon.addEventListener('click', (e) => {
        e.preventDefault();
        searchOverlay.classList.add('active');
        searchInput.value = ''; // Clear previous search
        searchInput.focus();
    });

    // Close search modal
    document.querySelector('.close-search').addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    // Close on overlay click
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
    });
}

// Search input handler
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query === '') {
            searchResults.innerHTML = '';
            return;
        }

        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );

        displaySearchResults(filteredProducts);
    });
}

function displaySearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No products found</p>';
        return;
    }

    searchResults.innerHTML = results.map(product => `
        <div class="search-product">
            <img src="${product.image}" alt="${product.name}">
            <div class="search-product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <span class="search-product-price">${product.price}</span>
                ${product.variants ? 
                    `<div class="search-product-variants">
                        ${product.variants.map(variant => `<span>${variant}</span>`).join('')}
                    </div>` : 
                    ''
                }
            </div>
            <a href="${product.whatsappLink}" target="_blank" class="search-whatsapp-btn">
                <i class="fab fa-whatsapp"></i> Order Now
            </a>
        </div>
    `).join('');
}

// Price Range Filter Functionality
const priceRange = document.getElementById('priceRange');
const currentPrice = document.getElementById('currentPrice');
const productCards = document.querySelectorAll('.product-card');

function updatePriceFilter() {
    const maxPrice = parseInt(priceRange.value);
    currentPrice.textContent = maxPrice + ' MAD';

    // Keep track of visible products in each category
    const categoryVisibility = {};

    productCards.forEach(card => {
        const priceElement = card.querySelector('.product-meta .product-price');
        const variantsElement = card.querySelector('.product-variants');
        let price = 0;
        
        if (variantsElement) {
            // Handle products with variants (like Beldi Breeze)
            const variantPrices = Array.from(variantsElement.querySelectorAll('p')).map(p => {
                const match = p.textContent.match(/\d+/);
                return match ? parseInt(match[0]) : 0;
            });
            price = Math.min(...variantPrices); // Use lowest variant price
        } else if (priceElement) {
            // Handle single-price products
            const match = priceElement.textContent.match(/\d+/);
            price = match ? parseInt(match[0]) : 0;
        }

        // Show/hide based on price
        if (price <= maxPrice) {
            card.style.display = '';  // Use default display value
            // Track category visibility
            const category = card.closest('.category-section');
            if (category) {
                categoryVisibility[category.id] = true;
            }
        } else {
            card.style.display = 'none';
        }
    });

    // Update category visibility
    document.querySelectorAll('.category-section').forEach(section => {
        const hasVisibleProducts = categoryVisibility[section.id] || false;
        section.style.display = hasVisibleProducts ? '' : 'none';
    });
}

// Initialize price filter
if (priceRange) {
    priceRange.addEventListener('input', updatePriceFilter);
    // Initial filter application
    updatePriceFilter();
}

// Category filter functionality
document.querySelectorAll('.filter-list a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active state
        document.querySelectorAll('.filter-list a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        
        const category = link.getAttribute('href').replace('#', '');
        
        if (category === 'all') {
            // Show all categories but respect price filter
            updatePriceFilter();
        } else {
            // Show selected category but respect price filter
            document.querySelectorAll('.category-section').forEach(section => {
                if (section.id === category) {
                    section.style.display = '';
                    // Re-apply price filter to visible category
                    const cards = section.querySelectorAll('.product-card');
                    cards.forEach(card => {
                        const priceElement = card.querySelector('.product-meta .product-price');
                        const variantsElement = card.querySelector('.product-variants');
                        let price = 0;
                        
                        if (variantsElement) {
                            const variantPrices = Array.from(variantsElement.querySelectorAll('p')).map(p => {
                                const match = p.textContent.match(/\d+/);
                                return match ? parseInt(match[0]) : 0;
                            });
                            price = Math.min(...variantPrices);
                        } else if (priceElement) {
                            const match = priceElement.textContent.match(/\d+/);
                            price = match ? parseInt(match[0]) : 0;
                        }
                        
                        card.style.display = price <= parseInt(priceRange.value) ? '' : 'none';
                    });
                } else {
                    section.style.display = 'none';
                }
            });
        }
    });
});
