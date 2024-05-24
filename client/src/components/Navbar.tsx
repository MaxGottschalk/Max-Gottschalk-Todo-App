import { useState } from "react";
import CreateTodo from "./CreateTodo";
import CreateTodoList from "./CreateTodoList";
import '../css/navbarStyle.css'
import Home from "./Home";


export default function Navbar(){
    
    enum Pages {
        HOME = "HOME",
        CREATE = 'CREATE',
        CREATE_LIST = 'CREATE_LIST',
      }

    const [currentPage, setCurrentPage] = useState<Pages | null>(Pages.HOME);

    const renderPage = () => {
        switch (currentPage) {
            case Pages.HOME:
                return <Home/>;
            case Pages.CREATE:
                return <CreateTodo />;
            case Pages.CREATE_LIST:
                return <CreateTodoList />;
            default:
                return null;
        }
    };

    return (
    <div>
        <div className='navbar'>

            <button onClick={() => setCurrentPage(Pages.HOME)}>Home</button>

            <button onClick={() => setCurrentPage(Pages.CREATE_LIST)}>Create List</button>

            <button onClick={() => setCurrentPage(Pages.CREATE)}>Create Todo</button>
                             
        </div>
        <div>
            {renderPage()}
        </div>
    </div>
    )

}

