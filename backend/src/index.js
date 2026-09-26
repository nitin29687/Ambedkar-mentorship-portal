import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';
import mentorRoutes from './routes/mentors.js';
import adminRoutes from './routes/admin.js';
import responseRoutes from './routes/responses.js';
import { initializeStore } from './data/store.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

initializeStore();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/responses', responseRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Ambedkar mentorship portal is running.' });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
