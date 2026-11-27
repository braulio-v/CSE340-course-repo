import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT
            category_id,
            name
        FROM public.category
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getCategoryDetails = async (id) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM public.category AS c
        INNER JOIN public.service_project_category AS spc
            ON c.category_id = spc.category_id
        WHERE spc.project_id = $1;
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title
        FROM public.service_project AS sp
        INNER JOIN public.service_project_category AS spc
            ON sp.project_id = spc.project_id
        WHERE spc.category_id = $1
        ORDER BY sp.project_date ASC;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows;
};


const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO public.service_project_category (
            category_id,
            project_id
            )
            VALUES ($1, $2);
            `;

            await db.query(query, [categoryId, projectId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove all existing category assignments.
    const deleteQuery = `
        DELETE FROM public.service_project_category
        WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);

    // Then, assign the categories selected by the user.
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

const createCategory = async (name) => {
    const query = `
        INSERT INTO public.category (
            name
        )
        VALUES ($1)
        RETURNING category_id;
    `;

    const queryParams = [name];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};


const updateCategory = async (categoryId, name) => {
    const query = `
        UPDATE public.category
        SET
            name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const queryParams = [name, categoryId];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update category');
    }

    return result.rows[0].category_id;
};


export { getAllCategories, getCategoryDetails, getCategoriesByProjectId, getProjectsByCategoryId, updateCategoryAssignments, createCategory, updateCategory };
