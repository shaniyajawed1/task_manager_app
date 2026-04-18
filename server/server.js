const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/taskmanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'TODO', enum: ['TODO', 'IN_PROGRESS', 'DONE'] },
  dueDate: { type: Date },
  assignedTo: { type: String },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Register Route
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({ email, password: hashedPassword, name });
    await user.save();
    
    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'mysecretkey');
    
    res.json({ 
      token, 
      user: { id: user._id, email, name } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'mysecretkey');
    
    res.json({ 
      token, 
      user: { id: user._id, email, name: user.name } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all tasks for a user
app.get('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ 
      createdBy: req.userId 
    }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new task
app.post('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const { title, description, status, dueDate, assignedTo } = req.body;
    const task = new Task({
      title,
      description,
      status: status || 'TODO',
      dueDate,
      assignedTo,
      createdBy: req.userId
    });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a task
app.put('/api/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, status, dueDate, assignedTo } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      { title, description, status, dueDate, assignedTo },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      createdBy: req.userId 
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(Server running on port );
});
