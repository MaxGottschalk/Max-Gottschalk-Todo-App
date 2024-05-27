import "../css/menu.css";
import TodoLists from './TodoLists';

const HomePage: React.FC = () => {
    return (
        <div>
            <h1 className='menu'>Home</h1>
            <div className="menu-content">
                <div>
                    <h2>Todo-list</h2>
                    <div className="menu-list">
                        <TodoLists />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default HomePage;