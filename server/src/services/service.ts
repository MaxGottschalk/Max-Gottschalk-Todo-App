import { TodoItem, TodoUpdate } from '../types/types';
import { createNewTodo, createNewTodoList, deleteTodoById, getItemByList, getTodoById, getTodoLists, getTodos, removeTodolist, updateTodoById } from '../repositories/repository';

// Get operations

// Fetch all todo lists from the database
export async function getAllTodosLists() {
    return await getTodoLists();
}

// Fetch all todos from the database
export async function getAllTodos() {
    return await getTodos();
}

// Fetch a specific todo by its ID
export async function getSpecificTodoById(id: number) {
    return await getTodoById(id);
}

// Fetch items linked to a specific todo list by list ID
export async function getItemsInLinkedLists(id:number) {
    return (await getItemByList(id)).rows;
}

// Post operations

// Add a new todo to the database
export function addTodo(todoData: TodoItem, list_id: number) {
        return createNewTodo(todoData, list_id);
}

// Add a new todo list to the database
export async function addTodoList(name: string) {
    return createNewTodoList(name);
}

// Delete operations

// Delete a todo by its ID
export async function deleteTodo(id: number) {
    return deleteTodoById(id);
}

// Remove a todo list by its ID
export async function deleteTodolist(id: number){
    return removeTodolist(id);
}

// Put operation

// Update a todo by its ID
export async function updateTodo(todoId: number, updatedTodo: TodoUpdate, listId: number) {
    return updateTodoById(todoId, updatedTodo, listId)
    
}
