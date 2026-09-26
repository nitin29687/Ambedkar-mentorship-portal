import nodemailer from 'nodemailer';

const smtpHost = process.env.EMAIL_HOST;
const smtpPort = Number(process.env.EMAIL_PORT || 587);
const smtpUser = process.env.EMAIL_USER;
const smtpPass = process.env.EMAIL_PASS;
const defaultFrom = process.env.EMAIL_FROM || smtpUser || 'noreply@ambedkar-mentorship.local';

let transporter = null;

if (smtpHost && smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

export async function sendMail({ to, subject, text, html }) {
  if (!to) {
    return { sent: false, reason: 'Missing recipient' };
  }

  if (!transporter) {
    console.log(`[Email skipped] To: ${to} | Subject: ${subject}`);
    return { sent: false, reason: 'SMTP not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: defaultFrom,
      to,
      subject,
      text,
      html,
    });

    console.log(`[Email sent] To: ${to} | Subject: ${subject} | MessageId: ${info.messageId}`);
    return { sent: true, info };
  } catch (error) {
    console.error(`[Email failed] To: ${to} | Subject: ${subject}`);
    console.error(error);
    return { sent: false, error };
  }
}

export function sendMentorRegistrationEmail(name, email) {
  return sendMail({
    to: email,
    subject: 'Mentor registration received',
    text: `Dear ${name},\n\nThank you for registering as a mentor on the Dr. B.R. Ambedkar Mentorship Portal. Your profile has been received and is currently under admin review. We will notify you once it is approved.\n\nRegards,\nAmbedkar Mentorship Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a;">
        <h2>Mentor registration received</h2>
        <p>Dear ${name},</p>
        <p>Thank you for registering as a mentor on the Dr. B.R. Ambedkar Mentorship Portal.</p>
        <p>Your profile has been received and is currently under admin review. We will notify you once your registration is approved.</p>
        <p>Regards,<br />Ambedkar Mentorship Portal</p>
      </div>
    `,
  });
}

export function sendMentorApprovalEmail(name, email) {
  return sendMail({
    to: email,
    subject: 'Your mentor registration has been approved',
    text: `Dear ${name},\n\nCongratulations! Your mentor registration has been approved by the admin team. You can now log in and start supporting students through the platform.\n\nRegards,\nAmbedkar Mentorship Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a;">
        <h2>Mentor registration approved</h2>
        <p>Dear ${name},</p>
        <p>Congratulations! Your mentor registration has been approved by the admin team.</p>
        <p>You can now log in and start supporting students through the platform.</p>
        <p>Regards,<br />Ambedkar Mentorship Portal</p>
      </div>
    `,
  });
}

export function sendQuestionAssignedEmail(mentorEmail, mentorName, studentName, questionText) {
  return sendMail({
    to: mentorEmail,
    subject: 'A new student query has been assigned to you',
    text: `Dear ${mentorName},\n\nA new query from ${studentName} has been assigned to you.\n\nStudent question:\n${questionText}\n\nPlease respond through the portal at the earliest.\n\nRegards,\nAmbedkar Mentorship Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a;">
        <h2>New query assigned</h2>
        <p>Dear ${mentorName},</p>
        <p>A new query from <strong>${studentName}</strong> has been assigned to you.</p>
        <p><strong>Student question:</strong></p>
        <p>${questionText}</p>
        <p>Please respond through the portal at the earliest.</p>
        <p>Regards,<br />Ambedkar Mentorship Portal</p>
      </div>
    `,
  });
}

export function sendQueryReceivedEmail(studentName, studentEmail) {
  return sendMail({
    to: studentEmail,
    subject: 'We have received your query',
    text: `Dear ${studentName},\n\nThank you for reaching out to the Dr. B.R. Ambedkar Mentorship Portal. We have received your query and our team will connect with you soon.\n\nRegards,\nAmbedkar Mentorship Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a;">
        <h2>We have received your query</h2>
        <p>Dear ${studentName},</p>
        <p>Thank you for reaching out to the Dr. B.R. Ambedkar Mentorship Portal.</p>
        <p>We have received your query and our team will connect with you soon.</p>
        <p>Regards,<br />Ambedkar Mentorship Portal</p>
      </div>
    `,
  });
}

export function sendQuestionAnsweredEmail(studentName, studentEmail, mentorName, answerText) {
  return sendMail({
    to: studentEmail,
    subject: 'Your question has been answered',
    text: `Dear ${studentName},\n\nA response has been shared by ${mentorName} on the Dr. B.R. Ambedkar Mentorship Portal.\n\nResponse:\n${answerText}\n\nYou can also log in to the portal to continue the conversation.\n\nRegards,\nAmbedkar Mentorship Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a;">
        <h2>Your question has been answered</h2>
        <p>Dear ${studentName},</p>
        <p>A response has been shared by <strong>${mentorName}</strong> on the Dr. B.R. Ambedkar Mentorship Portal.</p>
        <p><strong>Response:</strong></p>
        <p>${answerText}</p>
        <p>You can also log in to the portal to continue the conversation.</p>
        <p>Regards,<br />Ambedkar Mentorship Portal</p>
      </div>
    `,
  });
}
