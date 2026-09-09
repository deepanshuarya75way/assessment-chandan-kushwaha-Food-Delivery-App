import React, { useContext, useState } from "react";
import "./Contact.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const Contact = () => {
  const { url } = useContext(StoreContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsSubmitting(true);
    setFormMessage({ type: "", text: "" });

    try {
      const response = await axios.post(`${url}/api/contact/submit`, {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      form.reset();
      setFormMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setFormMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "We could not send your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <p className="contact-tag">Support Center</p>
        <h1>Contact Us</h1>
      </div>

      <div className="contact-grid">
        <div className="contact-card">
          <h3>Call Us</h3>
          <p><a href="tel:+918953737065">+91 8953737065</a></p>
          <span>Available Mon - Sat, 9:00 AM - 9:00 PM</span>
        </div>

        <div className="contact-card">
          <h3>Email</h3>
          <p><a href="mailto:chandankushwaha8953@gmail.com">chandankushwaha8953@gmail.com</a></p>
          <span>We reply within 24 hours</span>
        </div>

        <div className="contact-card">
          <h3>Visit</h3>
          <p>Near Quantum University, Roorkee, Uttarakhand</p>
          <span>Pickup & support desk</span>
        </div>
      </div>

      <div className="contact-form-box">
        <h2>Send a Message</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input name="name" type="text" placeholder="Your Name" required />
            <input name="email" type="email" placeholder="Email Address" required />
          </div>
          <input name="subject" type="text" placeholder="Subject" required />
          <textarea name="message" rows="5" placeholder="Your Message" required></textarea>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
          {formMessage.text && (
            <p className={`contact-form-message ${formMessage.type}`} role="status">
              {formMessage.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;
