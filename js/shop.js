// shop.js

// Get all products from localStorage
function getAllProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

// Get single product by ID
function getProductById(id) {
  const products = getAllProducts();
  return products.find((p) => p.id === id);
}

// Update product by ID
function updateProduct(id, updatedFields) {
  const products = getAllProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedFields };
    localStorage.setItem("products", JSON.stringify(products));
    return true;
  }
  return false;
}

// Delete product by ID
function deleteProduct(id) {
  const products = getAllProducts().filter((p) => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
}

// Filter products by exact ID match
function filterProductsById(searchId) {
  return getAllProducts().filter((p) => p.id === searchId);
}

// Search products by name (case-insensitive)
function searchProducts(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return getAllProducts().filter((p) =>
    p.name.toLowerCase().includes(lowerKeyword)
  );
}

const products = getAllProducts();
// Product Remdering
// Example product data (could come from localStorage, API, etc.)
// const products = [
//   {
//     id: 1,
//     name: "Summer Floral Dress",
//     image: "./assets/images/shop/image 8.png",
//     price: 1299,
//     description: "Lightweight and perfect for warm days.",
//     rating: 4.5,
//   },
//   {
//     id: 2,
//     name: "Classic White Shirt",
//     image: "./assets/images/shop/image 8.png",
//     price: 899,
//     description: "Cotton fabric with a crisp, clean look.",
//     rating: 3.5,
//   },
//   {
//     id: 3,
//     name: "Denim Jacket",
//     image: "./assets/images/shop/image 8.png",
//     price: 120,
//     description: "Stylish and comfortable for cool evenings.",
//     rating: 4.0,
//     discount: 30,
//   },
//   {
//     id: 4,
//     name: "Leather Handbag",
//     image: "./assets/images/shop/image 8.png",
//     price: 2599,
//     description: "Premium leather with elegant stitching.",
//     rating: 2.5,
//   },
//   {
//     id: 5,
//     name: "Running Sneakers",
//     image: "./assets/images/shop/image 8.png",
//     price: 1799,
//     description: "Comfortable cushioning for daily wear.",
//     rating: 5.0,
//   },
// ];

// Render function
function renderProducts() {
  const container = document.getElementById("productList");
  container.innerHTML = ""; // Clear existing

  products.forEach((product) => {
    const fullStars = Math.floor(product.rating); // Whole stars
    const hasHalfStar = product.rating % 1 !== 0; // Check for .5 star

    let starsHTML = "";
    for (let i = 0; i < fullStars; i++) {
      starsHTML += `<img src="./assets/icons/full-star.svg" alt="Full Star" />`;
    }
    if (hasHalfStar) {
      starsHTML += `<img src="./assets/icons/half-star.svg" alt="Half Star" />`;
    }

    let discountHtml = "";
    if (product?.discount) {
      discountHtml = `
        <div class="price">
            <span>₹${product.price}</span>
            <del>₹${
              product.price + (product.price * product.discount) / 100
            }</del>
            <div class="discount"><span>-${product.discount}%</span></div>
        </div>`;
    } else {
      discountHtml = `
        <div class="price">
            <span>$${product.price}</span>
        </div>`;
    }

    const card = document.createElement("div");
    card.classList.add("shop-card");
    card.innerHTML = `
      <div class="shop-card-img">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <p class="shop-name">${product.name}</p>
      <div class="shop-rating">
        ${starsHTML}
        <span>${product.rating}/5</span>
      </div>
      ${discountHtml}
    `;
    container.appendChild(card);

    card.addEventListener("click", () => {
      const productId = product?.id;
      if (productId) {
        window.location.href = `product.html?id=${productId}`;
      }
    });
  });
}

// Call on load
document.addEventListener("DOMContentLoaded", renderProducts);

document.addEventListener("DOMContentLoaded", function () {
  function setupColorSelection(containerSelector) {
    const colorEls = document.querySelectorAll(`${containerSelector} .color`);
    let tickEl = document.querySelector(`${containerSelector} .color-tick`);
    if (!tickEl) {
      tickEl = document.createElement("span");
      tickEl.className = "color-tick";
    }
    colorEls.forEach((el) => {
      el.addEventListener("click", function () {
        colorEls.forEach((c) => c.classList.remove("selected"));
        this.classList.add("selected");
        colorEls.forEach((c) => {
          if (c.contains(tickEl)) c.removeChild(tickEl);
        });
        // Check if color is white
        const bg = window.getComputedStyle(this).backgroundColor;
        if (bg === "rgb(255, 255, 255)") {
          tickEl.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
              <path d="M5 9L8 12L13 7" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `;
        } else {
          tickEl.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
              <path d="M5 9L8 12L13 7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `;
        }
        this.appendChild(tickEl);
      });
    });
    // Show tick on the initially selected color
    const selected = Array.from(colorEls).find((c) =>
      c.classList.contains("selected")
    );
    if (selected && !selected.contains(tickEl)) {
      const bg = window.getComputedStyle(selected).backgroundColor;
      if (bg === "rgb(255, 255, 255)") {
        tickEl.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
            <path d="M5 9L8 12L13 7" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
      } else {
        tickEl.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
            <path d="M5 9L8 12L13 7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
      }
      selected.appendChild(tickEl);
    }
  }

  function setupSizeSelection(containerSelector) {
    const sizeEls = document.querySelectorAll(`${containerSelector} .size`);
    sizeEls.forEach((el) => {
      el.addEventListener("click", function () {
        sizeEls.forEach((s) => s.classList.remove("selected"));
        this.classList.add("selected");
      });
    });
  }

  setupColorSelection(".filters .colors");
  setupSizeSelection(".filters .sizes");
  setupColorSelection(".filter-overlay .colors");
  setupSizeSelection(".filter-overlay .sizes");
});

document.addEventListener("DOMContentLoaded", function () {
  // Double-thumb slider logic
  const minInput = document.getElementById("min-price");
  const maxInput = document.getElementById("max-price");
  const slider = document.querySelector(".price-slider");

  // Create selected range bar
  let selectedRange = slider.querySelector(".selected-range");
  if (!selectedRange) {
    selectedRange = document.createElement("div");
    selectedRange.className = "selected-range";
    slider.appendChild(selectedRange);
  }

  function updateRangeBar() {
    const min = parseInt(minInput.min);
    const max = parseInt(maxInput.max);
    const minVal = parseInt(minInput.value);
    const maxVal = parseInt(maxInput.value);

    // Prevent overlap
    if (minVal > maxVal) {
      minInput.value = maxVal;
    }
    if (maxVal < minVal) {
      maxInput.value = minVal;
    }

    // Calculate positions
    const percentMin = ((minInput.value - min) / (max - min)) * 100;
    const percentMax = ((maxInput.value - min) / (max - min)) * 100;

    selectedRange.style.left = percentMin + "%";
    selectedRange.style.width = percentMax - percentMin + "%";
  }

  minInput.addEventListener("input", updateRangeBar);
  maxInput.addEventListener("input", updateRangeBar);

  updateRangeBar();
});
