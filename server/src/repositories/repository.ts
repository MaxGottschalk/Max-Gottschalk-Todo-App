import { client } from '../types/database';
import { TodoItem, TodoUpdate } from '../types/types';

//On Start
// Check if tables exist, create them if not
export async function createTables() {
    // SQL queries to check if tables exist
    const checkTableQuery = 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)';

    // Array of table names
    const tableNames = ['todo', 'todo_lists', 'linkedin'];

    for (const tableName of tableNames) {
        // Check if the table exists
        const result = await client.query(checkTableQuery, [tableName]);
        const tableExists = result.rows[0].exists;

        if (!tableExists) {
            // If the table does not exist, create it
            await createTable(tableName);
            console.log(`Table "${tableName}" created.`);
        } else {
            console.log(`Table "${tableName}" already exists.`);
        }
    }
}

//Create new tabel if none existing 
async function createTable(tableName: string) {
    try {
        switch (tableName) {
            case 'todo':
                // Create the "todo" table
                await client.query(`
                    CREATE TABLE todo (
                        id SERIAL PRIMARY KEY,
                        todo TEXT,
                        time INTEGER,
                        isDone BOOLEAN
                    );
                `);
                break;

            case 'todo_lists':
                // Create the "todo_lists" table
                await client.query(`
                    CREATE TABLE todo_lists (
                        id SERIAL PRIMARY KEY,
                        name TEXT
                    );
                `);
                break;

            case 'linkedin':
                // Create the "linkedin" table
                await client.query(`
                    CREATE TABLE linkedin (
                        id SERIAL PRIMARY KEY,
                        list_id INTEGER,
                        todo_id INTEGER,
                        FOREIGN KEY (list_id) REFERENCES todo_lists(id),
                        FOREIGN KEY (todo_id) REFERENCES todo(id)
                    );
                `);
                break;

            default:
                console.error(`Unknown table name: ${tableName}`);
                break;
        }
    } catch (error) {
        console.error(`Error creating table "${tableName}":`, error);
    }
}

// Get operations

// Fetch all todo lists from the database
export async function getTodoLists() {
    return (await client.query('SELECT * FROM todo_lists;')).rows;
}

// Fetch all todos from the database
export async function getTodos() {
    return (await client.query('SELECT * FROM todo;')).rows;
}

// Fetch a specific todo by its ID
export async function getTodoById(id: number) {
    const sql = `SELECT * FROM todo WHERE id = $1`;
    const values = [id];
    return await client.query(sql, values);
}

// Fetch items linked to a specific todo list by list ID
export async function getItemByList(listId: number) {

    const sql = `SELECT * from todo where id in(
        SELECT todo_id from linkedin where list_id = $1)`;
    const values = [listId];
    return await client.query(sql, values);
}

// Post operations

// Add a new todo to the database and link it to a specific list
export async function createNewTodo(todoItem: TodoItem, list_id: number): Promise<number> {
    try {
        // Start the transaction
        await client.query('BEGIN');

        // Insert into 'todo' table
        const todoSql = 'INSERT INTO todo (todo, time, isDone) VALUES ($1, $2, $3 ) RETURNING id';
        const todoValues = [todoItem.todo, todoItem.time, todoItem.isDone];
        const todoResult = await client.query(todoSql, todoValues);

        const todoId = todoResult.rows[0].id;

        // Insert into 'linkedin' table
        const linkedinSql = 'INSERT INTO linkedin (list_id, todo_id) VALUES ($1, $2) RETURNING id';
        const linkedinValues = [list_id, todoId];
        await client.query(linkedinSql, linkedinValues);

        // Commit the transaction if everything was successful
        await client.query('COMMIT');

        return todoId;
    } catch (error) {

        // Roll back the transaction if an error occurs
        await client.query('ROLLBACK');

        console.error('Error creating todo:', error);
        // If an error occurs, log the error and return a custom error response
        throw (error);
    }
}

// Add a new todo list to the database
export async function createNewTodoList(name: string) {
    // Execute the SQL query to insert a new todo list
    const sql = `INSERT INTO todo_lists (name) VALUES ($1) RETURNING id`;
    const values = [name];
    const res = await client.query(sql, values);

    return res.rows[0].id;
}

