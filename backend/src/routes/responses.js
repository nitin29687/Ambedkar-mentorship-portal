import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { state } from '../data/store.js';
import { sendQuestionAnsweredEmail } from '../lib/mailer.js';

const router = express.Router();

router.use(authenticateToken, requireRole('mentor'));

router.get('/assigned', (req, res) => {
  const mentorId = req.user.id;
  const questions = state.questions
    .filter(q => q.mentorId === mentorId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(questions);
});

router.post('/', async (req, res) => {
  const { questionId, content, isPublic } = req.body;
  const mentorId = req.user.id;
  const question = state.questions.find(q => q.id === Number(questionId));

  if (!question) return res.status(404).json({ message: 'Question not found.' });

  const newResponse = {
    id: state.responses.length > 0 ? Math.max(...state.responses.map(r => r.id)) + 1 : 1,
    content,
    isPublic: isPublic ?? true,
    questionId: Number(questionId),
    mentorId,
    createdAt: new Date().toISOString(),
  };

  state.responses.push(newResponse);
  question.status = 'RESPONDED';
  const studentEmail = question.email;
  const studentName = question.name;
  const mentor = state.mentors.find(m => m.id === mentorId);
  if (studentEmail) {
    sendQuestionAnsweredEmail(studentName, studentEmail, mentor ? mentor.name : 'Our mentor', content).catch(() => {});
  }
  res.status(201).json({ message: 'Response posted successfully.' });
});

export default router;
