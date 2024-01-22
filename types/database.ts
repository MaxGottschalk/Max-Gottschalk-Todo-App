import { Client } from 'pg'
import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

console.log('Environment variables:');
console.log('DB_HOST:', process.env.HOST);
console.log('DB_PORT:', process.env.PORT);
console.log('DB_USER:', process.env.USER_NAME);
console.log('DB_PASSWORD:', process.env.PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

// Create a PostgreSQL client instance
export const client = new Client({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5432,
    user: process.env.USER_NAME || 'postgres',
    password: process.env.PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres'
});

// Function to connect to the PostgreSQL database
async function connectToDb() {
    await client.connect();

    // Test the database connection by executing a simple query
    //const result = await client.query("SELECT NOW();");
    //console.log(result);
    console.log("It is working");
}

// Invoke the connectToDb function to establish the database connection
connectToDb()
