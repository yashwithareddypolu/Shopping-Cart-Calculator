const products = [
  { id: 1, name: "Avocado",       price: 1.75, icon: "🥑" },
  { id: 2, name: "Sourdough",     price: 4.50, icon: "🍞" },
  { id: 3, name: "Milk (1L)",     price: 2.10, icon: "🥛" },
  { id: 4, name: "Free-range Egg", price: 3.25, icon: "🥚" },
  { id: 5, name: "Honey Jar",     price: 6.00, icon: "🍯" },
  { id: 6, name: "Coffee Beans",  price: 8.90, icon: "☕" },
  { id: 7, name: "Basil Plant",   price: 3.00, icon: "🌿" },
  { id: 8, name: "Dark Choc.",    price: 3.60, icon: "🍫" },
];
 
// ---------- STATE: cart is an array of { ...product, qty } ----------
let cart = [];
 
const TAX_RATE = 0.08;
 
// ---------- DOM references ----------
const productGrid   = document.getElementById("productGrid");
const receiptLines  = document.getElementById("receiptLines");
const emptyMsg      = document.getElementById("emptyMsg");
const itemCountEl   = document.getElementById("itemCount");
const subtotalEl    = document.getElementById("subtotal");
const taxEl         = document.getElementById("tax");
const grandTotalEl  = document.getElementById("grandTotal");
const checkoutBtn   = document.getElementById("checkoutBtn");
const clearBtn      = document.getElementById("clearBtn");
const paidStamp     = document.getElementById("paidStamp");
 
// ---------- Build the product shelf (loop over products array) ----------
function renderProducts() {
  productGrid.innerHTML = "";
 
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
 
    const card = document.createElement("button");
    card.className = "product-card";
    card.type = "button";
    card.dataset.id = product.id;
 
    card.innerHTML = `
      <span class="qty-badge">0</span>
      <span class="product-icon">${product.icon}</span>
      <span class="product-name">${product.name}</span>
      <span class="product-price">$${product.price.toFixed(2)}</span>
    `;
 
    card.addEventListener("click", () => addToCart(product.id));
    productGrid.appendChild(card);
  }
}
 
// ---------- Add an item to the cart ----------
function addToCart(id) {
  // look for the item already in the cart
  let existing = null;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      existing = cart[i];
      break;
    }
  }
 
  if (existing) {
    existing.qty += 1;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }
 
  renderCart();
}
 
// ---------- Remove an item entirely from the cart ----------
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}
 
// ---------- Calculate totals by looping over the cart array ----------
function calculateTotals() {
  let itemCount = 0;
  let subtotal = 0;
 
  for (let i = 0; i < cart.length; i++) {
    itemCount += cart[i].qty;
    subtotal += cart[i].price * cart[i].qty;
  }
 
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
 
  return { itemCount, subtotal, tax, total };
}
 
// ---------- Render the receipt + totals + shelf badges ----------
function renderCart() {
  // receipt lines
  receiptLines.innerHTML = "";
 
  if (cart.length === 0) {
    receiptLines.appendChild(emptyMsg);
  } else {
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      const line = document.createElement("div");
      line.className = "receipt-line";
      line.innerHTML = `
        <span class="line-name">${item.icon} ${item.name}</span>
        <span class="line-qty">x${item.qty}</span>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
        <button class="line-remove" title="Remove" data-id="${item.id}">✕</button>
      `;
      receiptLines.appendChild(line);
    }
  }
 
  // wire up remove buttons
  document.querySelectorAll(".line-remove").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.dataset.id);
      removeFromCart(id);
    });
  });
 
  // totals
  const { itemCount, subtotal, tax, total } = calculateTotals();
  itemCountEl.textContent  = itemCount;
  subtotalEl.textContent   = subtotal.toFixed(2);
  taxEl.textContent        = tax.toFixed(2);
  grandTotalEl.textContent = total.toFixed(2);
 
  checkoutBtn.disabled = cart.length === 0;
 
  // update qty badges on shelf cards
  document.querySelectorAll(".product-card").forEach(card => {
    const id = Number(card.dataset.id);
    const item = cart.find(c => c.id === id);
    const badge = card.querySelector(".qty-badge");
 
    if (item) {
      card.classList.add("in-cart");
      badge.textContent = item.qty;
    } else {
      card.classList.remove("in-cart");
      badge.textContent = "0";
    }
  });
 
  // reset any stamp from a previous checkout
  paidStamp.classList.remove("show");
}
 
// ---------- Checkout ----------
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
 
  paidStamp.classList.add("show");
 
  setTimeout(() => {
    cart = [];
    renderCart();
  }, 1400);
});
 
// ---------- Clear cart ----------
clearBtn.addEventListener("click", () => {
  cart = [];
  renderCart();
});
 
// ---------- Init ----------
renderProducts();
renderCart();
