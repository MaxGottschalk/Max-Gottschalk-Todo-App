import React, { useState } from 'react';
import "../css/cardDesign.css"
import TodoLists from './TodoLists';
import { Todos } from '../types';


const CreateTodo: React.FC = () => {
    const [listId, setListId] = useState<number>(0);
    const [todoText, setTodoText] = useState<string>('');
    const [todoTime, setTodoTime] = useState<number>(0);

    const handleListIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setListId(parseInt(event.target.value));
    };

    const handleTodoTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTodoText(event.target.value);
    };

    const handleTodoTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTodoTime(parseInt(event.target.value));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const newTodo: Todos = {
                list_id: listId,
                todo: {
                    todo: todoText,
                    time: todoTime,
                },
            };

            const response = await fetch('http://localhost:6969/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTodo),
            });

            if (response.ok) {
                alert('Todo created successfully!');
                setListId(0);
                setTodoText('');
                setTodoTime(0);
            } else {
                // Handle error
                alert('Failed to create todo');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while creating todo');
        }
    };

  return (
    <div className='createTodoContent'>
      <h2>Create Todo</h2>
      <form onSubmit={handleSubmit}>
        <label>
          List-Id:
          <input type="number" value={listId} onChange={handleListIdChange} />
        </label>
        <label>
          Todo:
          <input type="text" value={todoText} onChange={handleTodoTextChange} />
        </label>
        <label>
          Time:
          <input type="number" value={todoTime} onChange={handleTodoTimeChange} />
        </label>
        <button type="submit">Create</button>
      </form>
      <h1>Todo-Lists:</h1>
        <TodoLists/>
    </div>
  );
};

export default CreateTodo;