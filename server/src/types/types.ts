export interface TodoItem {
    id: number;
    todo: string;
    time?: number;
    isDone: boolean;
}

export interface TodoUpdate {
    todo?: string;
    time?: number;
    isDone: boolean;
}
