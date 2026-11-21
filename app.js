/* ANAX storefront configuration
   Replace the placeholder WhatsApp number with a business number before using enquiries.
   India format: 91 + the 10-digit mobile number, digits only.
*/
const WHATSAPP_NUMBER = "91XXXXXXXXXX";

// Preview catalogue: these sample names, artwork and prices are not verified product offers.
const PRODUCTS = [
  {id:1,name:"Everyday Backpack",category:"Accessories",price:1299,art:"backpack",bg:"#dfe5d4",description:"A sample everyday carry concept with a clean, practical silhouette."},
  {id:2,name:"Wireless Headphones",category:"Tech",price:1899,art:"headphones",bg:"#e7e1d8",description:"A sample tech listing for the ANAX preview catalogue."},
  {id:3,name:"Minimal Desk Lamp",category:"Home",price:999,art:"lamp",bg:"#eee9da",description:"A sample home accent listing with a simple modern look."},
  {id:4,name:"Steel Water Bottle",category:"Accessories",price:549,art:"bottle",bg:"#dbe8e4",description:"A sample reusable bottle listing for everyday routines."},
  {id:5,name:"Travel Organizer",category:"Travel",price:799,art:"organizer",bg:"#e8dfd1",description:"A sample travel accessory listing for the preview store."},
  {id:6,name:"Daily Carry Tote",category:"Travel",price:699,art:"tote",bg:"#e6e7dc",description:"A sample tote bag listing with a neutral everyday style."}
];

const $ = id => document.getElementById(id);
const money = amount => "₹" + amount.toLocaleString("en-IN");
const cart = new Map();
let activeCategory = "All";
let lastFocusedElement = null;

function loadCart() {
  try {
    const saved = JSON.parse(sessionStorage.getItem("anax-preview-cart") || "[]");
    if (!Array.isArray(saved)) return;
    saved.forEach(([id, quantity]) => {
      const product = PRODUCTS.find(item => item.id === Number(id));
      const count = Number(quantity);
      if (product && Number.isInteger(count) && count > 0 && count < 100) cart.set(product.id, count);
    });
  } catch (error) {
    console.warn("Could not restore the preview bag:", error);
  }
}

function saveCart() {
  try {
    sessionStorage.setItem("anax-preview-cart", JSON.stringify([...cart.entries()]));
  } catch (error) {
    console.warn("Could not save the preview bag:", error);
  }
}

function renderFilters() {
  const categories = ["All", ...new Set(PRODUCTS.map(item => item.category))];
  $("filterList").innerHTML = categories.map(category =>
    `<button class="filter-chip${category === activeCategory ? " active" : ""}" type="button" data-category="${category}" aria-pressed="${category === activeCategory}">${category === "All" ? "All items" : category}</button>`
  ).join("");
}

function getVisibleProducts() {
  const term = $("productSearch").value.trim().toLowerCase();
  const order = $("sortProducts").value;
  let list = PRODUCTS.filter(item =>
    (activeCategory === "All" || item.category === activeCategory) &&
    (item.name.toLowerCase().includes(term) || item.category.toLowerCase().includes(term) || item.description.toLowerCase().includes(term))
  );
  if (order === "low") list = [...list].sort((a,b) => a.price - b.price);
  if (order === "high") list = [...list].sort((a,b) => b.price - a.price);
  if (order === "az") list = [...list].sort((a,b) => a.name.localeCompare(b.name));
  return list;
}

function renderProducts() {
  const term = $("productSearch").value.trim();
  const visible = getVisibleProducts();
  $("resultCount").textContent = `Showing ${visible.length} of ${PRODUCTS.length} sample items`;
  $("clearSearch").hidden = !term;
  if (!visible.length) {
    $("productGrid").innerHTML = '<div class="empty-state">No matching items found. Try another search or choose “All items”.</div>';
    return;
  }
  $("productGrid").innerHTML = visible.map(item => `
    <article class="product-card">
      <div class="product-art" style="--art-bg:${item.bg}">
        <span class="art-badge">Preview item</span><div class="art-shape ${item.art}" aria-hidden="true"></div>
      </div>
      <div class="product-info">
        <div class="product-meta"><h3 class="product-name">${item.name}</h3><span class="product-price">${money(item.price)}</span></div>
        <div class="product-category">${item.category}</div>
        <p class="product-description">${item.description}</p>
        <div class="product-bottom"><button class="add-button" type="button" data-add="${item.id}">Add to bag +</button><span class="demo-price">SAMPLE PRICE</span></div>
      </div>
    </article>`
  ).join("");
}

function cartTotal() {
  return [...cart.entries()].reduce((sum, [id, quantity]) => {
    const product = PRODUCTS.find(item => item.id === id);
    return sum + (product ? product.price * quantity : 0);
  }, 0);
}

