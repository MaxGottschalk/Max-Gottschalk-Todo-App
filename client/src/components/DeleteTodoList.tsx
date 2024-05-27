import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { deleteTodoProp } from '../types';

const DeleteTodoList: React.FC<deleteTodoProp> = ({ id, onDelete }) => {

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:6969/todolist/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete(id);
        alert('Todo-list Deleted!');

      } else {
        // Handle error
        alert('Failed to delete todo-list');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting todo');
    }
  };

  return (
    <CIcon onClick={handleDelete} icon={cilTrash} size='sm' className='delete-icon' />
  );
};

export default DeleteTodoList;