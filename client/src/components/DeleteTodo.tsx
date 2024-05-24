import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { deleteTodoProp } from '../types';

const DeleteTodo: React.FC<deleteTodoProp> = ({ id, onDelete }) => {
        
    const handleDelete = async () => {
        try {
          const response = await fetch(`http://localhost:6969/todos/${id}`, {
            method: 'DELETE',
          });
    
          if (response.ok) {
            onDelete(id);
            alert('Todo Deleted!');
            
          } else {
            // Handle error
            alert('Failed to delete todo');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while deleting todo');
        }
      };
    
      return (
        <div className='trash-icon'>
          <CIcon onClick={handleDelete} icon={cilTrash} size='sm' />
        </div>

      );
};

export default DeleteTodo;