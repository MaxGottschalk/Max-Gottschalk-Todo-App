export interface TodoItem {
    id: number;
    todo: string;
    time?: number;
}

export interface TodoUpdate {
    todo?: string;
    time?: number;
}
