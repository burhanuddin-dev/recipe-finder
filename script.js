const mealDisplayContainer = document.querySelector(".meal-display-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.querySelector(".search-btn");
const searchQuerySpan = document.querySelector(".search-query");
const backBtn = document.querySelector(".back-btn");
const headerSection = document.querySelector(".top-section");
const recipeInstructionsContainer = document.querySelector(
  ".recipe-instructions-container",
);
const errorContainer = document.querySelector(".error-container");

const API = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

searchBtn.addEventListener("click", searchMeal);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchMeal();
  }
});

async function searchMeal() {
  const mealName = searchInput.value.trim();

  if (mealName === "") return;

  try {
    const response = await fetch(`${API}${mealName}`);
    const mealData = await response.json();

    console.log(mealData);

    if (mealData.meals === null) {
      errorContainer.style.display = "block";
      errorContainer.innerHTML = `
  <p>No recipes found for "<strong>${searchInput.value.trim()}</strong>".</p>
`;

      searchQuerySpan.style.display = "none";
      mealDisplayContainer.style.display = "none";
    } else {
      errorContainer.style.display = "none";
      mealDisplayContainer.style.display = "grid";
      searchQuerySpan.style.display = "block";

      showSearchQuery();
      displayMeals(mealData.meals);
    }
  } catch (error) {
    console.log(error);
  }
}

function showSearchQuery() {
  const query = searchInput.value.trim();
  searchQuerySpan.innerText = `Search results for "${query}":`;
}

function displayMeals(mealsArray) {
  mealDisplayContainer.innerHTML = "";

  mealsArray.forEach((item) => {
    const mealCard = document.createElement("div");
    const imgDiv = document.createElement("div");
    const mealName = document.createElement("div");
    const mealCategorySpan = document.createElement("span");

    mealCard.classList.add("meal-card");
    imgDiv.classList.add("img-container");
    mealName.classList.add("meal-name");
    mealCategorySpan.classList.add("meal-category");

    imgDiv.innerHTML = `<img
                     class="meal-image"
                     src="${item.strMealThumb}"
                     alt="Meal Image"
                     loading="lazy"
                     />`;

    mealName.innerHTML = `<h3>${item.strMeal}</h3>`;

    mealCategorySpan.innerText = `${item.strCategory}`;

    mealCard.append(imgDiv, mealName, mealCategorySpan);

    mealDisplayContainer.appendChild(mealCard);

    mealCard.addEventListener("click", () => {
      displayMealInstructions(item);
    });
  });
}

function displayMealInstructions(meal) {
  window.scrollTo({
    top: 0,
    behavior: "auto",
  });

  mealDisplayContainer.style.display = "none";
  headerSection.style.display = "none";
  searchQuerySpan.style.display = "none";

  const filteredArray = Object.keys(meal).filter((key) => {
    return key.includes("strIngredient") && meal[key] && meal[key].trim() !== "";
  });

  recipeInstructionsContainer.style.display = "block";

  recipeInstructionsContainer.innerHTML = `<button onclick="backToDisplay()" class="back-btn">
        <i class="fa-solid fa-arrow-left-long"></i> Back to Recipes
      </button>

      <div class="recipe-img-container">
        <img
          class="meal-image"
          src="${meal.strMealThumb}"
          alt="Recipe Image"
          loading="lazy"
        />
      </div>

      <div class="instructions-recipe-header">
        <h2 class="recipe-name">${meal.strMeal}</h2>
        <span class="recipe-category">${meal.strCategory}</span>
      </div>

      <div class="instructions-container">
        <h3>Instructions</h3>
        <p class="recipe-instructions">${meal.strInstructions}</p>
      </div>

      <div class="ingredients-container">
        <h3>Ingredients</h3>
        <ul class="ingredients-list">
        ${filteredArray
          .map((item) => {
            return `<li class="list-item">
            <i class="fa-solid fa-circle-check"></i> ${meal[item]}
          </li>`;
          })
          .join(" ")}
        </ul>
      </div>

       <a class="video-link" href="${meal.strYoutube}" target="_blank">
        <i class="fa-brands fa-youtube"></i> Watch Video
      </a>
      `;
}

function backToDisplay() {
  recipeInstructionsContainer.style.display = "none";
  headerSection.style.display = "block";
  mealDisplayContainer.style.display = "grid";
  headerSection.style.display = "block";
  searchQuerySpan.style.display = "block";
}
