exports.handler = async function (event) {
  try {
    const ingredients = event.queryStringParameters?.ingredients;
    const diet = event.queryStringParameters?.diet || "";
    const apiKey = process.env.API_KEY;

    if (!ingredients) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Ingredients are required." })
      };
    }

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing API key." })
      };
    }

    let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(ingredients)}&number=6&apiKey=${apiKey}`;

    if (diet) {
      apiUrl += `&diet=${encodeURIComponent(diet)}`;
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch recipes." })
      };
    }

    const data = await response.json();

    const simplifiedRecipes = data.results.map((recipe) => ({
      title: recipe.title,
      image: recipe.image,
      usedIngredientCount: 0
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(simplifiedRecipes)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error." })
    };
  }
};