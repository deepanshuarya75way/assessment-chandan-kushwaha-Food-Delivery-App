import validator from "validator";
import nodemailer from "nodemailer";
import "dotenv/config";
import contactModel from "../models/contactModel.js";

const mailConfigured =
  process.env.MAIL_HOST &&
  process.env.MAIL_PORT &&
  process.env.MAIL_USER &&
  process.env.MAIL_PASSWORD &&
  process.env.MAIL_TO;

const mailTransporter = mailConfigured
  ? nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: Number(process.env.MAIL_PORT) === 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    })
  : null;

const submitContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "Please complete all contact form fields.",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  if (name.trim().length < 2 || subject.trim().length < 3 || message.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: "Please provide more detail in your message.",
    });
  }

  try {
    const contactMessage = await contactModel.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    if (mailTransporter) {
      await mailTransporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: process.env.MAIL_TO,
        replyTo: contactMessage.email,
        subject: `FoodZone contact: ${contactMessage.subject}`,
        text: [
          `Name: ${contactMessage.name}`,
          `Email: ${contactMessage.email}`,
          `Subject: ${contactMessage.subject}`,
          "",
          contactMessage.message,
        ].join("\n"),
      });
    }

    return res.status(201).json({
      success: true,
      message: mailTransporter
        ? "Your message has been sent. Our team will reply soon."
        : "Your message was saved. Mail notifications are not configured yet.",
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    return res.status(500).json({
      success: false,
      message: "We could not send your message. Please try again.",
    });
  }
};

export { submitContactMessage };
