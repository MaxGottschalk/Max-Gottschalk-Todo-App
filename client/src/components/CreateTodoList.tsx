import React, { useState } from 'react';

const CreateTodoListPage: React.FC = () => {
    
    const [name, setName] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:6969/todolist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name }),
            });

            if (response.ok) {
                alert('Todo list created successfully!');
                setName(''); // Clear input field after submission
            } else {
                // Handle error
                alert('Failed to create todo list');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while creating todo list');
        }
    };
    
    return (
        <div className='createTodoContent'>
          <h2>Create Todo-List</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input type="text" value={name} onChange={handleInputChange} className='input-form' />
            </label>
            <button type="submit">Create</button>
          </form>
        </div>
      );
};

export default CreateTodoListPage;