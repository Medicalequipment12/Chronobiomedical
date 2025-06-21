const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/send-message', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // ✅ Log the incoming form data
  console.log('📨 Contact form data received:');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Subject:', subject);
  console.log('Message:', message);

  try {
    // ✅ Use Gmail as the email provider
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Log before sending
    console.log('📧 Sending email...');

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
    console.error('📜 Full error:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
