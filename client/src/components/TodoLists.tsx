import React, { useEffect, useState } from 'react';
import { TodoList } from '../types';
import DeleteTodoList from './DeleteTodoList';


const TodoLists: React.FC = () => {
  
    const [todo, setTodoList] = useState<TodoList[]>([]); 

    useEffect(() => {
    async function getTodoList (){
        await fetch("http://localhost:6969/todolist", {
            method: "GET"
        }).then(async (response) => {
            const responseData = await response.json()
            console.log("FIRST OFF, FUCK YOU BITCH AND CLIQUE YOU CLAIM", responseData);
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
            <ul className="card-list">
            {todo?.map(dataItem => (
                <li key={dataItem.id}>
                    <div className="card">
                        <div className="card-header">
                            {dataItem.name}
                            <DeleteTodoList id={dataItem.id} onDelete={handleDelete}/>
                        </div>
                        <div className="card-list-content">
                            <p>List-Id: {dataItem.id}</p>
                        </div>
                        <div className='completed-todos'>
                            <p>4/15</p>
                        </div>
                    </div>
                </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoLists;