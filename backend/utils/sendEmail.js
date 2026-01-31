const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // ADD THIS SECTION BELOW
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: `"Marc Shop" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html, 
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;