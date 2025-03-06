import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5003;

// Get the file patch from the URL of the current module
const __filename = fileURLToPath(import.meta.url);

// Get the directory name from the file path
const __dirname = dirname(__filename);

app.use(express.json());

// Serves the HTML file from public directory
// Tells express to serve all the files from the public folder as static assets
app.use(express.static(path.join(__dirname, '../public')));

// Serving up the HTML file from the /public directory (No auth required here)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes that require authentication
app.use('/todos', authMiddleware, todoRoutes);

// Routes that don't require authentication (auth routes for login, registration)
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server has started ${PORT}`);
});
