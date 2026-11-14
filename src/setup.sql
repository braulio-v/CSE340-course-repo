-- ========================================
-- Organization Table
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================

INSERT INTO organization (
    name,
    description,
    contact_email,
    logo_filename
)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

SELECT * FROM organization

CREATE TABLE public.service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,

    CONSTRAINT fk_service_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES public.organization (organization_id)
);


INSERT INTO public.service_project
(organization_id, title, description, location, project_date)
SELECT organization_id, 'Community Park Renovation',
       'Renovating a local park and improving recreational spaces.',
       'Guayaquil, Ecuador', DATE '2026-12-05'
FROM public.organization
WHERE name = 'BrightFuture Builders';

INSERT INTO public.service_project
(organization_id, title, description, location, project_date)
SELECT organization_id, 'School Classroom Improvement',
       'Painting classrooms and repairing school facilities.',
       'Guayaquil, Ecuador', DATE '2026-12-12'
FROM public.organization
WHERE name = 'BrightFuture Builders';

INSERT INTO public.service_project
(organization_id, title, description, location, project_date)
SELECT organization_id, 'Community Garden Construction',
       'Building a community garden for local residents.',
       'Durán, Ecuador', DATE '2026-12-19'
FROM public.organization
WHERE name = 'BrightFuture Builders';

INSERT INTO public.service_project
(organization_id, title, description, location, project_date)
SELECT organization_id, 'Neighborhood Cleanup',
       'Cleaning public spaces and collecting recyclable materials.',
       'Samborondón, Ecuador', DATE '2027-01-09'
FROM public.organization
WHERE name = 'BrightFuture Builders';

INSERT INTO public.service_project
(organization_id, title, description, location, project_date)
SELECT organization_id, 'Youth Center Renovation',
       'Improving a youth center for educational activities.',
       'Guayaquil, Ecuador', DATE '2027-01-16'
FROM public.organization
WHERE name = 'BrightFuture Builders';


-- =========================================
-- GREENHARVEST GROWERS (5 projects)
-- =========================================

INSERT INTO public.service_project
(organization_id, title, description, location, project_date)
SELECT organization_id, 'Urban Tree Planting',
       'Planting trees to increase green spaces in the city.',
       'Guayaquil, Ecuador', DATE '2026-12-06'
FROM public.organization
WHERE name = 'GreenHarvest Growers';

INSERT INTO public.service_project
(organization_id, title, description, location, project_date)
SELECT organization_id, 'Community Vegetable Garden',
       'Creating a vegetable garden for neighborhood families.',
       'Durán, Ecuador', DATE '2026-12-13'
FROM public.organization
WHERE name = 'GreenHarvest Growers';

INSERT INTO public.service_project
(organization_id, title, description, location, project_date)
SELECT organization_id, 'Coastal Cleanup',
       'Removing waste from a local coastal area.',
       'Playas, Ecuador', DATE '2026-12-20'
FROM public.organization
WHERE name = 'GreenHarvest Growers';

INSERT INTO public.service_project
(organization_id, title, description, location, project_date)
SELECT organization_id, 'Sustainable Farming Workshop',
       'Teaching residents sustainable gardening and farming methods.',
       'Guayaquil, Ecuador', DATE '2027-01-10'
FROM public.organization
WHERE name = 'GreenHarvest Growers';

INSERT INTO public.service_project
(organization_id, title, description, location, project_date)
SELECT organization_id, 'Native Plant Restoration',
       'Restoring local habitats with native plants.',
       'Samborondón, Ecuador', DATE '2027-01-17'
FROM public.organization
WHERE name = 'GreenHarvest Growers';


-- =========================================
-- UNITYSERVE VOLUNTEERS (5 projects)
-- =========================================

INSERT INTO public.service_project
(organization_id, title, description, location, project_date)
SELECT organization_id, 'Food Donation Drive',
       'Collecting and distributing food to families in need.',
       'Guayaquil, Ecuador', DATE '2026-12-07'
FROM public.organization
WHERE name = 'UnityServe Volunteers';

