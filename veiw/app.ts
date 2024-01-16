import express from 'express';
import cors from 'cors';
import * as TodoController from '../controller/controller';
import { executeQuery } from '../types/database';

const app = express();
const port = 6969;

app.use(cors({ origin: '*' }));
app.use(express.json());

//Array
//app.post('/todos', TodoController.postTodoHandler);
//app.get('/todolist', TodoController.getTodoListHandler);
//app.get('/todos/:id', TodoController.getTodoByIdHandler);
//app.put('/todos/:id', TodoController.putTodoByIdHandler);
//app.delete('/todos/:id', TodoController.deleteTodoByIdHandler);

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
    try {

        const todoData = req.body;

        // Create the todo and get the todoId
        const todoId = await TodoController.createTodo(todoData);

        // Extract the listId from todoData
        const listId = todoData.list_id;

        // Insert into the linkedIn table
        const linkedInSql = 'INSERT INTO linkedIn (list_id, todo_id) VALUES (?, ?)';
        const linkedInValues = [listId, todoId];
        await executeQuery(linkedInSql, linkedInValues);

        // Respond with the created todo and status 201
        res.status(201).json({ id: todoId, ...todoData });

    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).send('Internal Server Error');
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

        const updatedTodo = await TodoController.updateTodoById(todoId, updatedTodoData);

        if (updatedTodo) {
            res.json(updatedTodo);
        } else {
            res.status(404).send('Todo not found');
        }
    } catch (error) {
        console.error('Error updating todo by ID:', error);
        res.status(500).send('Internal Server Error');
    }
});

//Delete
//Delete specific todo by id
app.delete('/todos/:id', async (req, res) => {
    try {
        const todoId = parseInt(req.params.id, 10);

        const deletedTodo = await TodoController.deleteTodoById(todoId);

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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});