// Import the Model function
import { getAllCategories } from '../models/categories.js';

// Define the controller function
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

// Export the controller function
export { showCategoriesPage };