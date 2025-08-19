// ======= State =======
let products = [];
let currentEditId = null;

// ======= Sidebar (single definition) =======
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
}

// ======= Storage Helpers (use localStorage) =======
const STORAGE_KEY = "products";

function saveProductsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Error saving products:", error);
  }
}

function loadProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    products = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(products)) products = [];
  } catch (error) {
    console.error("Error loading products:", error);
    products = [];
  }
}

// ======= Init =======
document.addEventListener("DOMContentLoaded", function () {
  loadProducts();
  showProductsList();
  setupEventListeners();
});

function setupEventListeners() {
  // Products link in sidebar
  const productsLink = document.getElementById("productsLink");
  if (productsLink) {
    productsLink.addEventListener("click", function (e) {
      e.preventDefault();
      showProductsList();
    });
  }

  // Search functionality
  const searchEl = document.getElementById("searchInput");
  if (searchEl) {
    searchEl.addEventListener("input", function (e) {
      searchProducts(e.target.value);
    });
  }
}

// ======= View management =======
function showProductsList() {
  document.getElementById("productsView").classList.remove("hidden");
  document.getElementById("addProductView").classList.add("hidden");
  document.getElementById("editProductView").classList.add("hidden");

  // Update sidebar active state
  document.getElementById("productsLink").classList.add("active");

  renderProducts();
}

function showAddProductForm() {
  document.getElementById("productsView").classList.add("hidden");
  document.getElementById("addProductView").classList.remove("hidden");
  document.getElementById("editProductView").classList.add("hidden");

  clearAddProductForm();
}

function showEditProductForm(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  currentEditId = productId;
  document.getElementById("productsView").classList.add("hidden");
  document.getElementById("addProductView").classList.add("hidden");
  document.getElementById("editProductView").classList.remove("hidden");

  populateEditForm(product);
}

// ======= Render =======
function renderProducts() {
  const container = document.getElementById("productsContainer");

  if (!products || products.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
              <div class="empty-state-icon">📦</div>
              <div class="empty-state-text">No products found</div>
              <div class="empty-state-subtext">Start by adding your first product</div>
              <button class="btn-primary" onclick="showAddProductForm()">Add Your First Product</button>
            </div>
          `;
    return;
  }

  container.innerHTML = products
    .map(
      (product) => `
          <div class="product-item">
            <div>
              ${
                product.image
                  ? `<img src="${product.image}" alt="${product.name}" class="product-image">`
                  : `<div class="product-image-placeholder">📦</div>`
              }
            </div>
            <div class="product-info">
              <div class="product-name">${escapeHtml(product.name)}</div>
              <div class="product-sku">SKU: ${escapeHtml(product.sku)}</div>
              <div style="font-size: 0.85rem; color: #6c757d; margin-top: 0.25rem;">
                Qty: ${Number.isFinite(product.qty) ? product.qty : 0} ${
        product.requiresShipping ? "• Requires shipping" : ""
      }
              </div>
            </div>
            <div class="product-price">$${formatPrice(product.price)}</div>
            <div class="product-actions">
              <button class="btn-edit" onclick="showEditProductForm('${
                product.id
              }')">Edit</button>
              <button class="btn-danger" onclick="deleteProduct('${
                product.id
              }')">Delete</button>
            </div>
          </div>
        `
    )
    .join("");
}

function searchProducts(query) {
  const container = document.getElementById("productsContainer");

  if (!query) {
    renderProducts();
    return;
  }

  const q = query.toLowerCase();

  const filteredProducts = products.filter((product) => {
    const name = (product.name || "").toLowerCase();
    const sku = (product.sku || "").toLowerCase();
    const desc = (product.description || "").toLowerCase();
    const pric = (product.price || "").toString().toLowerCase();
    return (
      name.includes(q) ||
      sku.includes(q) ||
      desc.includes(q) ||
      pric.includes(q)
    );
  });

  if (filteredProducts.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
              <div class="empty-state-icon">🔍</div>
              <div class="empty-state-text">No products match your search</div>
              <div class="empty-state-subtext">Try different keywords or clear your search</div>
            </div>
          `;
    return;
  }

  container.innerHTML = filteredProducts
    .map(
      (product) => `
          <div class="product-item">
            <div>
              ${
                product.image
                  ? `<img src="${product.image}" alt="${product.name}" class="product-image">`
                  : `<div class="product-image-placeholder">📦</div>`
              }
            </div>
            <div class="product-info">
              <div class="product-name">${escapeHtml(product.name)}</div>
              <div class="product-sku">SKU: ${escapeHtml(product.sku)}</div>
              <div style="font-size: 0.85rem; color: #6c757d; margin-top: 0.25rem;">
                Qty: ${Number.isFinite(product.qty) ? product.qty : 0} ${
        product.requiresShipping ? "• Requires shipping" : ""
      }
              </div>
            </div>
            <div class="product-price">$${formatPrice(product.price)}</div>
            <div class="product-actions">
              <button class="btn-edit" onclick="showEditProductForm('${
                product.id
              }')">Edit</button>
              <button class="btn-danger" onclick="deleteProduct('${
                product.id
              }')">Delete</button>
            </div>
          </div>
        `
    )
    .join("");
}