INSERT INTO public.service_project
(organization_id, title, description, location, project_date)
SELECT organization_id, 'Elderly Support Program',
       'Providing assistance and companionship to older adults.',
       'Guayaquil, Ecuador', DATE '2026-12-14'
FROM public.organization
WHERE name = 'UnityServe Volunteers';

INSERT INTO public.service_project
(organization_id, title, description, location, project_date)
SELECT organization_id, 'Children Reading Program',
       'Organizing reading activities for children.',
       'Durán, Ecuador', DATE '2026-12-21'
FROM public.organization
WHERE name = 'UnityServe Volunteers';

INSERT INTO public.service_project
(organization_id, title, description, location, project_date)
SELECT organization_id, 'Clothing Donation Campaign',
       'Collecting clothing donations for local families.',
       'Guayaquil, Ecuador', DATE '2027-01-11'
FROM public.organization
WHERE name = 'UnityServe Volunteers';

INSERT INTO public.service_project
(organization_id, title, description, location, project_date)
SELECT organization_id, 'Community Health Fair',
       'Supporting a community event with educational activities.',
       'Samborondón, Ecuador', DATE '2027-01-18'
FROM public.organization
WHERE name = 'UnityServe Volunteers';


SELECT
    sp.project_id,
    sp.title,
    sp.location,
    sp.project_date,
    o.name AS organization_name
FROM public.service_project AS sp
INNER JOIN public.organization AS o
    ON sp.organization_id = o.organization_id
ORDER BY o.name, sp.project_date;

SELECT
    o.name,
    COUNT(sp.project_id) AS project_count
FROM public.organization AS o
LEFT JOIN public.service_project AS sp
    ON o.organization_id = sp.organization_id
GROUP BY o.name
ORDER BY o.name;



-- =========================================
-- CREATE CATEGORY TABLE
-- =========================================

CREATE TABLE public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- =========================================
-- CREATE SERVICE PROJECT CATEGORY TABLE
-- =========================================

CREATE TABLE public.service_project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_spc_project
        FOREIGN KEY (project_id)
        REFERENCES public.service_project (project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_spc_category
        FOREIGN KEY (category_id)
        REFERENCES public.category (category_id)
        ON DELETE CASCADE
);


-- =========================================
-- INSERT SERVICE PROJECT CATEGORIES
-- =========================================

INSERT INTO public.category (name)
VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Support'),
    ('Health and Wellness');



-- =========================================
-- ASSOCIATE PROJECTS WITH CATEGORIES
-- =========================================

INSERT INTO public.service_project_category
(project_id, category_id)

SELECT sp.project_id, c.category_id
FROM public.service_project AS sp
INNER JOIN public.category AS c
    ON (
        (sp.title IN (
            'Community Park Renovation',
            'Urban Tree Planting',
            'Community Garden Construction',
            'Neighborhood Cleanup',
            'Community Vegetable Garden',
            'Coastal Cleanup',
            'Sustainable Farming Workshop',
            'Native Plant Restoration'
        ) AND c.name = 'Environmental')

        OR

        (sp.title IN (
            'School Classroom Improvement',
            'Sustainable Farming Workshop',
            'Children Reading Program'
        ) AND c.name = 'Educational')

        OR

        (sp.title IN (
            'Youth Center Renovation',
            'Food Donation Drive',
            'Elderly Support Program',
            'Clothing Donation Campaign'
        ) AND c.name = 'Community Support')

        OR

        (sp.title = 'Community Health Fair'
         AND c.name = 'Health and Wellness')
    );

SELECT
    sp.title,
    c.name AS category_name
FROM public.service_project AS sp
INNER JOIN public.service_project_category AS spc
    ON sp.project_id = spc.project_id
INNER JOIN public.category AS c
    ON spc.category_id = c.category_id
ORDER BY sp.title, c.name;

SELECT
    sp.project_id,
    sp.title,
    COUNT(spc.category_id) AS category_count
FROM public.service_project AS sp
LEFT JOIN public.service_project_category AS spc
    ON sp.project_id = spc.project_id
GROUP BY sp.project_id, sp.title
ORDER BY sp.project_id;