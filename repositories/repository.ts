import { client } from '../types/database';
import { TodoItem, TodoUpdate } from '../types/types';


//Get
export async function getTodoLists(){
    return (await client.query('SELECT * FROM todo_lists;')).rows;
}

export async function getTodoById(id: number){
    const sql = `SELECT * FROM todo WHERE id = $1`;
    const values = [id];
    return await client.query(sql, values);
}

export async function getItemByList(listId: number) {
    
    const sql = `SELECT * from todo where id in(
        SELECT todo_id from linkedin where list_id = $1)`;
    const values = [listId];
    return await client.query(sql, values);
}

//Post
export async function createNewTodo(todoItem : TodoItem, list_id : number){
    const sql = `INSERT INTO todo (todo, time) VALUES ($1, $2) RETURNING id`;
    const values = [todoItem.todo, todoItem.time];
    const res = await client.query(sql, values);

    const sqlLinkedin = `INSERT INTO linkedin (list_id, todo_id) VALUES ($1, $2) RETURNING id`;
    const linkedValues = [list_id, res.rows[0].id];
    await client.query(sqlLinkedin, linkedValues);

    return res.rows[0].id;
}

export async function createNewTodoList(name:string) {
    // Execute the SQL query to insert a new todo list
    const sql = `INSERT INTO todo_lists (name) VALUES ($1) RETURNING id`;
    const values = [name];
    const res = await client.query(sql, values);

    return res.rows[0].id;
}

//Delete
export async function deleteTodoById(id: number) {
    const existingTodo = await getTodoById(id);

    if (!existingTodo) {
        return null; // Todo not found
    }

    const sql = `DELETE FROM todo WHERE id = $1 RETURNING *`;
    const values = [id];
    return (await client.query(sql, values)).rows;
}

export async function removeTodolist(id: number) {
    const existingTodolist = `SELECT * FROM todo_lists WHERE id = $1`
    const values = [id];
    const res = await client.query(existingTodolist, values);

    if (!res) {
        return null; // Todo not found
    }

    const sql = `DELETE FROM todo_lists WHERE id = $1 RETURNING *`;
    return (await client.query(sql, values)).rows;
    
}

//Put
export async function updateTodoById(id: number, updatedTodo: TodoUpdate, listId: number){

    try {
    const existingTodo = await getTodoById(id);

    if (!existingTodo) {
        return null; // Todo not found
    }

    const updatedData = {
        todo: updatedTodo.todo || existingTodo.rows[0].todo,
        time: updatedTodo.time || existingTodo.rows[0].time,
    };

    // Update todo details
    const updateTodoQuery = 'UPDATE todo SET todo = $1, time = $2 WHERE id = $3 RETURNING *';
    const updateValues = [updatedData.todo.todo, updatedData.todo.time, id];
    await client.query(updateTodoQuery, updateValues);

    if (listId !== undefined) {
        // Update list_id in linkedin table if provided
        const updateLinkedinQuery = 'UPDATE linkedin SET list_id = $1 WHERE todo_id = $2';
        const updateLinkedinValues = [listId, id];
        await client.query(updateLinkedinQuery, updateLinkedinValues);
    }

    return true;
    }    catch (error) {
        console.error('Error updating todo:', error);
        return false;
    }    
}
