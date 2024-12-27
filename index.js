const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = process.env.MONGODB_URI

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany();
  })
  .then(() => {
    // Iteration 2 - Create a recipe
    return Recipe.create({
      title: 'Pasta Carbonara',
      level: 'Amateur Chef',
      ingredients: ['Pasta', 'Eggs', 'Pancetta', 'Parmesan Cheese'],
      cuisine: 'Italian',
      dishType: 'main_course',
      image: '',
      duration: 30,
      creator: 'Chef John'
    });
  })
  .then(newRecipe => {
    console.log(`Recipe created: ${newRecipe.title}`);
    // Iteration 3 - Insert multiple recipes
    return Recipe.insertMany(data);
  })
  .then(allRecipes => {
    allRecipes.forEach(recipe => console.log(`Inserted recipe: ${recipe.title}`));
    // Iteration 4 - Update a recipe
    return Recipe.findOneAndUpdate(
      { title: 'Rigatoni alla Genovese' },
      { duration: 100 },
      { new: true }
    );
  })
  .then(updatedRecipe => {
    console.log(`Updated recipe: ${updatedRecipe.title}, duration is now ${updatedRecipe.duration} minutes`);
    // Iteration 5 - Remove a recipe
    return Recipe.deleteOne({ title: 'Carrot Cake' });
  })
  .then(() => {
    console.log('Successfully removed Carrot Cake');
    // Iteration 6 - Close the database
    mongoose.connection.close(() => {
      console.log('Database connection closed');
    });
  })
  .catch(error => {
    console.error('Error performing operations on the database', error);
  });
