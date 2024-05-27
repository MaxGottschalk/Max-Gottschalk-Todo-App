import React, { useEffect, useState } from 'react';
import { TodoList } from '../types';
import DeleteTodoList from './DeleteTodoList';
import "../css/listDesign.css"
import TodosInList from './TodosInList';


const TodoLists: React.FC = () => {

    const [todo, setTodoList] = useState<TodoList[]>([]);

    useEffect(() => {
        async function getTodoList() {
            await fetch("http://localhost:6969/todolist", {
                method: "GET"
            }).then(async (response) => {
                const responseData = await response.json()
                setTodoList(responseData)
            })
        }

        getTodoList()
    }, [])

    const handleDelete = async (id: number) => {
        await setTodoList(prevTodos => prevTodos.filter(todo => todo.id !== id));
    };

    return (
        <div>
            <ul className="todolist-container">
                {todo?.map(dataItem => (
                    <div key={dataItem.id} className="todolist">
                        <div className="todolist-header">
                            <p>List-Id: {dataItem.id}</p>
                            <h3>{dataItem.name}</h3>
                            <DeleteTodoList id={dataItem.id} onDelete={handleDelete} />
                        </div>
                        <div className='todolist-content'>
                            <TodosInList id={dataItem.id} />
                        </div>
                        <div className='completed-todos'>
                            <p>4/15</p>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default TodoLists;