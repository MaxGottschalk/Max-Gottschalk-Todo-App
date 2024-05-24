import "../css/menu.css";
import TodoLists from './TodoLists';
import Todos from './Todos';


const HomePage: React.FC = () => {
    return(
        <div>
            <h1 className='menu'>Home</h1>
            <div className="menu-content">
                <div>
                    <h1>Todos</h1>
                    <Todos/>
                </div>
                <div>
                    <h1>Todo-list</h1>
                    <TodoLists/>
                </div>
            </div>
        </div>
    ) 
};

export default HomePage;