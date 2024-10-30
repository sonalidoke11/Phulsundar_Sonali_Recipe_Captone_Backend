import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer'; //for image upload
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

const router = express.Router();

// Using multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // path to store files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Protect middleware: to check user authentication for POST, PUT, DELETE
const protect = async (req, res, next) => {
  let token;
  // Check if the authorization header is present and formatted as expected
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);// Verify token
      req.user = await User.findById(decoded.id).select('-password'); // Attach user to request without password

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      next(); // proceed to next 
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
     // No token present in the header
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

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

// Get recipe by user ID
router.get('/user/:id', protect, async (req, res) => {
  try {

    const user_recipes = await Recipe.find({ user: req.params.id });
    if (!user_recipes) return res.status(404).json({ message: 'Recipe not found' });
    res.json(user_recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new recipe (using protect middeleware)
router.post('/', protect, upload.single('image'),async (req, res) => {
  const { title, description, ingredients, steps, cookingTime, category} = req.body;
  const imagePath = req.file ? req.file.path : null; // Use uploaded file path
  console.log(req.body);
  console.log(req.file);
  try {
    const newRecipe = new Recipe({
      title,
      description,
      ingredients: JSON.parse(ingredients), // Convert string to array
      steps: JSON.parse(steps),             // Convert string to array
      cookingTime,
      category,
      image: imagePath,                     // Save image path
      user: req.user._id,                   // Associate recipe with logged-in user
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update recipe (Protected route)
router.put('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // Check if the user owns the recipe
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete recipe (Protected route)
router.delete('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // Check if the user owns the recipe
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await recipe.remove();
    res.json({ message: 'Recipe removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
