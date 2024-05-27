import React, { useEffect, useState } from 'react';
import DeleteTodo from './DeleteTodo';
import UpdateTodo from './UpdateTodo';
import { Todo, TodosInListProps } from '../types';

const TodosInList: React.FC<TodosInListProps> = ({ id }) => {

    const [todos, setTodos] = useState<Todo[]>([]);

    const getTodos = async () => {
        try {
            const response = await fetch(`http://localhost:6969/linkedin/${id}`);
            const data = await response.json();
            const updatedData = data.map((todo: Todo) => ({
                ...todo,
                isDone: todo.isDone !== undefined ? todo.isDone : false, // Default to false if undefined
            }));
            setTodos(updatedData);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    useEffect(() => {
        getTodos();
    }, []);

    const handleDelete = (id: number) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    };

    const handleUpdateSuccess = () => {
        getTodos();
    };

    const handleCheckboxChange = async (id: number, isDone: boolean) => {
        try {
            const response = await fetch(`http://localhost:6969/todoStatus/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isDone: !isDone }),
            });

            if (response.ok) {
                setTodos(prevTodos =>
                    prevTodos.map(todo => todo.id === id ? { ...todo, isDone: !isDone } : todo)
                );
            } else {
                alert('Failed to update todo');
            }
        } catch (error) {
            console.error('Error updating todo:', error);
            alert('An error occurred while updating the todo');
        }
    };

    return (
        <div>
            <ul className="card-list">
                {todos?.map(dataItem => (
                    <li key={dataItem.id}>
                        <div className="card">
                            <div className="card-header">
                                <UpdateTodo onUpdateSuccess={handleUpdateSuccess} id={dataItem.id as number} />
                                {dataItem.todo}
                                <DeleteTodo id={dataItem.id as number} onDelete={handleDelete} />
                            </div>
                            <div className="card-content">
                                <input
                                    type="checkbox"
                                    checked={dataItem.isDone as boolean}
                                    onChange={() => handleCheckboxChange(dataItem.id as number, dataItem.isDone)}
                                    className='checkbox-style'
                                />
                                <p style={{ textDecoration: dataItem.isDone ? 'line-through' : 'none' }}>
                                    TIME: {dataItem.time}m
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default TodosInList;