const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/recipes", async (req, res) => {
  const { ingredients, diet } = req.query;

  if (!ingredients) {
    return res.status(400).json({ error: "Ingredients are required." });
  }

  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing API key." });
  }

  let apiUrl =
    `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(ingredients)}&number=6&apiKey=${apiKey}`;

  if (diet) {
    apiUrl += `&diet=${encodeURIComponent(diet)}`;
  }

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("External API request failed");
    }

    const data = await response.json();

    const simplifiedRecipes = data.results.map((recipe) => ({
      title: recipe.title,
      image: recipe.image,
      usedIngredientCount: 0
    }));

    res.json(simplifiedRecipes);
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ error: "Failed to fetch recipes." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});