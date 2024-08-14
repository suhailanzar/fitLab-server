
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export function generateOTP(length: number): string {
  const digits = "123456789";
  let OTP = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    OTP += digits[randomIndex];
  }

  return OTP;
}

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL || '',
      pass: process.env.PASSWORD || '',
    },
  });

  const mailOptions = {
    from: process.env.EMAIL || '',
    to: email,
    subject: "One-Time Password (OTP) for Authentication for fitLab",
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <h2 style="color: #0066cc;">Your One-Time Password (OTP)</h2>
        <p>Dear Customer,</p>
        <p>Your OTP code is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #0066cc;">${otp}</p>
        <p>Please use this code to complete your authentication process. This OTP is valid for 10 minutes.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
        <p>Best regards,<br>FitLab</p>
        <hr>
        <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}



export async function sendReportEmail(email: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL || '',
      pass: process.env.PASSWORD || '',
    },
  });

  const mailOptions = {
    from: process.env.EMAIL || '',
    to: email,
    subject: "Reported issue Response from FitLab",
    html: `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
  <h2 style="color: #0066cc;">Report Found</h2>
  <p>Dear Customer,</p>
  <p>We are pleased to inform you that your requested report has been found by our admin team. We will take a strict action against the issue </p>
  <p>If you did not expect this email, please contact our support team.</p>
  <p>Best regards,<br>FitLab</p>
  <hr>
  <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply.</p>
</div>

    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
