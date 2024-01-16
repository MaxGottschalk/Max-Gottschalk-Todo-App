import { TodoItem, TodoUpdate } from '../types/types';
import { TodoRepository } from '../repositories/repository';

export function createTodo(todoData: TodoItem) {
    return TodoRepository.add(todoData);
}

export function getAllTodos() {
    return TodoRepository.getAll();
}

export function getTodoById(id: number) {
    return TodoRepository.getById(id);
}

export function updateTodo(id: number, updatedTodo: TodoUpdate) {
    return TodoRepository.update(id, updatedTodo);
}

export function deleteTodo(id: number) {
    return TodoRepository.delete(id);
}
