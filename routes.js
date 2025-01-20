import { Router } from 'express';
import { User, Exercise } from './database.js';

export const router = Router();

// POST /api/users - Create a new user
router.post('/users', async (req, res) => {
  const { username } = req.body;
  
  try {
    const user = await User.create({ username });
    res.json({
      username: user.username,
      _id: user._id
    });
  } catch (error) {
    res.status(400).json({ error: 'Username already taken' });
  }
});

// GET /api/users - Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('username _id');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// POST /api/users/:_id/exercises - Add exercise for user
router.post('/users/:_id/exercises', async (req, res) => {
  let { description, duration, date } = req.body;
  const userId = req.params._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const exercise = await Exercise.create({
      userId,
      description,
      duration: Number(duration),
      date: date ? new Date(date) : new Date()
    });

    res.json({
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString(),
      _id: user._id
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input data' });
  }
});

// GET /api/users/:_id/logs - Get user's exercise log
router.get('/users/:_id/logs', async (req, res) => {
  const { from, to, limit } = req.query;
  const userId = req.params._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let dateFilter = { userId };
    if (from || to) {
      dateFilter.date = {};
      if (from) dateFilter.date.$gte = new Date(from);
      if (to) dateFilter.date.$lte = new Date(to);
    }

    let exercises = await Exercise.find(dateFilter)
      .limit(limit ? Number(limit) : undefined)
      .sort({ date: 1 });

    const log = exercises.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    }));

    res.json({
      username: user.username,
      count: exercises.length,
      _id: user._id,
      log
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching exercise log' });
  }
});