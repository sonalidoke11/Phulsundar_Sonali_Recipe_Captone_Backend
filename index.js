import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

//Importing created routes 
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js'; 

// Loading env variables
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// making connection to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

// calling connection function
connectDB();

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes); 

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
