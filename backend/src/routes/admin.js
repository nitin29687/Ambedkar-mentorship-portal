import express from 'express';
import bcrypt from 'bcryptjs';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { state } from '../data/store.js';
import { sendMentorApprovalEmail, sendQuestionAssignedEmail } from '../lib/mailer.js';

const router = express.Router();

router.use(authenticateToken, requireRole('admin'));

router.get('/questions', (_req, res) => {
  const questions = state.questions
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(q => ({
      ...q,
      assignedTo: q.mentorId ? state.mentors.find(m => m.id === q.mentorId) || null : null,
    }));
  res.json(questions);
});

router.post('/questions/:id/assign', (req, res) => {
  const question = state.questions.find(q => q.id === Number(req.params.id));
  const mentor = state.mentors.find(m => m.id === Number(req.body.mentorId));

  if (!question || !mentor) {
    return res.status(404).json({ message: 'Question or mentor not found.' });
  }

  question.status = 'ASSIGNED';
  question.mentorId = mentor.id;
  sendQuestionAssignedEmail(mentor.email, mentor.name, question.name, question.question).catch(() => {});
  res.json({ message: 'Question assigned successfully.' });
});

router.get('/mentors/pending', (_req, res) => {
  const pending = state.mentors
    .filter(m => !m.isApproved)
    .map(({ password: _p, ...m }) => m);
  res.json(pending);
});

router.get('/mentors/all', (_req, res) => {
  const all = state.mentors
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(({ password: _p, ...m }) => m);
  res.json(all);
});

router.post('/mentors/:id/approve', async (req, res) => {
  const mentor = state.mentors.find(m => m.id === Number(req.params.id));
  if (!mentor) return res.status(404).json({ message: 'Mentor not found.' });
  mentor.isApproved = true;
  await sendMentorApprovalEmail(mentor.name, mentor.email);
  res.json({ message: 'Mentor approved.' });
});

router.post('/mentors/:id/disapprove', (req, res) => {
  const mentor = state.mentors.find(m => m.id === Number(req.params.id));
  if (!mentor) return res.status(404).json({ message: 'Mentor not found.' });
  mentor.isApproved = false;
  res.json({ message: 'Mentor disapproved.' });
});

router.delete('/mentors/:id', (req, res) => {
  const idx = state.mentors.findIndex(m => m.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Mentor not found.' });
  state.mentors.splice(idx, 1);
  res.json({ message: 'Mentor removed.' });
});

router.delete('/responses/:id', (req, res) => {
  const idx = state.responses.findIndex(r => r.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Response not found.' });
  state.responses.splice(idx, 1);
  res.json({ message: 'Response removed.' });
});

router.post('/mentor/add', async (req, res) => {
  const { name, email, password, education, experience, expertisePath, expertiseLabel, bio } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  const newMentor = {
    id: state.mentors.length > 0 ? Math.max(...state.mentors.map(m => m.id)) + 1 : 1,
    name, email,
    password: hashedPassword,
    photo: null,
    education, experience, expertisePath, expertiseLabel,
    bio: bio || null,
    isApproved: true,
    createdAt: new Date().toISOString(),
  };

  state.mentors.push(newMentor);
  res.status(201).json({ message: 'Mentor added.' });
});

export default router;