// Delete operations

// Delete a todo by its ID
export async function deleteTodoById(id: number) {
    try {
        // Check if the todo exists
        const existingTodo = await getTodoById(id);

        if (!existingTodo) {
            return null; // Todo not found
        }

        // Start a transaction
        await client.query('BEGIN');

        // Delete the associated records in the linkedin table
        const deleteLinkedinQuery = `DELETE FROM linkedin WHERE todo_id = $1`;
        await client.query(deleteLinkedinQuery, [id]);

        // Delete the todo item
        const deleteTodoQuery = `DELETE FROM todo WHERE id = $1 RETURNING *`;
        const result = await client.query(deleteTodoQuery, [id]);

        // Commit the transaction
        await client.query('COMMIT');

        return result.rows;
    } catch (error) {
        // Rollback the transaction in case of an error
        await client.query('ROLLBACK');
        console.error('Error deleting todo by ID:', error);
        throw error;
    }
}

// Remove a todo list by its ID
export async function removeTodolist(id: number) {
    try {

        // Delete the associated records in the linkedin table and get the todo_id
        const deleteLinkedinQuery = `DELETE FROM linkedin WHERE list_id = $1 RETURNING todo_id`;
        const linkedinDelRes = await client.query(deleteLinkedinQuery, [id]);

        const todoIds = linkedinDelRes.rows.map(row => row.todo_id);

        // Delete todos linked with the todo list from todo table
        const todoQuery = `DELETE FROM todo WHERE id = ANY($1) RETURNING *`;
        const todoValues = [todoIds];
        const todoRes = await client.query(todoQuery, todoValues);

        // Delete todo list from todo_lists table
        const todolistQuery = `DELETE FROM todo_lists WHERE id = $1 RETURNING *`;
        const todolistRes = await client.query(todolistQuery, [id]);

        return { todoDeleted: todoRes.rows, todolistDeleted: todolistRes.rows, linkedinDeleted: linkedinDelRes.rows };
    } catch (error) {
        console.error('Error removing todo list:', error);
        throw error;
    }
}

// Put operation

// Update a todo by its ID with new data, optionally updating the linked list ID
export async function updateTodoById(id: number, updatedTodo: TodoUpdate, listId: number) {

    try {
        const existingTodo = (await getTodoById(id)).rows;

        if (!existingTodo || existingTodo.length === 0) {
            throw new Error("Todo not found") // Todo not found
        } else {
            const updatedData = {
                todo: updatedTodo.todo || existingTodo[0].todo,
                time: updatedTodo.time || existingTodo[0].time,
                isDone: updatedTodo.isDone || existingTodo[0].isDone
            };

            // Update todo details
            const updateTodoQuery = 'UPDATE todo SET todo = $1, time = $2, isDone = $3 WHERE id = $4 RETURNING *';
            const updateValues = [updatedData.todo.todo, updatedData.todo.time, updatedData.isDone, id,];
            await client.query(updateTodoQuery, updateValues);

            if (listId !== undefined) {
                // Update list_id in linkedin table if provided
                const updateLinkedinQuery = 'UPDATE linkedin SET list_id = $1 WHERE todo_id = $2';
                const updateLinkedinValues = [listId, id];
                await client.query(updateLinkedinQuery, updateLinkedinValues);
            }

            return true;
        }
    } catch (error) {
        console.error('Error updating todo:', error);
        throw (error)
    }
}

// Update a todo by its ID with new data
export async function updateTodoIsDoneId(id: number, isDone: boolean) {

    try {
        const existingTodo = (await getTodoById(id)).rows;

        if (!existingTodo || existingTodo.length === 0) {
            throw new Error("Todo not found") // Todo not found
        } else {

            // Update todo details
            const updateTodoQuery = 'UPDATE todo SET isDone = $1 WHERE id = $2 RETURNING *';
            const updateValues = [isDone, id];
            await client.query(updateTodoQuery, updateValues);

            return true;
        }
    } catch (error) {
        console.error('Error updating todo:', error);
        throw (error)
    }
}
