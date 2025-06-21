const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🛡️ Rate limiting (5 requests per hour per IP)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: 'Too many submissions from this IP. Try again in an hour.' },
});
app.use('/send-message', limiter);

// 🧼 Sanitize helper
function sanitizeInput(str) {
  return String(str).replace(/<[^>]*>?/gm, '').trim();
}

app.post('/send-message', async (req, res) => {
  let { name, email, subject, message, website } = req.body;

  // 🛑 Honeypot check
  if (website && website.trim() !== '') {
    console.warn('🚨 Bot detected via honeypot!');
    return res.status(400).json({ message: 'Bot submission blocked.' });
  }

  // Sanitize inputs
  name = sanitizeInput(name);
  email = sanitizeInput(email);
  subject = sanitizeInput(subject);
  message = sanitizeInput(message);

  // Email format check
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!validEmail) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: subject || 'New message from Chrono Biomedical contact form',
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });

    console.log('✅ Email sent successfully!');
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
