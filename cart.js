const CART_KEY = "ZEE_CART";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartIndicators();
}

function addToCart(productId) {
  const product = PRODUCTS.find(item => item.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart(cart);
}

function removeFromCart(productId) {
  let cart = getCart();
  const item = cart.find(product => product.id === productId);

  if (!item) return;

  item.qty -= 1;

  if (item.qty <= 0) {
    cart = cart.filter(product => product.id !== productId);
  }

  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartIndicators();
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function money(value) {
  return `${CONFIG.currency}${Number(value || 0).toFixed(0)}`;
}

function updateCartIndicators() {
  const count = getCartCount();
  const total = getCartTotal();

  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = count;
  });

  document.querySelectorAll("#cartTotal, #orderTotal").forEach(el => {
    el.textContent = money(total);
  });

  document.querySelectorAll(".floating-cart, .order-summary-bar").forEach(el => {
    if (count > 0) {
      el.classList.add("show");
    } else {
      el.classList.remove("show");
    }
  });
}

updateCartIndicators();
