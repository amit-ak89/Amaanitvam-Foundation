const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send certificate email with PDF attachment
 */
const sendCertificateEmail = async ({ to, name, certificateId, pdfBuffer }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: `🎓 Your Internship Certificate – Amaanitvam Foundation`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1a472a, #2d6a4f); padding: 30px; text-align: center;">
          <h1 style="color: #f0c040; margin: 0; font-size: 24px;">Amaanitvam Foundation</h1>
          <p style="color: #a8d5b5; margin: 5px 0 0;">Internship Certificate</p>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Dear <strong>${name}</strong>,</p>
          <p style="color: #555; line-height: 1.6;">
            Congratulations! We are pleased to share your official internship certificate from 
            <strong>Amaanitvam Foundation</strong>. Your dedication and hard work during the internship 
            have been truly commendable.
          </p>
          <div style="background: #f9f9f9; border-left: 4px solid #2d6a4f; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #333;"><strong>Certificate ID:</strong> ${certificateId}</p>
          </div>
          <p style="color: #555;">
            Your certificate is attached to this email as a PDF. You can also verify its authenticity at any time.
          </p>
          <p style="color: #888; font-size: 13px; margin-top: 30px;">
            With regards,<br/>
            <strong>Amaanitvam Foundation Team</strong>
          </p>
        </div>
        <div style="background: #f5f5f5; padding: 15px; text-align: center;">
          <p style="color: #aaa; font-size: 12px; margin: 0;">© 2026 Amaanitvam Foundation. All rights reserved.</p>
        </div>
      </div>
    `,
    attachments: pdfBuffer
      ? [{ filename: `Certificate-${certificateId}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }]
      : [],
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send application status update email
 */
const sendStatusEmail = async ({ to, name, status, role }) => {
  const statusMessages = {
    selected: { subject: '🎉 Congratulations! You are Selected – Amaanitvam Foundation', color: '#2d6a4f', msg: 'We are thrilled to inform you that you have been <strong>selected</strong> for the internship program.' },
    rejected: { subject: 'Application Update – Amaanitvam Foundation', color: '#c0392b', msg: 'After careful review, we regret to inform you that we are unable to move forward with your application at this time.' },
    completed: { subject: '✅ Internship Completed – Amaanitvam Foundation', color: '#2980b9', msg: 'Congratulations on successfully completing your internship! Your certificate will be emailed shortly.' },
  };

  const info = statusMessages[status];
  if (!info) return;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: info.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: ${info.color}; padding: 25px; text-align: center;">
          <h2 style="color: #fff; margin: 0;">Amaanitvam Foundation</h2>
        </div>
        <div style="padding: 30px;">
          <p>Dear <strong>${name}</strong>,</p>
          <p style="color: #555; line-height: 1.6;">${info.msg}</p>
          <p style="color: #555;">Role Applied: <strong>${role}</strong></p>
          <p style="color: #888; font-size: 13px; margin-top: 30px;">Regards,<br/><strong>Amaanitvam Foundation Team</strong></p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendCertificateEmail, sendStatusEmail };
