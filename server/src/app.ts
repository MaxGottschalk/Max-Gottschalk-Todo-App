import express from 'express';
import cors from 'cors';
// @ts-ignore
import * as TodoController from './controller/controller';
// @ts-ignore
import { addTodo } from './services/service';

const app = express();
const port = 6969;

app.use(cors({ origin: '*' }));
app.use(express.json());

//Db
//Get 
//Get a list of all collections
app.get('/todolist', async (req, res) => {
    try {
        const todos = await TodoController.fetchTodoList();
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).send('Internal Server Error');
    }
});

//Get a list of all collections
app.get('/todo', async (req, res) => {
    try {
        const todos = await TodoController.fetchAllTodos();
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).send('Internal Server Error');
    }
});

//Get todo by id
app.get('/todos/:id', async (req, res) => {
    try {
        const todoId = parseInt(req.params.id, 10);

        const todo = await TodoController.getTodoById(todoId);

        if (todo) {
            res.json(todo);
        } else {
            res.status(404).send('Todo not found');
        }
    } catch (error) {
        console.error('Error fetching todo by ID:', error);
        res.status(500).send('Internal Server Error');
    }
});

//Get all todos from specific list by id 
app.get('/linkedin/:id', async (req, res) => {
    try {
        const listId = parseInt(req.params.id, 10);
        const linkedItems = await TodoController.getLinkedItemsById(listId);

        res.json(linkedItems);
    } catch (error) {
        console.error('Error fetching linked items:', error);
        res.status(500).send('Internal Server Error');
    }
});


//Post (Create new todo)
app.post('/todos', async (req, res) => {
    const todoData = req.body;
    const listId = todoData.list_id;
    try {

        // Create the todo and get the todoId
        const todoId = await addTodo(todoData.todo, listId);
        // Respond with the created todo and status 201
        res.status(201).json({ id: todoId, ...todoData });

    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(404).send(`List with id ${listId} does not exist`);
    }
});

//Create a new todolist 
app.post('/todolist', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required.' });
        }

        const todoListId = await TodoController.createTodoList({ name });

        return res.status(201).json({
            id: todoListId,
            name
        });
    } catch (error) {
        console.error('Error creating todo list:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Update todo by ID
app.put('/todos/:id', async (req, res) => {
    try {
        const todoId = parseInt(req.params.id, 10);
        const updatedTodoData = req.body;
        const listId = parseInt(req.body["list_id"]);

        const updatedTodo = await TodoController.updateTodoInDatabase(todoId, updatedTodoData, listId);

        res.json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo by ID:', error);
        res.status(404).send('Todo not found');
    }
});

//Delete
//Delete specific todo by id
app.delete('/todos/:id', async (req, res) => {
    try {
        const todoId = parseInt(req.params.id, 10);

        const deletedTodo = await TodoController.deleteTodoFromDatabase(todoId);

        if (deletedTodo) {
            res.json(deletedTodo);
        } else {
            res.status(404).send('Todo not found');
        }
    } catch (error) {
        console.error('Error deleting todo by ID:', error);
        res.status(500).send('Internal Server Error');
    }
});

//Delete a list from the database
app.delete('/todolist/:id', async (req, res) => {
    try{
        const todolistId = parseInt(req.params.id, 10);

        const deletedTodolist = await TodoController.deleteTodolistById(todolistId);

        if (deletedTodolist) {
            res.json(deletedTodolist);
        } else {
            res.status(404).send('Todo not found');
        }
    } catch(error){
        console.error('Error deleting todo by ID:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});