// ======= CRUD =======
function saveProduct() {
  const name = document.getElementById("name").value.trim();
  const sku = document.getElementById("sku").value.trim();
  const priceStr = document.getElementById("price").value;
  const qtyStr = document.getElementById("qty").value;
  const description = document.getElementById("description").value.trim();
  const requiresShipping = document.getElementById("shipping").checked;
  const uploadedImageEl = document.getElementById("uploadedImage");

  // Validation
  const price = parseFloat(priceStr);
  const qty = parseInt(qtyStr, 10);
  if (!name || !sku || isNaN(price)) {
    alert("Please fill in all required fields (Name, SKU, Price).");
    return;
  }
  //   if (products.some((p) => p.sku === sku)) {
  //     alert("SKU already exists. Please use a unique SKU.");
  //     return;
  //   }

  const product = {
    id: Date.now().toString(),
    name,
    sku,
    price: price,
    qty: Number.isFinite(qty) ? qty : 0,
    description,
    requiresShipping,
    image: uploadedImageEl && uploadedImageEl.src ? uploadedImageEl.src : null,
    createdAt: new Date().toISOString(),
    rating: 5,
    discount: 15,
  };

  products.unshift(product);
  saveProductsToStorage();
  showProductsList();
  alert("Product added successfully!");
}

function updateProduct() {
  if (!currentEditId) return;

  const name = document.getElementById("editName").value.trim();
  const sku = document.getElementById("editSku").value.trim();
  const priceStr = document.getElementById("editPrice").value;
  const qtyStr = document.getElementById("editQty").value;
  const description = document.getElementById("editDescription").value.trim();
  const requiresShipping = document.getElementById("editShipping").checked;
  const uploadedImageEl = document.getElementById("editUploadedImage");

  const price = parseFloat(priceStr);
  const qty = parseInt(qtyStr, 10);

  if (!name || !sku || isNaN(price)) {
    alert("Please fill in all required fields (Name, SKU, Price).");
    return;
  }

  // Check for duplicate SKU (excluding current product)
  //   if (products.some((p) => p.sku === sku && p.id !== currentEditId)) {
  //     alert("SKU already exists. Please use a unique SKU.");
  //     return;
  //   }

  const productIndex = products.findIndex((p) => p.id === currentEditId);
  if (productIndex === -1) return;

  const existing = products[productIndex];

  products[productIndex] = {
    ...existing,
    name,
    sku,
    price: price,
    qty: Number.isFinite(qty) ? qty : 0,
    description,
    requiresShipping,
    image:
      uploadedImageEl && uploadedImageEl.src
        ? uploadedImageEl.src
        : existing.image || null,
    updatedAt: new Date().toISOString(),
  };

  saveProductsToStorage();
  currentEditId = null;
  showProductsList();

  alert("Product updated successfully!");
}

