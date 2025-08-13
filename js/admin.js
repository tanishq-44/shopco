let products = [];
let editingIndex = -1;

function showAddForm() {
  document.getElementById("formTitle").textContent = "Add New Product";
  document.getElementById("productForm").style.display = "block";
  document.getElementById("productFormElement").reset();
  editingIndex = -1;
}

function hideForm() {
  document.getElementById("productForm").style.display = "none";
  editingIndex = -1;
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUpload = document.querySelector(".image-upload");
      imageUpload.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 5px;">`;
    };
    reader.readAsDataURL(file);
  }
}

document
  .getElementById("productFormElement")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const product = {
      id: editingIndex >= 0 ? products[editingIndex].id : Date.now(),
      name: document.getElementById("productName").value,
      sku: document.getElementById("productSku").value,
      price: parseFloat(document.getElementById("productPrice").value),
      quantity: parseInt(document.getElementById("productQuantity").value),
      availability: document.getElementById("productAvailability").value,
      description: document.getElementById("productDescription").value,
      image: document.querySelector(".image-upload img")?.src || null,
    };

    if (editingIndex >= 0) {
      products[editingIndex] = product;
      editingIndex = -1;
    } else {
      products.push(product);
    }

    hideForm();
    renderProducts();
    resetImageUpload();
  });

function resetImageUpload() {
  const imageUpload = document.querySelector(".image-upload");
  imageUpload.innerHTML = `
                <div class="image-upload-icon">+</div>
                <div>Add Image</div>
            `;
}

function renderProducts() {
  const tbody = document.getElementById("productTableBody");

  if (products.length === 0) {
    tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="empty-state">
                            <h3>No products found</h3>
                            <p>Click "Add New Product" to get started</p>
                        </td>
                    </tr>
                `;
    return;
  }

  tbody.innerHTML = products
    .map(
      (product, index) => `
                <tr>
                    <td>
                        ${
                          product.image
                            ? `<img src="${product.image}" class="product-image" alt="Product">`
                            : `<div class="product-image"></div>`
                        }
                    </td>
                    <td>${product.name}</td>
                    <td>${product.sku}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.quantity}</td>
                    <td>
                        <span class="status-${product.availability}">
                            ${
                              product.availability === "enabled"
                                ? "Enabled"
                                : "Disabled"
                            }
                        </span>
                    </td>
                    <td class="actions">
                        <button class="btn-secondary" onclick="editProduct(${index})">Edit</button>
                        <button class="btn-danger" onclick="deleteProduct(${index})">Delete</button>
                    </td>
                </tr>
            `
    )
    .join("");
}

function editProduct(index) {
  const product = products[index];
  editingIndex = index;

  document.getElementById("formTitle").textContent = "Edit Product";
  document.getElementById("productName").value = product.name;
  document.getElementById("productSku").value = product.sku;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productQuantity").value = product.quantity;
  document.getElementById("productAvailability").value = product.availability;
  document.getElementById("productDescription").value = product.description;

  if (product.image) {
    const imageUpload = document.querySelector(".image-upload");
    imageUpload.innerHTML = `<img src="${product.image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 5px;">`;
  }

  document.getElementById("productForm").style.display = "block";
}

function deleteProduct(index) {
  if (confirm("Are you sure you want to delete this product?")) {
    products.splice(index, 1);
    renderProducts();
  }
}

function searchProducts() {
  const searchTerm = document
    .getElementById("productSearch")
    .value.toLowerCase();
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.sku.toLowerCase().includes(searchTerm)
  );

  const tbody = document.getElementById("productTableBody");

  if (filteredProducts.length === 0 && searchTerm) {
    tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="empty-state">
                            <h3>No products found</h3>
                            <p>No products match your search criteria</p>
                        </td>
                    </tr>
                `;
    return;
  }

  if (filteredProducts.length === 0 && !searchTerm) {
    renderProducts();
    return;
  }

  tbody.innerHTML = filteredProducts
    .map((product, originalIndex) => {
      const actualIndex = products.findIndex((p) => p.id === product.id);
      return `
                    <tr>
                        <td>
                            ${
                              product.image
                                ? `<img src="${product.image}" class="product-image" alt="Product">`
                                : `<div class="product-image"></div>`
                            }
                        </td>
                        <td>${product.name}</td>
                        <td>${product.sku}</td>
                        <td>$${product.price.toFixed(2)}</td>
                        <td>${product.quantity}</td>
                        <td>
                            <span class="status-${product.availability}">
                                ${
                                  product.availability === "enabled"
                                    ? "Enabled"
                                    : "Disabled"
                                }
                            </span>
                        </td>
                        <td class="actions">
                            <button class="btn-secondary" onclick="editProduct(${actualIndex})">Edit</button>
                            <button class="btn-danger" onclick="deleteProduct(${actualIndex})">Delete</button>
                        </td>
                    </tr>
                `;
    })
    .join("");
}

// Sidebar search functionality
document.getElementById("searchInput").addEventListener("keyup", function () {
  const searchTerm = this.value.toLowerCase();
  searchProducts();
});

// Initialize
renderProducts();
