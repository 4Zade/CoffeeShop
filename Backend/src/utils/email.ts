import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink: string = `${process.env.Mail_URL}/verify/${token}`;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `
            <h1>Verify your email</h1>
            <p>Please verify your email by clicking the button below:</p>
            <a href="${verificationLink}" style="
                background-color: #4CAF50; 
                color: white; 
                padding: 10px 20px; 
                text-align: center; 
                text-decoration: none; 
                display: inline-block; 
                font-size: 16px; 
                border-radius: 5px;
                font-family: Arial, sans-serif;
            ">Verify Your Email</a>
        `,
  };
  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink: string = `${process.env.MAIL_URL}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    html: `
          <h1>Reset your password</h1>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" style="
            background-color: #007bff; 
            color: white; 
            padding: 10px 20px; 
            text-align: center; 
            text-decoration: none; 
            display: inline-block; 
            font-size: 16px; 
            border-radius: 5px;
          ">Reset Password</a>
        `,
  };
  await transporter.sendMail(mailOptions);
}

export async function sendContactEmail(email: string, subject: string, message: string) {
  console.log(email, subject, message, process.env.MAIL_USER);

  const mailOptions = {
    from: email,
    to: process.env.MAIL_USER,
    subject: subject,
    text: message,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}