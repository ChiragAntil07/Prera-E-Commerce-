const productList = document.getElementById("productList");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const resultCount = document.getElementById("resultCount");

async function fetchProducts() {
  loadingMessage.classList.remove("hidden");
  errorMessage.classList.add("hidden");
  resultCount.classList.add("hidden");
  productList.innerHTML = "";

  try {
    const response = await fetch("https://dummyjson.com/products");

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    displayProducts(data.products);
  } catch {
    errorMessage.classList.remove("hidden");
    resultCount.textContent = "";
  } finally {
    loadingMessage.classList.add("hidden");
  }
}

function displayProducts(products) {
  productList.innerHTML = "";
  resultCount.classList.remove("hidden");
  resultCount.textContent = "Total Products: " + products.length;

  if (products.length === 0) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }

  for (let index = 0; index < products.length; index += 1) {
    const product = products[index];
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p class="category-text">${product.category}</p>
      <p class="price">$${product.price}</p>
      <p class="description">${product.description.slice(0, 80)}...</p>
    `;

    productList.appendChild(card);
  }
}

fetchProducts();
