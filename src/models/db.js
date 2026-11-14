
import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: true
});

// Reference to the database object
let db = null;

// Enable SQL logging in development mode
if (
    process.env.NODE_ENV === 'development' &&
    process.env.ENABLE_SQL_LOGGING === 'true'
) {
    db = {
        async query(text, params) {
            try {
                const start = Date.now();

                const res = await pool.query(text, params);

                const duration = Date.now() - start;

                console.log('Executed query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    duration: `${duration}ms`,
                    rows: res.rowCount
                });

                return res;

            } catch (error) {
                console.error('Error in query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    error: error.message
                });

                throw error;
            }
        },

        async close() {
            await pool.end();
        }
    };

} else {
    // Production: use the pool directly
    db = pool;
}

// Test the database connection
const testConnection = async () => {
    try {
        const result = await db.query(
            'SELECT NOW() as current_time'
        );

        console.log(
            'Database connection successful:',
            result.rows[0].current_time
        );

        return true;

    } catch (error) {
        console.error(
            'Database connection failed:',
            error.message
        );

        throw error;
    }
};

export { db as default, testConnection };
