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


export { getAllCategories, getCategoryDetails, getCategoriesByProjectId, getProjectsByCategoryId };
