import React, { useState } from 'react';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import Modal from 'react-modal';
import "../css/modalStyle.css";
import { Todos, UpdateTodoProps } from '../types';


const UpdateTodo: React.FC<UpdateTodoProps> = ({ id, onUpdateSuccess }) => {

  const [todo, setTodo] = useState('');
  const [time, setTime] = useState(0);
  const [listId, setListId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdate = async () => {
    try {

      const updateTodo: Todos = {
        list_id: listId,
        todo: {
          todo: todo,
          time: time,
          id: id,
          isDone: false,
        },
      };

      const response = await fetch(`http://localhost:6969/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateTodo),
      });

      if (response.ok) {
        alert('Todo Updated!');
        setIsModalOpen(false);
        onUpdateSuccess();
      } else {
        // Handle error
        alert('Failed to update todo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating todo');
    }
  };


  return (
    <div className='update-icon'>
      <CIcon onClick={() => setIsModalOpen(true)} icon={cilPencil} size='sm' />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Update Todo"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <h2>Update Todo</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <div>
            <label>
              Todo:
              <input
                type="text"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                placeholder="Update todo"
                className='input-form'
              />
            </label>
          </div>
          <div>
            <label>
              Time:
              <input
                type="number"
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
                placeholder="Update time"
                className='input-form'
              />
            </label>
          </div>
          <div>
            <label>
              List ID:
              <input
                type="number"
                value={listId}
                onChange={(e) => setListId(Number(e.target.value))}
                placeholder="Update list ID"
                className='input-form'
              />
            </label>
          </div>
          <button type="submit">Update Todo</button>
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default UpdateTodo;