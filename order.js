const plusButtons = document.querySelectorAll(".plus");
const minusButtons = document.querySelectorAll(".minus");
const cartCount = document.querySelector(".cart-count");
const orderTotal = document.getElementById("orderTotal");

let cart = JSON.parse(localStorage.getItem("ZEE_CART")) || [];

function saveCart() {
  localStorage.setItem("ZEE_CART", JSON.stringify(cart));
  updateUI();
}

function updateUI() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  if (cartCount) cartCount.textContent = totalQty;
  if (orderTotal) orderTotal.textContent = `K${total}`;

  document.querySelectorAll("input[readonly]").forEach(input => {
    input.value = 0;
  });

  cart.forEach(item => {
    const button = document.querySelector(`.plus[data-name="${item.name}"]`);
    if (button) {
      const target = button.dataset.target;
      const input = document.getElementById(target);
      if (input) input.value = item.qty;
    }
  });
}

plusButtons.forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const target = button.dataset.target;
    const input = document.getElementById(target);

    let existing = cart.find(item => item.name === name);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    if (input) input.value = Number(input.value) + 1;

    saveCart();
  });
});

minusButtons.forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.product;
    let existing = cart.find(item => item.name === name);

    if (!existing) return;

    existing.qty -= 1;

    if (existing.qty <= 0) {
      cart = cart.filter(item => item.name !== name);
    }

    saveCart();
  });
});

const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", event => {
    if (cart.length === 0) {
      event.preventDefault();
      alert("Please add at least one item before checkout.");
    }
  });
}

updateUI();
