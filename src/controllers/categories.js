// Import the Model function
import { getAllCategories, getCategoryDetails, getCategoriesByProjectId, getProjectsByCategoryId, updateCategoryAssignments, createCategory, updateCategory} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';
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

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            return res.status(404).render('errors/404', {
                title: 'Page Not Found'
            });
        }

        const categories = await getAllCategories();

        const assignedCategories = await getCategoriesByProjectId(projectId);

        const title = 'Assign Categories to Project';

        res.render('assign-categories', {
            title,
            projectId,
            projectDetails,
            categories,
            assignedCategories
        });
    } catch (error) {
        next(error);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const selectedCategoryIds = req.body.categoryIds || [];

        const categoryIdsArray = Array.isArray(selectedCategoryIds)
            ? selectedCategoryIds
            : [selectedCategoryIds];

        await updateCategoryAssignments(projectId, categoryIdsArray);

        req.flash('success', 'Categories updated successfully.');

        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};


const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
        .escape()
];


const showNewCategoryForm = async (req, res, next) => {
    try {
        const title = 'Create New Category';

        res.render('new-category', {
            title
        });
    } catch (error) {
        next(error);
    }
};


const processNewCategoryForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            return res.redirect('/new-category');
        }

        const { name } = req.body;

        await createCategory(name);

        req.flash('success', 'Category created successfully!');

        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
};


const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        const categoryDetails = await getCategoryDetails(categoryId);

        if (!categoryDetails) {
            return res.status(404).render('errors/404', {
                title: 'Page Not Found'
            });
        }

        const title = 'Edit Category';

        res.render('edit-category', {
            title,
            categoryDetails
        });
    } catch (error) {
        next(error);
    }
};

const processEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            return res.redirect(`/edit-category/${categoryId}`);
        }

        const { name } = req.body;

        await updateCategory(categoryId, name);

        req.flash('success', 'Category updated successfully!');

        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
};

// Export the controller function
export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryValidation };