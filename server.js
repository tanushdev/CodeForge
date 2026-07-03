require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dsa-tracker-dev-secret';
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa-tracker')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ── Auth routes ──

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const user = await User.create({ email: email.toLowerCase().trim(), password });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.toPublicJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Protected progress routes ──

app.get('/api/progress', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.toPublicJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/progress', authMiddleware, async (req, res) => {
  try {
    const { checked, lessonProgress } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (checked !== undefined) user.checked = checked;
    if (lessonProgress && typeof lessonProgress === 'object') {
      if (lessonProgress.current !== undefined) user.lessonProgress.current = lessonProgress.current;
      if (lessonProgress.completed !== undefined) user.lessonProgress.completed = lessonProgress.completed;
      if (lessonProgress.codeDone !== undefined) user.lessonProgress.codeDone = lessonProgress.codeDone;
      if (lessonProgress.practiceDone !== undefined) user.lessonProgress.practiceDone = lessonProgress.practiceDone;
      if (lessonProgress.notes !== undefined) user.lessonProgress.notes = lessonProgress.notes;
    }
    await user.save();
    res.json(user.toPublicJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Review (spaced repetition) routes ──

app.get('/api/review', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ reviewSchedule: Object.fromEntries((user.reviewSchedule || new Map()).entries()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/review', authMiddleware, async (req, res) => {
  try {
    const { reviewSchedule } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (reviewSchedule !== undefined) {
      user.reviewSchedule = new Map(Object.entries(reviewSchedule));
    }
    await user.save();
    res.json({ reviewSchedule: Object.fromEntries((user.reviewSchedule || new Map()).entries()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── System Design Grading Routes ──

const sdRubrics = require('./src/data/sdRubrics');

app.get('/api/design-grades', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ designGrades: Object.fromEntries((user.designGrades || new Map()).entries()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/design-grades', authMiddleware, async (req, res) => {
  try {
    const { problemId, grade } = req.body;
    if (!problemId || !grade) {
      return res.status(400).json({ error: 'problemId and grade required' });
    }
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.designGrades.set(problemId, { ...grade, submittedAt: new Date().toISOString() });
    await user.save();
    res.json({ designGrades: Object.fromEntries((user.designGrades || new Map()).entries()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function matchKeyword(text, required) {
  const nText = normalize(text);
  const terms = [required.key, ...(required.aliases || [])];
  for (const term of terms) {
    if (nText.includes(normalize(term))) {
      return true;
    }
  }
  return false;
}

function gradeSection(userText, rubricSection) {
  let matched = 0;
  let total = 0;
  let matchedItems = [];
  let missingItems = [];
  for (const item of rubricSection.required) {
    total += item.points;
    if (matchKeyword(userText, item)) {
      matched += item.points;
      matchedItems.push(item.key);
    } else {
      missingItems.push(item.key);
    }
  }
  return {
    score: total > 0 ? Math.round((matched / total) * 100) : 0,
    matched: matchedItems,
    missing: missingItems,
    points: `${matched}/${total}`
  };
}

app.post('/api/grade/:problemId', (req, res) => {
  try {
    const { problemId } = req.params;
    const { answers } = req.body;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'answers object required' });
    }

    const problem = sdRubrics[problemId];
    if (!problem) {
      return res.status(404).json({ error: `No rubric found for problem: ${problemId}` });
    }

    const sectionNames = ['requirements', 'api_design', 'schema', 'components', 'scaling'];
    const sections = {};
    let totalScore = 0;
    let sectionCount = 0;

    for (const name of sectionNames) {
      const userText = answers[name] || '';
      const rubricSection = problem.rubric[name];
      if (rubricSection) {
        const result = gradeSection(userText, rubricSection);
        sections[name] = result;
        totalScore += result.score;
        sectionCount++;
      }
    }

    const overall = sectionCount > 0 ? Math.round(totalScore / sectionCount) : 0;

    res.json({
      problemId,
      overall,
      sections,
      modelAnswer: problem.modelAnswer
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const dist = path.join(__dirname, 'dist');
app.use(express.static(dist));

app.get('*', (req, res) => {
  const buildIndex = path.join(dist, 'index.html');
  if (require('fs').existsSync(buildIndex)) {
    res.sendFile(buildIndex);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
