import * as service from '../services/service';
import { TodoItem, TodoUpdate } from '../types/types';
import { getSpecificTodoById } from '../services/service';

//Get
export async function fetchTodoList(): Promise<any> {
    console.log("Pinged!")
    const results = await service.getAllTodos();
    return results;
}

export async function getTodoById(todoId: number): Promise<any> {
    const results = await getSpecificTodoById(todoId);
    return results.rows[0]; // Return the first (and only) result
}

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
export async function createTodo(todoItem: TodoItem, list_Id: number ): Promise<number> {
    
    const result = await service.addTodo(todoItem, list_Id);
    return result;
}

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
export async function updateTodoInDatabase(todoId: number, updatedTodo: TodoUpdate, listId: number): Promise<any> {

    await service.updateTodo(todoId, updatedTodo, listId)
    return { id: todoId, ...updatedTodo };
}

//Delete
export async function deleteTodoFromDatabase(todoId: number): Promise<any> {

    return await service.deleteTodo(todoId);
}

export async function deleteTodolistById(id: number) {
    return await service.deleteTodolist(id);
    
}
1