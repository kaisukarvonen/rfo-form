import express from 'express';
import nodemailer from 'nodemailer';
// import { SENDER, SENDER_PW, TO } from '../config';

const router = express.Router();

router.post('/', (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_SENDER_PW,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_SENDER, // sender address
    to: process.env.EMAIL_TO, // list of receivers
    replyTo: req.body.email,
    subject: req.body.title, // Subject line
    html: req.body.html, // plain text body
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      res.json(err);
    } else {
      res.json(info);
    }
  });
});

export default router;
