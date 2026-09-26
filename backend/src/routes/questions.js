import express from 'express';
import { state } from '../data/store.js';
import { sendQueryReceivedEmail } from '../lib/mailer.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, place, district, state: studentState, email, phone, question, category } = req.body;

  if (!name || !place || !district || !studentState || !email || !question) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  const newQuestion = {
    id: state.questions.length > 0 ? Math.max(...state.questions.map(q => q.id)) + 1 : 1,
    name, place, district,
    state: studentState,
    email,
    phone: phone || null,
    question,
    category: category || null,
    status: 'PENDING',
    mentorId: null,
    createdAt: new Date().toISOString(),
  };

  state.questions.push(newQuestion);
  if (email) {
    await sendQueryReceivedEmail(name, email);
  }
  res.status(201).json({ message: 'Question submitted successfully.' });
});

router.get('/', (_req, res) => {
  const publicQuestions = state.questions
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(({ id, name, question, category, status, createdAt }) => ({
      id, name, question, category, status, createdAt,
    }));
  res.json(publicQuestions);
});

router.get('/:id', (req, res) => {
  const q = state.questions.find(q => q.id === Number(req.params.id));
  if (!q) return res.status(404).json({ message: 'Question not found.' });
  const { id, name, question, category, status, createdAt } = q;
  res.json({ id, name, question, category, status, createdAt });
});

export default router;
