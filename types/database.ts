import { Client } from 'pg'
export const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: "postgres",
    database: 'postgres'
});

async function connectToDb() {
    await client.connect();

    const result = await client.query("SELECT NOW();");
    console.log(result);
    console.log("It is working");
}

connectToDb()
