let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productsDiv = document.getElementById("products");
const cartItemsDiv = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const totalEl = document.getElementById("total");
const searchInput = document.getElementById("search");
const popup = document.getElementById("popup");
const confettiCanvas = document.getElementById("confetti-canvas");
const ctx = confettiCanvas.getContext("2d");

let confettiParticles = [];

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createConfetti() {
  for (let i = 0; i < 100; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 10 + 5,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngleIncrement: Math.random() * 0.07 + 0.05,
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach((p, index) => {
    ctx.beginPath();
    ctx.lineWidth = p.r / 2;
    ctx.strokeStyle = p.color;
    ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
    ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
    ctx.stroke();

    p.tilt += p.tiltAngleIncrement;
    p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;

    if (p.y > confettiCanvas.height) confettiParticles.splice(index, 1);
  });
}

function animateConfetti() {
  if (confettiParticles.length > 0) {
    drawConfetti();
    requestAnimationFrame(animateConfetti);
  }
}

async function fetchProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    products = await res.json();
    displayProducts(products);
  } catch (error) {
    productsDiv.innerHTML = "<p>Failed to load products</p>";
  }
}

function showPopup() {
  popup.classList.add("show");
  createConfetti();
  animateConfetti();

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  cart.push(product);
  updateCart();
  showPopup();
}

function displayProducts(items) {
  productsDiv.innerHTML = "";

  if (!items || items.length === 0) {
    productsDiv.innerHTML = "<p>No products found</p>";
    return;
  }

  items.forEach((p) => {
    productsDiv.innerHTML += `
      <div class="card">
        <img src="${p.image}" />
        <h3>${p.title.slice(0, 30)}</h3>
        <p>Rs ${Math.round(p.price * 280)}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
  });
}

function updateCart() {
  cartItemsDiv.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    if (!item) return;
    total += item.price * 280;
    cartItemsDiv.innerHTML += `
      <div class="cart-item">
       
      </div>
    `;
  });

  cartCount.innerText = cart.length;
  totalEl.innerText = Math.round(total);
  localStorage.setItem("cart", JSON.stringify(cart));
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("show");
}

function clearCart() {
  cart = [];
  updateCart();
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase().trim();

  if (keyword === "") {
    displayProducts(products);
    return;
  }

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(keyword),
  );

  displayProducts(filtered);
});

fetchProducts();
updateCart();
