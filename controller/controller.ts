import { Request, Response } from 'express';
import * as service from '../services/service';
import { TodoItem, TodoUpdate } from '../types/types';
import { executeQuery } from '../types/database';

export function postTodoHandler(req: Request, res: Response): Response {
    const postData = req.body;

    if (postData && postData.todo) {
        const todoData: TodoItem = {
            id: postData.nextId,
            todo: postData.todo,
            time: postData.time,
        };
        const newTodo = service.createTodo(todoData);
        return res.send(newTodo);
    } else {
        return res.status(400).send('Bad Request: Missing required data.');
    }
}

export function getTodoListHandler(req: Request, res: Response): Response {
    const todoList = service.getAllTodos();
    return res.json(todoList);
}

export function getTodoByIdHandler(req: Request, res: Response): Response {
    const todoId = parseInt(req.params.id, 10);
    const todo = service.getTodoById(todoId);

    if (todo) {
        return res.json(todo);
    } else {
        return res.status(404).send('Todo not found');
    }
}

export function putTodoByIdHandler(req: Request, res: Response): Response {
    const todoId = parseInt(req.params.id, 10);
    const updatedTodo: TodoUpdate = {
        todo: req.body.todo,
        time: req.body.time,
    };

    const updatedItem = service.updateTodo(todoId, updatedTodo);

    if (updatedItem) {
        return res.json(updatedItem);
    } else {
        return res.status(404).send('Todo not found');
    }
}

export function deleteTodoByIdHandler(req: Request, res: Response): Response {
    const todoId = parseInt(req.params.id, 10);
    const deletedTodo = service.deleteTodo(todoId);

    if (deletedTodo) {
        return res.json(deletedTodo);
    } else {
        return res.status(404).send('Todo not found');
    }
}

//Get
export async function fetchTodoList(): Promise<any> {
    console.log("Pinged!")
    const results = await executeQuery('SELECT * FROM todo_lists;');
    return results;
}

export async function getTodoById(todoId: number): Promise<any> {
    const sql = 'SELECT * FROM todo WHERE id = ?';
    const values = [todoId];
    const results = await executeQuery(sql, values);
    return results[0]; // Return the first (and only) result
}

export async function getLinkedItemsById(listId: number): Promise<any[]> {
    const sql = `SELECT todo_lists.id AS list_id, todo_lists.name AS list_name, 
    JSON_OBJECT('todo', todo.todo, 'time', todo.time) AS todo FROM linkedIn
    JOIN todo_lists ON linkedIn.list_id = todo_lists.id 
    JOIN todo ON linkedIn.todo_id = todo.id WHERE linkedIn.list_id = ?;`;

    const values = [listId];

    try {
        const result = await executeQuery(sql, values);
        return result;
    } catch (error) {
        console.error('Error fetching linked items:', error);
        throw error; // Handle or log the error as needed
    }
}


//Post
export async function createTodo(body: { todo: { todo: string, time?: number }, list_Id: string }): Promise<number> {
    const sql = 'INSERT INTO todo (todo, time) VALUES (?, ?)';
    const values = [body.todo.todo, body.todo.time];
    const result = await executeQuery(sql, values);

    return result.insertId; // Return the ID of the newly created todo
}

export async function createTodoList({ name }: { name: string }): Promise<number> {
    try {
        // Execute the SQL query to insert a new todo list
        const sql = 'INSERT INTO todo_lists (name) VALUES (?)';
        const values = [name];
        const result = await executeQuery(sql, values);

        // Return the ID of the newly created todo list
        return result.insertId;
    } catch (error) {
        // Handle any errors that occur during the database interaction
        console.error('Error creating todo list:', error);
        throw new Error('Failed to create todo list.');
    }
}

//Put
export async function updateTodoById(todoId: number, updatedTodo: { todo?: string, time?: number }): Promise<any> {
    const existingTodo = await getTodoById(todoId);

    if (!existingTodo) {
        return null; // Todo not found
    }

    const updatedData = {
        todo: updatedTodo.todo || existingTodo.todo,
        time: updatedTodo.time || existingTodo.time,
    };

    const sql = 'UPDATE todo SET todo = ?, time = ? WHERE id = ?';
    const values = [updatedData.todo, updatedData.time, todoId];
    await executeQuery(sql, values);

    return { id: todoId, ...updatedData };
}

//Delete
export async function deleteTodoById(todoId: number): Promise<any> {
    const existingTodo = await getTodoById(todoId);

    if (!existingTodo) {
        return null; // Todo not found
    }

    const sql = 'DELETE FROM todo WHERE id = ?';
    const values = [todoId];
    await executeQuery(sql, values);

    return existingTodo;
}
1