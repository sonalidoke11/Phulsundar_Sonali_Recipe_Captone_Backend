import express from 'express';
import Recipe from '../models/Recipe.js';

const router = express.Router();


// Get all recipes
router.get('/', async (req, res) => {
    try {
      const recipes = await Recipe.find();
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get recipe by ID
  router.get('/:id', async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Create new recipe
router.post('/', async (req, res) => {
    const newRecipe = new Recipe(req.body);
    try {
      const savedRecipe = await newRecipe.save();
      res.status(201).json(savedRecipe);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Update an existing recipe
router.put('/:id', async (req, res) => {
    try {
      const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedRecipe) return res.status(404).json({ message: 'Recipe not found' });
      res.json(updatedRecipe);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete a recipe
router.delete('/:id', async (req, res) => {
    try {
      const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
      if (!deletedRecipe) return res.status(404).json({ message: 'Recipe not found' });
      res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  export default router;