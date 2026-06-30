const cartButtons = document.querySelectorAll(".add-cart");
const cartCount = document.querySelector(".cart-count");
const floatingCart = document.querySelector(".floating-cart");
const cartTotal = document.getElementById("cartTotal");

let cart = JSON.parse(localStorage.getItem("ZEE_CART")) || [];

function saveCart() {
  localStorage.setItem("ZEE_CART", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = `K${totalPrice}`;

  if (totalItems > 0) {
    floatingCart.classList.add("show");
  } else {
    floatingCart.classList.remove("show");
  }
}

cartButtons.forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    const existing = cart.find(item => item.name === name);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        name,
        price,
        qty: 1
      });
    }

    button.innerHTML = `Added <i class="fa-solid fa-check"></i>`;

    setTimeout(() => {
      button.innerHTML = `Add to Cart <i class="fa-solid fa-plus"></i>`;
    }, 1000);

    saveCart();
  });
});

const faqCards = document.querySelectorAll(".faq-card");

faqCards.forEach(card => {
  const question = card.querySelector(".faq-question");

  question.addEventListener("click", () => {
    faqCards.forEach(item => {
      if (item !== card) item.classList.remove("active");
    });

    card.classList.toggle("active");
  });
});

const revealElements = document.querySelectorAll(
  ".service-card, .product-card, .custom-card, .step-card, .faq-card"
);

revealElements.forEach(el => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach(el => observer.observe(el));

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 30) {
    navbar.style.boxShadow = "0 18px 50px rgba(0,0,0,.08)";
  } else {
    navbar.style.boxShadow = "none";
  }
});

updateCartUI();
