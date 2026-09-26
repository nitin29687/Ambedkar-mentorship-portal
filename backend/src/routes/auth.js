import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { state } from '../data/store.js';
import upload from '../middleware/upload.js';
import { sendMentorRegistrationEmail } from '../lib/mailer.js';

const router = express.Router();

router.post('/mentor/register', (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'File upload failed.' });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { name, email, password, education, experience, expertisePath, expertiseLabel, bio } = req.body;

    if (!name || !email || !password || !education || !experience || !expertisePath) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    if (state.mentors.find(m => m.email === email)) {
      return res.status(400).json({ message: 'A mentor with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const newMentor = {
      id: state.mentors.length > 0 ? Math.max(...state.mentors.map(m => m.id)) + 1 : 1,
      name, email,
      password: hashedPassword,
      photo: photoPath,
      education, experience, expertisePath, expertiseLabel,
      bio: bio || null,
      isApproved: false,
      createdAt: new Date().toISOString(),
    };

    state.mentors.push(newMentor);
    await sendMentorRegistrationEmail(name, email);
    res.status(201).json({ message: 'Registration successful. Awaiting approval.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
});

router.post('/mentor/login', async (req, res) => {
  const { email, password } = req.body;
  const mentor = state.mentors.find(m => m.email === email);

  if (!mentor || !mentor.isApproved) {
    return res.status(401).json({ message: 'Mentor not found or not approved.' });
  }

  const isValid = await bcrypt.compare(password, mentor.password);
  if (!isValid) return res.status(401).json({ message: 'Invalid credentials.' });

  const token = jwt.sign(
    { id: mentor.id, role: 'mentor', email: mentor.email },
    process.env.JWT_SECRET || 'dev-secret'
  );
  res.json({ token, mentor: { id: mentor.id, name: mentor.name, email: mentor.email, expertiseLabel: mentor.expertiseLabel } });
});

router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = state.admins.find(a => a.email === email);

  if (!admin) return res.status(401).json({ message: 'Invalid admin credentials.' });

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) return res.status(401).json({ message: 'Invalid admin credentials.' });

  const token = jwt.sign(
    { id: admin.id, role: 'admin', email: admin.email },
    process.env.JWT_SECRET || 'dev-secret'
  );
  res.json({ token, admin: { id: admin.id, email: admin.email } });
});

export default router;
