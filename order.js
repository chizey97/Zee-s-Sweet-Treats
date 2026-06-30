const productContainer = document.getElementById("productContainer");
const filterButtons = document.querySelectorAll(".filter-btn");
const checkoutBtn = document.getElementById("checkoutBtn");

let activeCategory = "All";

function renderProducts() {
  if (!productContainer) return;

  const filteredProducts =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter(product => product.category === activeCategory);

  productContainer.innerHTML = filteredProducts
    .map(product => {
      const cartItem = getCart().find(item => item.id === product.id);
      const qty = cartItem ? cartItem.qty : 0;

      return `
        <div class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            <span class="product-badge">${product.badge}</span>
          </div>

          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">${money(product.price)}</div>

            <div class="quantity-selector">
              <button onclick="decreaseProduct('${product.id}')">-</button>
              <input type="number" value="${qty}" readonly>
              <button onclick="increaseProduct('${product.id}')">+</button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function increaseProduct(productId) {
  addToCart(productId);
  renderProducts();
}

function decreaseProduct(productId) {
  removeFromCart(productId);
  renderProducts();
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    activeCategory = button.dataset.category;
    renderProducts();
  });
});

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", event => {
    if (getCartCount() === 0) {
      event.preventDefault();
      alert("Please add at least one item before checkout.");
    }
  });
}

renderProducts();
updateCartIndicators();
