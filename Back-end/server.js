/**
 * Chrono Biomedical contact-form backend
 * Runs on Render, Railway, a VPS, or locally.
 * Author: Shalva Shavliashvili
 * Last update: 2025-06-28
 */
require('dotenv').config();          // load .env first
const express     = require('express');
const nodemailer  = require('nodemailer');
const cors        = require('cors');
const rateLimit   = require('express-rate-limit');

const app  = express();
const PORT = process.env.PORT || 3001;      // Render injects PORT

/* -----------------------------  MIDDLEWARE  ----------------------------- */
// CORS – allow only your production site + localhost for dev
app.use(
  cors({
    origin: [
      'https://www.chronobiomedical.com',   // prod
      'http://localhost:5173',              // dev (Vite example)
    ],
    methods: ['POST'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate-limit: 5 messages / IP / hour
app.use(
  '/send-message',
  rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { message: 'Too many submissions from this IP. Try again in an hour.' },
  })
);

/* -----------------------------  HELPERS  ----------------------------- */
const sanitize = (str) => String(str).replace(/<[^>]*>?/gm, '').trim();

/* -----------------------------  ROUTES  ----------------------------- */
app.post('/send-message', async (req, res) => {
  let { name, email, subject, message, website } = req.body; // “website” is the honeypot

  // Honeypot check
  if (website && website.trim() !== '') {
    console.warn('🚨 Bot detected via honeypot!');
    return res.status(400).json({ message: 'Bot submission blocked.' });
  }

  // Basic validation
  name    = sanitize(name);
  email   = sanitize(email);
  subject = sanitize(subject || 'Message from Chrono Biomedical website');
  message = sanitize(message);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  try {
    /* -----------  IONOS SMTP transporter  ----------- */
    const transporter = nodemailer.createTransport({
      host: 'smtp.ionos.de',          // US customers: smtp.ionos.com  :contentReference[oaicite:0]{index=0}
      port: 465,                      // SSL/TLS port :contentReference[oaicite:1]{index=1}
      secure: true,
      auth: {
        user: process.env.SMTP_USER,  // service@chronobiomedical.com
        pass: process.env.SMTP_PASS,  // strong mailbox password
      },
      tls: { minVersion: 'TLSv1.2' }, // IONOS requires modern TLS :contentReference[oaicite:2]{index=2}
    });

    await transporter.sendMail({
      from: `"Chrono Biomedical" <${process.env.SMTP_USER}>`, // authenticated sender
      to:   process.env.SMTP_USER,                            // you receive it
      replyTo: `${name} <${email}>`,                         // lets you “Reply” directly
      subject,
      html: `
        <h3>New Contact-Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });

    console.log('✅ Email sent!');
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('❌ Mail error:', err.message);
    res.status(500).json({ message: 'Failed to send message.', error: err.message });
  }
});

/* -----------------------------  START  ----------------------------- */
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
