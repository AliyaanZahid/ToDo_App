import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

// GET all todos for the authenticated user
router.get('/', async (req, res) => {
    try {
        const todos = await prisma.todo.findMany({
            where: {
                userId: req.user.id,  // Make sure userId is coming from the authenticated user's token
            },
        });
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST a new todo for the authenticated user
router.post('/', async (req, res) => {
    const { task } = req.body;
    
    try {
        const todo = await prisma.todo.create({
            data: {
                task,
                userId: req.user.id,  // Use userId from authenticated user's token
            },
        });
        res.json(todo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a todo
router.put('/:id', async (req, res) => {
    const { completed } = req.body;
    const { id } = req.params;
    
    try {
        const updatedTodo = await prisma.todo.update({
            where: {
                id: parseInt(id),
                userId: req.user.id,  // Ensure only the user who owns the todo can update it
            },
            data: {
                completed: !!completed,
            },
        });
        res.json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;  // Extract user ID from the token

    try {
        const todo = await prisma.todo.delete({
            where: {
                id: parseInt(id),
                userId: userId
            }
        });

        // If the todo was deleted successfully
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


export default router;
