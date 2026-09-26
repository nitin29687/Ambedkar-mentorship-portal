import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'change_me';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password: hashedPassword },
  });

  await prisma.mentor.createMany({
    data: [
      {
        name: 'Dr. Ravi Sharma',
        email: 'ravi@example.com',
        password: await bcrypt.hash('mentor123', 12),
        education: 'MBA, Civil Services Mentor',
        experience: '8 years',
        expertisePath: 'COMPETITIVE_EXAMS.UPSC',
        expertiseLabel: 'UPSC Civil Services',
        bio: 'Mentoring students for civil services and competitive exams.',
        isApproved: true,
      },
      {
        name: 'Asha Mehta',
        email: 'asha@example.com',
        password: await bcrypt.hash('mentor123', 12),
        education: 'Law graduate',
        experience: '5 years',
        expertisePath: 'LAW.CLAT',
        expertiseLabel: 'CLAT / Law Entrance',
        bio: 'Helping students explore legal education and careers.',
        isApproved: true,
      },
      {
        name: 'Nikhil Rao',
        email: 'nikhil@example.com',
        password: await bcrypt.hash('mentor123', 12),
        education: 'Engineer and startup mentor',
        experience: '7 years',
        expertisePath: 'JOBS.ENTREPRENEURSHIP',
        expertiseLabel: 'Entrepreneurship / Self-employment',
        bio: 'Supporting young people in entrepreneurship and practical career skills.',
        isApproved: true,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.question.createMany({
    data: [
      {
        name: 'Priya Kumari',
        place: 'Bhojpur',
        district: 'Bhojpur',
        state: 'Bihar',
        email: 'priya@example.com',
        phone: '9876543210',
        question: 'How can I prepare for UPSC while studying full-time?',
        category: 'UPSC',
        status: 'PENDING',
      },
      {
        name: 'Ramesh Yadav',
        place: 'Kharagpur',
        district: 'Midnapore',
        state: 'West Bengal',
        email: 'ramesh@example.com',
        phone: '9123456780',
        question: 'What options are available for scholarships after class 12?',
        category: 'SCHOLARSHIPS',
        status: 'ASSIGNED',
      },
      {
        name: 'Sneha Singh',
        place: 'Raipur',
        district: 'Raipur',
        state: 'Chhattisgarh',
        email: 'sneha@example.com',
        phone: '9988776655',
        question: 'How do I build a roadmap for law entrance exams?',
        category: 'CLAT',
        status: 'PENDING',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed data inserted.');
}

main().finally(() => prisma.$disconnect());
