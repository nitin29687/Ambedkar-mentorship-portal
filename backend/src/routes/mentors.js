import express from 'express';
import { state } from '../data/store.js';

const router = express.Router();

router.get('/', (_req, res) => {
  const approved = state.mentors
    .filter(m => m.isApproved)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(({ id, name, photo, expertiseLabel, experience, bio }) => ({
      id, name, photo, expertiseLabel, experience, bio,
    }));
  res.json(approved);
});

router.get('/:id', (req, res) => {
  const mentor = state.mentors.find(m => m.id === Number(req.params.id) && m.isApproved);
  if (!mentor) return res.status(404).json({ message: 'Mentor not found.' });
  const { id, name, photo, expertiseLabel, experience, bio, education } = mentor;
  res.json({ id, name, photo, expertiseLabel, experience, bio, education });
});

export default router;
