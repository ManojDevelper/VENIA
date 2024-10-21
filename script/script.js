let productList = [];
let selectedCategories = [];
let searchTerm = "";
let viewMoreCount = 9;
let sortType = "low-to-high";

async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    console.log("data", data);
    productList = data;
    displayProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function displayProducts() {
  // for desktop
  const filterList = document.getElementById("filter_option_container");
  filterList.innerHTML = ""; // Clear any existing content

  const categories = [...new Set(productList.map((item) => item.category))];

  categories.forEach((category) => {
    const filterOpt = document.createElement("div");
    filterOpt.classList.add("filter_option");
    filterOpt.innerHTML = `
          <input type="checkbox" value="${category}" class="filter_option_checkbox" onchange="handleFilterCategory(event)" />
          <label>${category}</label>
          `;
    filterList.appendChild(filterOpt);
  });

  // for mobile
  const filterListMobile = document.getElementById(
    "filter_option_container_mobile"
  );
  filterListMobile.innerHTML = ""; // Clear any existing content

  const categoriesMobile = [
    ...new Set(productList.map((item) => item.category)),
  ];

  categoriesMobile.forEach((category) => {
    const filterOpt = document.createElement("div");
    filterOpt.classList.add("filter_option");
    filterOpt.innerHTML = `
          <input type="checkbox" value="${category}" class="filter_option_checkbox" onchange="handleFilterCategory(event)" />
          <label>${category}</label>
          `;
    filterListMobile.appendChild(filterOpt);
  });

  renderProducts(); // Initial render
}

// on click show product modal
function handleCardClick(index) {
  console.log("index", index);

  const getSelectedItem = productList?.find((item, i) => i === index);
  console.log("getSelectedItem", getSelectedItem);
  // Populate modal with product details
  document.getElementById("product_detail_title").innerText =
    getSelectedItem.title;
  document.getElementById("product_detail_title_overview").innerText =
    getSelectedItem.title;
  document.getElementById("product_detail_image_view").src =
    getSelectedItem.image;
  document.getElementById("product_detail_image_classfication_1").src =
    getSelectedItem.image;
  document.getElementById("product_detail_image_classfication_2").src =
    getSelectedItem.image;
  document.getElementById("product_detail_image_classfication_3").src =
    getSelectedItem.image;
  document.getElementById("product_detail_image_classfication_4").src =
    getSelectedItem.image;
  document.getElementById("product_detail_image_classfication_5").src =
    getSelectedItem.image;
  document.getElementById("product_detail_description").innerText =
    getSelectedItem.description;
  document.getElementById("product_detail_description_overview").innerText =
    getSelectedItem.description;
  document.getElementById(
    "product_detail_price"
  ).innerText = `$${getSelectedItem.price}`;

  // Show modal
  document.getElementById("banner-container").style = "display: none;";
  document.getElementById("category_wrapper").style = "display: none;";
  document.getElementById("product_detail_container_wrapper").style =
    "display: inherit;";

  // Reset quantity to 1
  let quantity = 1;
  updateModalQuantity(quantity);

  // Event listeners for increase/decrease buttons
  document.getElementById("modal-increase").onclick = () => {
    quantity++;
    updateModalQuantity(quantity);
  };

  document.getElementById("modal-decrease").onclick = () => {
    if (quantity > 1) quantity--; // Prevent going below 1
    updateModalQuantity(quantity);
  };
}

// Render Products
function renderProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = ""; // Clear any existing content
  const filteredProducts = productList.filter((product) => {
    return (
      (selectedCategories.length === 0 ||
        selectedCategories.includes(product.category)) &&
      (product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.price.toString().includes(searchTerm))
    );
  });

  document.getElementById(
    "resultsCount"
  ).innerText = `${filteredProducts.length} Results`;

  document.getElementById(
    "resultsCount_mobile"
  ).innerText = `${filteredProducts.length} Results`;

  const productsToShow = filteredProducts.slice(0, viewMoreCount);

  productsToShow.forEach((product, index) => {
    const card = document.createElement("div");
    card.classList.add("category_cards_wrapper");
    card.innerHTML = `
          <div class="category_card_image_wrapper" onclick="handleCardClick(${index})">
              <img src="${product.image}" alt="${product.title}" class="category_card_image" />
          </div>
          <div class="category_card_details_wrapper">
              <h2 class="category_card_title">${product.title}</h2>
              <span class="category_card_price">$${product.price}</span>
              <br />
              <img src="./assets/icons/heart.png" alt="heart" class="add_to_favourite" />
          </div>
          `;

    productsContainer.appendChild(card);
  });
}

function handleFilterCategory(event) {
  const checkbox = event.target;
  const category = checkbox.value;

  if (checkbox.checked) {
    selectedCategories.push(category);
  } else {
    selectedCategories = selectedCategories.filter((cat) => cat !== category);
  }

  renderProducts(); // Re-render filtered products
}

// sort func for desktop
function handleSortChange(event) {
  const sortOption = event.target.value;

  if (sortOption === "low-to-high") {
    productList.sort((a, b) => a.price - b.price);
  } else if (sortOption === "high-to-low") {
    productList.sort((a, b) => b.price - a.price);
  }

  renderProducts(); // Re-render products
}

// Sort func for mobile view
function handleSortMobileChange() {
  const sortOption = sortType;

  if (sortOption === "low-to-high") {
    productList.sort((a, b) => a.price - b.price);
    sortType = "high-to-low";
  } else if (sortOption === "high-to-low") {
    productList.sort((a, b) => b.price - a.price);
    sortType = "low-to-high";
  }

  renderProducts(); // Re-render products
}

function handleSearch(event) {
  searchTerm = event.target.value; // Update the search term
  renderProducts(); // Re-render products based on the search term
}

function handleViewMore() {
  viewMoreCount += 9; // Increase the count by 9 for next view
  document.getElementById("category_cards_list_View_more").innerHTML =
    productList?.length >= viewMoreCount ? "" : "New text!";
  renderProducts(); // Re-render products
}

// to show column options on click nav bar in mobile view
document
  .getElementById("navbar_hamburger_mobile")
  .addEventListener("click", function () {
    const card = document.getElementById("navbar_menu_mobile");
    card.classList.remove("hidden");
    card.classList.toggle("show");
  });

// on click on remove button (X)
document.getElementById("navbar_remove").addEventListener("click", function () {
  const card = document.getElementById("navbar_menu_mobile");
  card.classList.remove("show");
  card.classList.toggle("hidden");
});

// on click on remove button (X)
document.getElementById("resultsCount").addEventListener("click", function () {
  const card = document.getElementById("navbar_menu_mobile");
  card.classList.remove("show");
  card.classList.toggle("hidden");
});

// Function to increase and decrease count
let count = 0;

const countInput = document.getElementById("product_quantity_input");
const increaseButton = document.getElementById("increase");
const decreaseButton = document.getElementById("decrease");

increaseButton.addEventListener("click", () => {
  count++;
  updateCount();
});

decreaseButton.addEventListener("click", () => {
  count--;
  updateCount();
});

function updateCount() {
  countInput.value = count;
}

// Call the function to fetch products when the script loads
fetchProducts();