function deleteProduct(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  if (
    confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
    )
  ) {
    products = products.filter((p) => p.id !== productId);
    saveProductsToStorage();
    renderProducts();
    alert("Product deleted successfully!");
  }
}

// ======= Form handling =======
function clearAddProductForm() {
  document.getElementById("name").value = "";
  document.getElementById("sku").value = "";
  document.getElementById("price").value = "";
  document.getElementById("qty").value = "1";
  document.getElementById("description").value = "";
  document.getElementById("shipping").checked = true;

  // Clear image
  const imageUpload = document.querySelector("#addProductView .image-upload");
  const uploadedImage = document.getElementById("uploadedImage");
  imageUpload.classList.remove("has-image");
  uploadedImage.src = "";
}

function populateEditForm(product) {
  document.getElementById("editName").value = product.name || "";
  document.getElementById("editSku").value = product.sku || "";
  document.getElementById("editPrice").value =
    typeof product.price === "number" ? product.price : "";
  document.getElementById("editQty").value = Number.isFinite(product.qty)
    ? product.qty
    : 0;
  document.getElementById("editDescription").value = product.description || "";
  document.getElementById("editShipping").checked = !!product.requiresShipping;

  // Set image
  const imageUpload = document.querySelector("#editProductView .image-upload");
  const uploadedImage = document.getElementById("editUploadedImage");

  if (product.image) {
    uploadedImage.src = product.image;
    imageUpload.classList.add("has-image");
  } else {
    imageUpload.classList.remove("has-image");
    uploadedImage.src = "";
  }
}

// ======= Image upload =======
function triggerFileUpload() {
  document.getElementById("imageInput").click();
}

function triggerEditFileUpload() {
  document.getElementById("editImageInput").click();
}

function handleImageUpload(input) {
  const file = input.files && input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUpload = document.querySelector(
        "#addProductView .image-upload"
      );
      const uploadedImage = document.getElementById("uploadedImage");

      uploadedImage.src = e.target.result;
      imageUpload.classList.add("has-image");
    };
    reader.readAsDataURL(file);
  }
}

function handleEditImageUpload(input) {
  const file = input.files && input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUpload = document.querySelector(
        "#editProductView .image-upload"
      );
      const uploadedImage = document.getElementById("editUploadedImage");

      uploadedImage.src = e.target.result;
      imageUpload.classList.add("has-image");
    };
    reader.readAsDataURL(file);
  }
}

// ======= UI Helpers =======
function formatPrice(v) {
  const n = parseFloat(v);
  if (!isFinite(n)) return "0.00";
  return n.toFixed(2);
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Close sidebar when clicking outside on mobile
document.addEventListener("click", function (event) {
  const sidebar = document.getElementById("sidebar");
  const toggle = document.querySelector(".mobile-menu-toggle");

  if (
    window.innerWidth <= 768 &&
    !sidebar.contains(event.target) &&
    !(toggle && toggle.contains(event.target))
  ) {
    sidebar.classList.remove("open");
  }
});

// Handle window resize
window.addEventListener("resize", function () {
  const sidebar = document.getElementById("sidebar");
  if (window.innerWidth > 768) {
    sidebar.classList.remove("open");
  }
});

function goBack() {
  window.location.href = "shop.html";
}

function restrictToNumbers(event) {
  const charCode = event.which ? event.which : event.keyCode;
  // Allow numbers (0-9), backspace, delete, tab, enter, and arrow keys
  if (
    charCode > 31 &&
    (charCode < 48 || charCode > 57) &&
    ![8, 9, 13, 37, 39, 46].includes(charCode)
  ) {
    event.preventDefault(); // Prevent the character from being entered
  }
}