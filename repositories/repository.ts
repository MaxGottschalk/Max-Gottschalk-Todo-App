import { TodoItem, TodoUpdate } from '../types/types';

const todoList: TodoItem[] = [];
let nextId = 1;

export const TodoRepository = {
    getAll: (): TodoItem[] => [...todoList],

    getById: (id: number): TodoItem | undefined => todoList.find(item => item.id === id),

    add: (todoData: TodoItem): TodoItem => {
        const newTodo = { ...todoData, id: nextId++ };
        todoList.push(newTodo);
        return newTodo;
    },

    update: (id: number, updatedTodo: TodoUpdate): TodoItem | undefined => {
        const index = todoList.findIndex(item => item.id === id);

        if (index !== -1) {
            todoList[index] = { ...todoList[index], ...updatedTodo };
            return todoList[index];
        }

        return undefined;
    },

    delete: (id: number): TodoItem | undefined => {
        const index = todoList.findIndex(item => item.id === id);

        if (index !== -1) {
            return todoList.splice(index, 1)[0];
        }

        return undefined;
    },
};
