import React, { useState } from 'react';
import axios from 'axios';
import {
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaFacebook,
  FaInstagram,
  FaTwitter
} from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('sending');

    try {
      await axios.post('/api/send-email', formData);
      setFormData({ name: '', email: '', mobile: '', message: '' });
      setSubmissionStatus('success');
      setTimeout(() => setSubmissionStatus(null), 5000);
    } catch (error) {
      setSubmissionStatus('error');
      setTimeout(() => setSubmissionStatus(null), 5000);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Desire4Travels</h1>
        <p>We're here to help you plan your perfect trip!</p>
      </div>

      <div className="contact-content">
        {/* Form Section */}
        <div className="contact-form-section">
          <h2><FaEnvelope /> Send Us a Message</h2>
          <div className="Form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Your Mobile Number"
                  pattern="[0-9]{10,15}"
                  title="Please enter a valid mobile number"
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows="5"
                  required
                ></textarea>
              </div>
              <button type="submit" disabled={submissionStatus === 'sending'}>
                {submissionStatus === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
              {submissionStatus === 'success' && (
                <div className="alert success">Message sent successfully!</div>
              )}
              {submissionStatus === 'error' && (
                <div className="alert error">Failed to send message. Please try again.</div>
              )}
            </form>
          </div>
        </div>

        {/* Info Section */}
        <div className="contact-info-section">
          <div className="contact-method-box">
            <div className="contact-method">
              <div>
                <FaWhatsapp className="icon whatsapp-icon" />
                <h3>WhatsApp</h3>
                <a href="https://wa.me/+917977022583" target="_blank" rel="noopener noreferrer">Chat Now</a>
                <p>+91 7977022583</p>
              </div>

              <div>
                <FaPhone className="icon" />
                <h3>Call Us</h3>
                <p>+91 7977022583</p>
                <p>+91 7409030585</p>
              </div>

              <div>
                <FaMapMarkerAlt className="icon" />
                <h3>Our Location</h3>
                <p className="location-text">
                  Desire4Travels A-84/B,<br />
                  Street No. 9 New Ashok Nagar<br />
                  New Delhi – 110096<br />
                  India
                </p>
              </div>
            </div>
          </div>

          <div className="social-media">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com/desire4travels" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://instagram.com/desire4travels" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://twitter.com/desire4travels" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
