import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail password or App Password
  },
});

export const sendWelcomeEmail = async (to: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Welcome to CRX',
    text: 'Welcome to CRX, the Carbon Credit Exchange!',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to', to);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};
