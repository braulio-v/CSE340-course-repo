// Import the Model function
import { body, validationResult } from 'express-validator';
import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// Define validation and sanitization rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters')
        .escape(),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters')
        .escape(),

    body('contactEmail')
        .trim()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
];


const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        const title = 'Partner Organizations';

        res.render('organizations', { title, organizations });
    } catch (error) {
        next(error);
    }
};

const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const organizationId = req.params.id;

        const organizationDetails = await getOrganizationDetails(organizationId);

        if (!organizationDetails) {
            return res.status(404).render('errors/404', {
                title: 'Page Not Found'
            });
        }

        const projects = await getProjectsByOrganizationId(organizationId);

        const title = organizationDetails.name;

        res.render('organization', {
            title,
            organizationDetails,
            projects
        });

    } catch (error) {
        next(error);
    }
};

const processNewOrganizationForm = async (req, res, next) => {
    try {
        // Check for validation errors
        const results = validationResult(req);

        if (!results.isEmpty()) {

            // Add each validation error to flash messages
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            // Redirect back to the form
            return res.redirect('/new-organization');
        }

        // Extract validated form data
        const { name, description, contactEmail } = req.body;

        const logoFilename = 'placeholder-logo.png';

        // Save the organization in the database
        const organizationId = await createOrganization(
            name,
            description,
            contactEmail,
            logoFilename
        );

        // Success message
        req.flash('success', 'Organization added successfully!');

        // Redirect to organization details
        res.redirect(`/organization/${organizationId}`);

    } catch (error) {
        next(error);
    }
};

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
}


const showEditOrganizationForm = async (req, res, next) => {
    try {
        const organizationId = req.params.id;

        const organizationDetails = await getOrganizationDetails(organizationId);

        if (!organizationDetails) {
            return res.status(404).render('errors/404', {
                title: 'Organization Not Found'
            });
        }

        const title = 'Edit Organization';

        res.render('edit-organization', {
            title,
            organizationDetails
        });

    } catch (error) {
        next(error);
    }
};




const processEditOrganizationForm = async (req, res, next) => {
    try {
        // Check for validation errors
        const results = validationResult(req);

        if (!results.isEmpty()) {
            // Add validation errors to flash messages
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            // Return to the edit form
            return res.redirect(`/edit-organization/${req.params.id}`);
        }

        // Get the organization ID
        const organizationId = req.params.id;

        // Extract the validated form data
        const {
            name,
            description,
            contactEmail,
            logoFilename
        } = req.body;

        // Update the organization in the database
        await updateOrganization(
            organizationId,
            name,
            description,
            contactEmail,
            logoFilename
        );

        // Set success message
        req.flash('success', 'Organization updated successfully!');

        // Redirect to the organization details page
        res.redirect(`/organization/${organizationId}`);

    } catch (error) {
        next(error);
    }
};



export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    processNewOrganizationForm,
    showEditOrganizationForm,
    showNewOrganizationForm,
    organizationValidation,
    processEditOrganizationForm
};
