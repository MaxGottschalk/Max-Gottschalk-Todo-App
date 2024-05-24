import React, { useEffect, useState } from 'react';
import DeleteTodo from './DeleteTodo';
import UpdateTodo from './UpdateTodo';
import { Todo } from '../types';

const Todos: React.FC = () => {
  
    const [todos, setTodos] = useState<Todo[]>([]);
    const [checkedTodos, setCheckedTodos] = useState<number[]>([]);


    const getTodos = async () => {
        try {
          const response = await fetch('http://localhost:6969/todo');
          const data = await response.json();
          setTodos(data);
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

  const handleCheckboxChange = (id: number) => {
    setCheckedTodos(prevCheckedTodos =>
      prevCheckedTodos.includes(id)
        ? prevCheckedTodos.filter(todoId => todoId !== id)
        : [...prevCheckedTodos, id]
    );
  };
  
    return (
        <div>
        <ul className="card-list">
            {todos?.map(dataItem => (
                <li key={dataItem.id}>
                    <div className="card">
                        <div className="card-header">
                            <UpdateTodo onUpdateSuccess={handleUpdateSuccess} id={dataItem.id as number}/>
                            {dataItem.todo}
                            <DeleteTodo id={dataItem.id as number} onDelete={handleDelete}/>
                        </div>
                        <div className="card-content">
                            <input
                            type="checkbox"
                            checked={checkedTodos.includes(dataItem.id as number)}
                            onChange={() => handleCheckboxChange(dataItem.id as number)}
                            className='checkbox-style'
                            />
                            <p className={checkedTodos.includes(dataItem.id as number) ? 'crossed-out' : ''}>
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

export default Todos;