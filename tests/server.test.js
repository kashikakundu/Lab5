const request = require("supertest");
const express = require("express");

const app = express();

app.get("/api/recipes", (req, res) => {
  const { ingredients } = req.query;

  if (!ingredients) {
    return res.status(400).json({ error: "Ingredients are required." });
  }

  res.json([
    {
      title: "Test Recipe",
      image: "test.jpg",
      usedIngredientCount: 2
    }
  ]);
});

describe("GET /api/recipes", () => {

  test("should return error if ingredients missing", async () => {
    const res = await request(app).get("/api/recipes");

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Ingredients are required.");
  });

  test("should return recipes when ingredients provided", async () => {
    const res = await request(app)
      .get("/api/recipes")
      .query({ ingredients: "chicken" });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});