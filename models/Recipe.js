import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  title: { 
        type: String, 
        required: true 
    },
  description: { 
        type: String 
    },
  ingredients: { 
        type: [String], 
        required: true 
    },
  steps: { 
        type: [String], 
        required: true 
    },
  cookingTime: { 
        type: Number, 
        required: true 
    },
  category: {
        type: String,
        enum: ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack"],
        required: true,
    },
  image: { 
        type: String 
    },
  createdAt: { 
        type: Date, 
        default: Date.now 
     },
  user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },  // Link to User Schema
});

// Exporting the model
export default mongoose.model("Recipe", RecipeSchema);
