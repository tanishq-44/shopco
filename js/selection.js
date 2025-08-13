document.addEventListener("DOMContentLoaded", function () {
  // Color selection with tick mark
  const colorEls = document.querySelectorAll(".prod-colors .color");
  let tickEl = document.querySelector(".prod-colors .color-tick");
  if (!tickEl) {
    tickEl = document.createElement("span");
    tickEl.className = "color-tick";
    tickEl.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
        <path d="M5 9L8 12L13 7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
  colorEls.forEach((el) => {
    el.addEventListener("click", function () {
      colorEls.forEach((c) => c.classList.remove("selected"));
      this.classList.add("selected");
      colorEls.forEach((c) => {
        if (c.contains(tickEl)) c.removeChild(tickEl);
      });
      this.appendChild(tickEl);
    });
  });

  // Size selection
  const sizeEls = document.querySelectorAll(".prod-sizes .size");
  sizeEls.forEach((el) => {
    el.addEventListener("click", function () {
      sizeEls.forEach((s) => s.classList.remove("selected"));
      this.classList.add("selected");
    });
  });

  // Quantity + - buttons
  const minusBtn = document.querySelector(
    '.quant .quant-icon[alt="minus icon"]'
  );
  const plusBtn = document.querySelector('.quant .quant-icon[alt="plus icon"]');
  const quantSpan = document.querySelector(".quant > span");

  // Get product stock from localStorage using id from URL
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let stock = 10; // default max

   if (productId) {
     const singleProduct = products.find((p) => p.id == productId);
     if (singleProduct && typeof singleProduct.quantity === "number") {
       stock = singleProduct.quantity;
     }
   }

  let quantity = 1;
  quantSpan.textContent = quantity;

  minusBtn.addEventListener("click", function () {
    if (quantity > 1) {
      quantity--;
      quantSpan.textContent = quantity;
    }
  });

  plusBtn.addEventListener("click", function () {
    if (quantity < stock) {
      quantity++;
      quantSpan.textContent = quantity;
    }
  });
});
