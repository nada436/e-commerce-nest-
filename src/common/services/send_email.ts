import * as nodemailer from 'nodemailer';
import { SendMailOptions } from 'nodemailer';
export const send_email = async (data: SendMailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'nada.nasr436@gmail.com',
        pass: process.env.pass,
      },
    });

    const mailOptions = {
      from: `"Nada Nasr 👻" <nada.nasr436@gmail.com>`,
      ...data,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
