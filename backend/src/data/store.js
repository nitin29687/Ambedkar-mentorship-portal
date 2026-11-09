import bcrypt from 'bcryptjs';

export const state = {
  questions: [],
  mentors: [],
  responses: [],
  admins: [],
};

export function initializeStore() {
  if (state.mentors.length === 0) {
    state.mentors.push(
      {
        id: 1,
        name: 'Dr. Ravi Sharma',
        email: 'ravi@example.com',
        password: '$2a$12$KiJ3DE68W0p2gVqRe.z5Nu4puuKouaPSlLwiROdy0hAA5WLMQvkYK',
        photo: null,
        education: 'MBA, Civil Services Mentor',
        experience: '8 years',
        expertisePath: 'COMPETITIVE_EXAMS.UPSC',
        expertiseLabel: 'UPSC Civil Services',
        bio: 'Mentoring students for civil services and competitive exams.',
        isApproved: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Asha Mehta',
        email: 'asha@example.com',
        password: '$2a$12$KiJ3DE68W0p2gVqRe.z5Nu4puuKouaPSlLwiROdy0hAA5WLMQvkYK',
        photo: null,
        education: 'Law graduate',
        experience: '5 years',
        expertisePath: 'LAW.CLAT',
        expertiseLabel: 'CLAT / Law Entrance',
        bio: 'Helping students explore legal education and careers.',
        isApproved: true,
        createdAt: new Date().toISOString(),
      }
    );
  }

  if (state.admins.length === 0) {
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminPasswordHash = process.env.ADMIN_PASSWORD
      ? bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12)
      : (process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('admin123', 12));

    state.admins.push({
      id: 1,
      email: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      password: adminPasswordHash,
    });
  }

  if (state.questions.length === 0) {
    state.questions.push(
      {
        id: 1,
        name: 'Priya Kumari',
        place: 'Bhojpur',
        district: 'Bhojpur',
        state: 'Bihar',
        email: 'priya@example.com',
        phone: '9876543210',
        question: 'How can I prepare for UPSC while studying full-time?',
        category: 'UPSC',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Ramesh Yadav',
        place: 'Kharagpur',
        district: 'Midnapore',
        state: 'West Bengal',
        email: 'ramesh@example.com',
        phone: '9123456780',
        question: 'What options are available for scholarships after class 12?',
        category: 'SCHOLARSHIPS',
        status: 'ASSIGNED',
        createdAt: new Date().toISOString(),
      }
    );
  }
}
