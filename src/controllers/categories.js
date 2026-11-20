// Import the Model function
import { getAllCategories, getCategoryDetails, getProjectsByCategoryId } from '../models/categories.js';

// Define the controller function
const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();

        const title = 'Service Project Categories';

        res.render('categories', { title, categories });
    } catch (error) {
        next(error);
    }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        const category = await getCategoryDetails(categoryId);

        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByCategoryId(categoryId);

        const title = 'Category Details';

        res.render('category', {
            title,
            category,
            projects
        });

    } catch (error) {
        next(error);
    }
};

// Export the controller function
export { showCategoriesPage, showCategoryDetailsPage };