const nodemailer = require('nodemailer');
const fs = require('fs/promises');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS
  }
});

async function sendInvoiceEmail(recipientEmail, filePath) {
  const attachment = await fs.readFile(filePath);

  const mailOptions = {
    from: `"BMT Panel" <${process.env.GMAIL_USER}>`,
    to: recipientEmail,
    subject: 'Rachunek za wynajem',
    text: 'W załączniku znajduje się rachunek za bieżący miesiąc.',
    attachments: [
      {
        filename: filePath.split('/').pop(),
        content: attachment
      }
    ]
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendInvoiceEmail };
