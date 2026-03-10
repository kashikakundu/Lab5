const form = document.getElementById("recipe-form");
const ingredientsInput = document.getElementById("ingredients");
const dietSelect = document.getElementById("diet");
const message = document.getElementById("message");
const resultsContainer = document.getElementById("results");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const ingredients = ingredientsInput.value.trim();
  const diet = dietSelect.value;

  clearUI();

  if (!ingredients) {
    showMessage("Please enter at least one ingredient.");
    return;
  }

  showMessage("Loading recipes...");

  const apiBase = window.location.hostname === "localhost"
    ? "/api/recipes"
    : "/.netlify/functions/recipes";

  try {
    const response = await fetch(
      `${apiBase}?ingredients=${encodeURIComponent(ingredients)}&diet=${encodeURIComponent(diet)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recipes.");
    }

    const recipes = await response.json();

    if (!recipes || recipes.length === 0) {
      showMessage("No recipes found. Try different ingredients.");
      return;
    }

    showMessage("");
    displayRecipes(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    showMessage("Something went wrong. Please try again later.");
  }
});

function clearUI() {
  message.textContent = "";
  resultsContainer.innerHTML = "";
}

function showMessage(text) {
  message.textContent = text;
}

function displayRecipes(recipes) {
  resultsContainer.innerHTML = "";

  recipes.forEach((recipe) => {
    const card = document.createElement("article");
    card.classList.add("recipe-card");

    const image = document.createElement("img");
    image.src = recipe.image || "https://via.placeholder.com/300x200?text=No+Image";
    image.alt = recipe.title || "Recipe image";

    const cardBody = document.createElement("div");
    cardBody.classList.add("recipe-card-body");

    const title = document.createElement("h3");
    title.textContent = recipe.title || "Untitled Recipe";

    cardBody.appendChild(title);

    if (recipe.usedIngredientCount && recipe.usedIngredientCount > 0) {
      const ingredients = document.createElement("p");
      ingredients.classList.add("recipe-ingredients");
      ingredients.textContent = `Used ingredients: ${recipe.usedIngredientCount}`;
      cardBody.appendChild(ingredients);
    }

    card.appendChild(image);
    card.appendChild(cardBody);

    resultsContainer.appendChild(card);
  });
}