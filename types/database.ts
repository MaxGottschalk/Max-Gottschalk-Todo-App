import * as mysql from 'mysql2/promise';

const dbConfig: mysql.PoolOptions = {
    host: 'localhost',
    port: 3308,
    user: 'root',
    password: "",
    database: 'todoDb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

export async function executeQuery(sql: string, values?: any[]): Promise<any> {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(sql, values);
        return results;
    } finally {
        connection.release();
    }
}
