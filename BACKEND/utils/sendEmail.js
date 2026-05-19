import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,  // your Brevo account email
      pass: process.env.EMAIL_PASS,  // Brevo SMTP key (not your Brevo password)
    },
  });

  await transporter.sendMail({
    from: `"StuTrack" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;