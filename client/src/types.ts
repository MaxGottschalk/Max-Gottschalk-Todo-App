// export interface Todo {
//     todo: string;
//     time: number;
// }

export interface Todo {
    todo: string;
    time: number;
    id?: number;
}

export interface Todos {
    list_id: number;
    todo: Todo;
}

export interface TodoList {
    id: number,
    name: string
}

export interface UpdateTodoProps{
    id: number;
    onUpdateSuccess: () => void;
}

export interface deleteTodoProp{
    id: number;
    onDelete: (id: number) => void;
}