import { TodoItem, TodoUpdate } from '../types/types';
import { createNewTodo, createNewTodoList, deleteTodoById, getItemByList, getTodoById, getTodoLists, removeTodolist, updateTodoById } from '../repositories/repository';

//Get
export async function getAllTodos() {
    return await getTodoLists();
}

export async function getSpecificTodoById(id: number) {
    return await getTodoById(id);
}

export async function getItemsInLinkedLists(id:number) {
    return (await getItemByList(id)).rows;
}

//Post
export function addTodo(todoData: TodoItem, list_id: number) {
    return createNewTodo(todoData, list_id);
}

export async function addTodoList(name: string) {
    return createNewTodoList(name);
}

//Delete
export async function deleteTodo(id: number) {
    return deleteTodoById(id);
}

export async function deleteTodolist(id: number){
    return removeTodolist(id);
}

//Put
export async function updateTodo(todoId: number, updatedTodo: TodoUpdate, listId: number) {
    return updateTodoById(todoId, updatedTodo, listId)
    
}