function renderCart() {
  const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  $("bagCount").textContent = String(count);
  $("openCart").setAttribute("aria-label", `Open shopping bag, ${count} items`);
  if (cart.size === 0) {
    $("cartLines").innerHTML = '<div class="cart-empty">Your bag is empty.<br>Explore the collection to add a sample item.</div>';
  } else {
    $("cartLines").innerHTML = [...cart.entries()].map(([id, quantity]) => {
      const item = PRODUCTS.find(product => product.id === id);
      return `<div class="cart-line">
        <div><strong>${item.name}</strong><small>${money(item.price)} · sample price</small></div>
        <div class="quantity-control">
          <button type="button" data-quantity="${id}" data-step="-1" aria-label="Remove one ${item.name}">−</button>
          <span>${quantity}</span>
          <button type="button" data-quantity="${id}" data-step="1" aria-label="Add one ${item.name}">+</button>
        </div>
      </div>`;
    }).join("");
  }
  $("cartSubtotal").textContent = money(cartTotal());
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2300);
}

function openCart() {
  lastFocusedElement = document.activeElement;
  $("overlay").hidden = false;
  requestAnimationFrame(() => $("overlay").classList.add("visible"));
  $("cartDrawer").classList.add("open");
  $("cartDrawer").setAttribute("aria-hidden", "false");
  $("closeCart").focus();
  document.body.classList.add("drawer-open");
}

function closeCart() {
  $("cartDrawer").classList.remove("open");
  $("cartDrawer").setAttribute("aria-hidden", "true");
  $("overlay").classList.remove("visible");
  window.setTimeout(() => { $("overlay").hidden = true; }, 230);
  document.body.classList.remove("drawer-open");
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function sendWhatsAppEnquiry() {
  if (cart.size === 0) {
    showToast("Your bag is empty.");
    return;
  }
  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER) || WHATSAPP_NUMBER.includes("X")) {
    showToast("WhatsApp is not set up yet. The store owner must add a contact number.");
    return;
  }
  const lines = [...cart.entries()].map(([id, quantity]) => {
    const item = PRODUCTS.find(product => product.id === id);
    return `${item.name} × ${quantity} — ${money(item.price * quantity)} (sample price)`;
  });
  const message = [
    "Hello ANAX, I have a product enquiry:",
    ...lines,
    `Sample subtotal: ${money(cartTotal())}`,
    "Please confirm actual product availability, final price and delivery details. I understand this is an enquiry, not a confirmed order."
  ].join("\n");
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function init() {
  $("year").textContent = String(new Date().getFullYear());
  loadCart();
  renderFilters();
  renderProducts();
  renderCart();

  $("productSearch").addEventListener("input", renderProducts);
  $("sortProducts").addEventListener("change", renderProducts);
  $("clearSearch").addEventListener("click", () => {
    $("productSearch").value = "";
    $("productSearch").focus();
    renderProducts();
  });

  document.addEventListener("click", event => {
    const categoryButton = event.target.closest("[data-category]");
    if (categoryButton) {
      activeCategory = categoryButton.dataset.category;
      renderFilters();
      renderProducts();
      return;
    }
    const addButton = event.target.closest("[data-add]");
    if (addButton) {
      const id = Number(addButton.dataset.add);
      cart.set(id, (cart.get(id) || 0) + 1);
      saveCart();
      renderCart();
      showToast("Added to your bag.");
      return;
    }
    const quantityButton = event.target.closest("[data-quantity]");
    if (quantityButton) {
      const id = Number(quantityButton.dataset.quantity);
      const next = (cart.get(id) || 0) + Number(quantityButton.dataset.step);
      if (next <= 0) cart.delete(id);
      else cart.set(id, Math.min(next, 99));
      saveCart();
      renderCart();
    }
  });

  $("openCart").addEventListener("click", openCart);
  $("closeCart").addEventListener("click", closeCart);
  $("overlay").addEventListener("click", closeCart);
  $("whatsappEnquiry").addEventListener("click", sendWhatsAppEnquiry);
  $("menuToggle").addEventListener("click", () => {
    const isOpen = $("menuToggle").getAttribute("aria-expanded") === "true";
    $("menuToggle").setAttribute("aria-expanded", String(!isOpen));
    $("menuToggle").setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    $("mobileNav").hidden = isOpen;
  });
  $("mobileNav").addEventListener("click", event => {
    if (event.target.closest("a")) {
      $("mobileNav").hidden = true;
      $("menuToggle").setAttribute("aria-expanded", "false");
      $("menuToggle").setAttribute("aria-label", "Open navigation");
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if ($("cartDrawer").classList.contains("open")) closeCart();
      if (!$("mobileNav").hidden) {
        $("mobileNav").hidden = true;
        $("menuToggle").setAttribute("aria-expanded", "false");
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
