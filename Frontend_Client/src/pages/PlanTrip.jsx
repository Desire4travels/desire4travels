import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PlanTrip.css';
import { Helmet } from "react-helmet";

const PlanTrip = () => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: null,
    noofdays: '',
    travelers: '',
    preference: '',
    mobileNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, startDate: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Trip planned successfully!');
        setFormData({
          destination: '',
          startDate: null,
          noofdays: '',
          travelers: '',
          preference: '',
          mobileNumber: ''
        });
      } else {
        alert('Failed to plan trip. Try again.');
      }
    } catch (error) {
      console.error('Error submitting trip:', error);
      alert('Server error. Please try later.');
    }
  };

  return (
    <div className="trip-container">
      <div className="trip-box">
        <h2>Plan Your Trip</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />

          <DatePicker
            selected={formData.startDate}
            onChange={handleDateChange}
            placeholderText="Travel Date"
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            className="custom-datepicker"
            required
          />

          <input
            type="number"
            name="noofdays"
            placeholder="Number of Days"
            value={formData.noofdays}
            onChange={handleChange}
            min="1"
            required
          />

          <input
            type="number"
            name="travelers"
            placeholder="Number of Travelers"
            value={formData.travelers}
            onChange={handleChange}
            min="1"
            required
          />

          <input
            type="tel"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            pattern="[0-9]{10}"
            required
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PlanTrip;
