/**
 * @jest-environment jsdom
 */

describe("Recipe App UI", () => {
  test("should create a recipe card in the DOM", () => {
    document.body.innerHTML = `<div id="results"></div>`;

    const resultsContainer = document.getElementById("results");

    const recipe = {
      title: "Test Recipe",
      image: "image.jpg",
      usedIngredientCount: 3
    };

    const card = document.createElement("article");
    card.classList.add("recipe-card");

    const image = document.createElement("img");
    image.src = recipe.image;
    image.alt = recipe.title;

    const title = document.createElement("h3");
    title.textContent = recipe.title;

    const ingredients = document.createElement("p");
    ingredients.textContent = `Used ingredients: ${recipe.usedIngredientCount}`;

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(ingredients);

    resultsContainer.appendChild(card);

    expect(resultsContainer.children.length).toBe(1);
    expect(resultsContainer.textContent).toContain("Test Recipe");
    expect(resultsContainer.textContent).toContain("Used ingredients: 3");
  });
});