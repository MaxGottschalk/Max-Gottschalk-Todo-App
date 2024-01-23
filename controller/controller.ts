import * as service from '../services/service';
import { TodoItem, TodoUpdate } from '../types/types';
import { getSpecificTodoById } from '../services/service';

//Get

// Fetch all todo lists
export async function fetchTodoList(): Promise<any> {
    console.log("Pinged!");
    const results = await service.getAllTodosLists();
    return results;
}

// Fetch a specific todo item by its ID
export async function getTodoById(todoId: number): Promise<any> {
    const results = await getSpecificTodoById(todoId);
    return results.rows[0]; // Return the first (and only) result
}

// Fetch linked items from a specific todo list by its ID
export async function getLinkedItemsById(listId: number): Promise<any[]> {
    try {
        const result = await service.getItemsInLinkedLists(listId);
        return result;
    } catch (error) {
        console.error('Error fetching linked items:', error);
        throw error; // Handle or log the error as needed
    }
}

//Post

// Create a new todo item and link it to a todo list
export async function createTodo(todoItem: TodoItem, list_Id: number): Promise<number> {
        const result = await service.addTodo(todoItem, list_Id);
    return result;
}

// Create a new todo list
export async function createTodoList({ name }: { name: string }): Promise<number> {
    try {
        const result = await service.addTodoList(name);

        // Return the ID of the newly created todo list
        return result;
    } catch (error) {
        // Handle any errors that occur during the database interaction
        console.error('Error creating todo list:', error);
        throw new Error('Failed to create todo list.');
    }
}

//Put

// Update a todo item in the database
export async function updateTodoInDatabase(todoId: number, updatedTodo: TodoUpdate, listId: number): Promise<any> {
    await service.updateTodo(todoId, updatedTodo, listId);
    return { id: todoId, ...updatedTodo };
}

//Delete

// Delete a todo item from the database by its ID
export async function deleteTodoFromDatabase(todoId: number): Promise<any> {
    return await service.deleteTodo(todoId);
}

// Delete a todo list from the database by its ID
export async function deleteTodolistById(id: number) {
    return await service.deleteTodolist(id);
}