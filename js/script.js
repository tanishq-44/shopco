/* 
-----------------------------------------
|                                       |
|       Add Products Functionality      |
|                                       |
-----------------------------------------
  */

// ======= Product Template =======
let newProduct = {
  id: "",
  name: "",
  price: 0,
  sku: "",
  qty: 0,
  description: "",
  requiresShipping: true,
  image: "",
  rating: 5,
  discount: null,
  createdAt: "",
};

// ======= Load existing products =======
let products = JSON.parse(localStorage.getItem("products")) || [];

// ======= Select form elements =======
const addProductBtn = document.querySelector(".btn-primary");
const nameInput = document.querySelector("#name");
const skuInput = document.querySelector("#sku");
const qtyInput = document.querySelector("#qty");
const descriptionInput = document.querySelector("#description");
const priceInput = document.querySelector(".price-input");
const shippingCheckbox = document.querySelector("#shipping");
const imageInput = document.querySelector("#imageInput");
const uploadedImage = document.querySelector("#uploadedImage");
const imageUploadBox = document.querySelector(".image-upload");

// ======= Add Product Handler =======
addProductBtn.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("clicked");
  const file = imageInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      saveProduct(reader.result);
    };
    reader.readAsDataURL(file);
  } else if (uploadedImage.src && uploadedImage.src.trim() !== "") {
    saveProduct(uploadedImage.src);
  } else {
    saveProduct(null); // No image
  }
});

function saveProduct(imageBase64) {
  // Validation
  const price = parseFloat(priceInput.value);
  const qty = parseInt(qtyInput.value, 10);
  if (!nameInput.value.trim() || !skuInput.value.trim() || isNaN(price)) {
    alert("Please fill in all required fields (Name, SKU, Price).");
    return;
  }

  const product = {
    id: Date.now().toString(),
    name: nameInput.value.trim(),
    sku: skuInput.value.trim(),
    price: price,
    qty: Number.isFinite(qty) ? qty : 0,
    description: descriptionInput.value.trim(),
    requiresShipping: shippingCheckbox ? shippingCheckbox.checked : true,
    image: imageBase64 || null,
    rating: 5,
    discount: null,
    createdAt: new Date().toISOString(),
  };

  products.unshift(product);
  // products = [];
  localStorage.setItem("products", JSON.stringify(products));

  alert("Product added successfully!");

  resetForm();
}

// ======= Reset Form =======
function resetForm() {
  nameInput.value = "";
  skuInput.value = "";
  qtyInput.value = "1";
  descriptionInput.value = "";
  priceInput.value = "";
  if (shippingCheckbox) shippingCheckbox.checked = true;
  imageInput.value = "";
  uploadedImage.src = "";
  imageUploadBox.classList.remove("has-image");
}

// ======= Image Preview =======
imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImage.src = e.target.result;
      imageUploadBox.classList.add("has-image");
    };
    reader.readAsDataURL(file);
  }
});

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