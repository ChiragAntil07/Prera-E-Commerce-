const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortOption = document.getElementById("sortOption");
const favoritesOnly = document.getElementById("favoritesOnly");
const themeToggle = document.getElementById("themeToggle");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const resultCount = document.getElementById("resultCount");
const productModal = document.getElementById("productModal");
const closeModalButton = document.getElementById("closeModalButton");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalRating = document.getElementById("modalRating");
const modalDescription = document.getElementById("modalDescription");

const FAVORITES_STORAGE_KEY = "preraFavoriteProducts";
const THEME_STORAGE_KEY = "preraTheme";
const SEARCH_DELAY = 300;

let allProducts = [];
let favoriteIds = getStoredFavorites();
let searchTimeoutId = 0;

function getStoredFavorites() {
  try {
    const storedFavorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY));

    if (!Array.isArray(storedFavorites)) {
      return [];
    }

    return storedFavorites
      .map(function (item) {
        return Number(item);
      })
      .filter(function (item) {
        return !Number.isNaN(item);
      });
  } catch {
    return [];
  }
}

function formatCategoryLabel(category) {
  return category
    .split("-")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function formatPrice(price) {
  return "$" + price.toFixed(2);
}

function updateThemeButton() {
  const darkModeEnabled = document.body.classList.contains("dark-theme");

  themeToggle.textContent = darkModeEnabled
    ? "☀️"
    : "🌙";
  themeToggle.setAttribute("aria-pressed", String(darkModeEnabled));
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }

  updateThemeButton();
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
  } else {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
  }

  updateThemeButton();
}

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

    allProducts = Array.isArray(data.products) ? data.products : [];
    populateCategories(allProducts);
    updateProducts();
  } catch {
    errorMessage.classList.remove("hidden");
    resultCount.classList.add("hidden");
    productList.innerHTML = "";
  } finally {
    loadingMessage.classList.add("hidden");
  }
}

function populateCategories(products) {
  const categories = products.map(function (product) {
    return product.category;
  });

  const uniqueCategories = categories
    .filter(function (category, index, allCategories) {
      return allCategories.indexOf(category) === index;
    })
    .sort(function (firstCategory, secondCategory) {
      return firstCategory.localeCompare(secondCategory);
    });

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  uniqueCategories.forEach(function (category) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = formatCategoryLabel(category);
    categoryFilter.appendChild(option);
  });
}

function getFilteredProducts() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;
  const selectedSort = sortOption.value;
  const showFavoritesOnly = favoritesOnly.checked;

  let updatedProducts = allProducts.filter(function (product) {
    const matchesSearch =
      product.title.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    const matchesFavorites =
      !showFavoritesOnly || favoriteIds.includes(product.id);

    return matchesSearch && matchesCategory && matchesFavorites;
  });

  if (selectedSort === "priceLowToHigh") {
    updatedProducts = updatedProducts.sort(function (firstProduct, secondProduct) {
      return firstProduct.price - secondProduct.price;
    });
  } else if (selectedSort === "priceHighToLow") {
    updatedProducts = updatedProducts.sort(function (firstProduct, secondProduct) {
      return secondProduct.price - firstProduct.price;
    });
  } else if (selectedSort === "nameAZ") {
    updatedProducts = updatedProducts.sort(function (firstProduct, secondProduct) {
      return firstProduct.title.localeCompare(secondProduct.title);
    });
  } else if (selectedSort === "ratingHighToLow") {
    updatedProducts = updatedProducts.sort(function (firstProduct, secondProduct) {
      return secondProduct.rating - firstProduct.rating;
    });
  }

  return updatedProducts;
}

function displayProducts(products) {
  productList.innerHTML = "";
  resultCount.classList.remove("hidden");
  resultCount.textContent =
    "Showing " + products.length + " of " + allProducts.length + " products";

  if (products.length === 0) {
    productList.innerHTML = `
      <article class="empty-state">
        <h2>No products found</h2>
        <p>Try a different search term, category, sort option, or favorites filter.</p>
      </article>
    `;
    return;
  }

  products.forEach(function (product) {
    const shortDescription =
      product.description.length > 88
        ? product.description.slice(0, 88) + "..."
        : product.description;
    const isFavorite = favoriteIds.includes(product.id);

    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-media">
        <img src="${product.thumbnail}" alt="${product.title}">
      </div>
      <div class="product-body">
        <p class="category-chip">${formatCategoryLabel(product.category)}</p>
        <h3>${product.title}</h3>
        <p class="price">${formatPrice(product.price)}</p>
        <p class="description">${shortDescription}</p>
        <div class="meta-row">
          <span>Rating: ${product.rating}</span>
          <span>Stock: ${product.stock}</span>
        </div>
        <div class="card-actions">
          <button class="secondary-btn view-btn" type="button" data-id="${product.id}">
            View More
          </button>
          <button
            class="favorite-btn ${isFavorite ? "active" : ""}"
            type="button"
            data-id="${product.id}"
            aria-pressed="${String(isFavorite)}"
          >
            ${isFavorite ? "Favorited" : "Favorite"}
          </button>
        </div>
      </div>
    `;

    productList.appendChild(card);
  });
}

function updateProducts() {
  const filteredProducts = getFilteredProducts();
  displayProducts(filteredProducts);
}

function toggleFavorite(productId) {
  const alreadyFavorite = favoriteIds.includes(productId);

  if (alreadyFavorite) {
    favoriteIds = favoriteIds.filter(function (id) {
      return id !== productId;
    });
  } else {
    favoriteIds = favoriteIds.concat(productId);
  }

  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  updateProducts();
}

function openProductModal(productId) {
  const selectedProduct = allProducts.find(function (product) {
    return product.id === productId;
  });

  if (!selectedProduct) {
    return;
  }

  modalImage.src = selectedProduct.thumbnail;
  modalImage.alt = selectedProduct.title;
  modalCategory.textContent =
    formatCategoryLabel(selectedProduct.category) +
    (selectedProduct.brand ? " | " + selectedProduct.brand : "");
  modalTitle.textContent = selectedProduct.title;
  modalPrice.textContent = "Price: " + formatPrice(selectedProduct.price);
  modalRating.textContent = "Rating: " + selectedProduct.rating + " / 5";
  modalDescription.textContent = selectedProduct.description;

  productModal.classList.remove("hidden");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProductModal() {
  productModal.classList.add("hidden");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function debounceProductSearch() {
  window.clearTimeout(searchTimeoutId);
  searchTimeoutId = window.setTimeout(updateProducts, SEARCH_DELAY);
}

searchInput.addEventListener("input", debounceProductSearch);
categoryFilter.addEventListener("change", updateProducts);
sortOption.addEventListener("change", updateProducts);
favoritesOnly.addEventListener("change", updateProducts);
themeToggle.addEventListener("click", toggleTheme);
closeModalButton.addEventListener("click", closeProductModal);

productList.addEventListener("click", function (event) {
  const clickedButton = event.target.closest("button[data-id]");

  if (!clickedButton) {
    return;
  }

  const productId = Number(clickedButton.dataset.id);

  if (clickedButton.classList.contains("favorite-btn")) {
    toggleFavorite(productId);
  }

  if (clickedButton.classList.contains("view-btn")) {
    openProductModal(productId);
  }
});

productModal.addEventListener("click", function (event) {
  if (event.target.dataset.closeModal === "true") {
    closeProductModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !productModal.classList.contains("hidden")) {
    closeProductModal();
  }
});

loadSavedTheme();
fetchProducts();
