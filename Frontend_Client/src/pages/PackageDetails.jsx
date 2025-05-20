import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PackageDetails.css";
import Hotel from "../assets/Hotel.png";
import Taxi from "../assets/Taxi.png";
import Passport from "../assets/Passport.png";
import Flight from "../assets/Flight.png";

const PackageDetails = () => {
  const { packageId } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    travelers: "",
    date: "",
  });

  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/packages/${packageId}`);
        setPackageData(response.data);
      } catch (err) {
        setError("Failed to load package details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPackageDetails();
  }, [packageId]);

  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;

    const handleScroll = () => {
      if (!left || !right) return;
      const maxLeftScroll = left.scrollHeight - left.clientHeight;
      const isLeftFullyScrolled = left.scrollTop >= maxLeftScroll;

      if (isLeftFullyScrolled) {
        right.scrollTop = left.scrollTop - maxLeftScroll;
      } else {
        right.scrollTop = 0;
      }
    };

    if (left) left.addEventListener("scroll", handleScroll);
    return () => left && left.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!packageData) {
      alert("Package data not loaded. Please try again.");
      return;
    }

    try {
      const payload = {
        ...formData,
        packageName: packageData.packageName,  // Important: send packageName here
      };
      await axios.post("http://localhost:3000/api/custom-quotes", payload);
      alert("Request submitted successfully!");
      setShowQuoteForm(false);
      setFormData({ name: "", mobile: "", travelers: "", date: "" });
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit request.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error || !packageData) return <div>{error || "Package not found"}</div>;

  const {
    packageName,
    duration,
    price,
    photo,
    description,
    inclusions = "",
    itinerary = "",
    destinations = [],
  } = packageData;

  const inclusionsArray = typeof inclusions === "string"
    ? inclusions.split(";").map(i => i.trim()).filter(Boolean)
    : Array.isArray(inclusions)
      ? inclusions
      : [];

  const itineraryArray = typeof itinerary === "string"
    ? itinerary.split(";").map(i => i.trim()).filter(Boolean)
    : Array.isArray(itinerary)
      ? itinerary
      : [];

  const dayHeaderRegex = /^day\s*\d+\s*:/i;
  const days = [];
  let currentDay = null;

  itineraryArray.forEach(item => {
    if (dayHeaderRegex.test(item)) {
      if (currentDay) days.push(currentDay);
      currentDay = { dayLabel: true, fullHeading: item, activities: [] };
    } else {
      if (currentDay) {
        currentDay.activities.push(item);
      } else {
        days.push({ dayLabel: null, activities: [item] });
      }
    }
  });
  if (currentDay) days.push(currentDay);

  const DestinationsJSX = (
    <section className="package-details-section">
      <h1 className="package-title package-details-destinations-title">Destinations Covered</h1>
      <div className="package-details-destinations-grid">
        {destinations.length ? (
          destinations.map((dest, i) => (
            <div key={i} className="package-details-destination-card">
              <img src={dest.image} alt={dest.name} className="package-details-destination-image" />
              <h3>{dest.name}</h3>
              <p><strong>{dest.state} - {dest.type}</strong></p>
              <p>⭐ {dest.rating}</p>
            </div>
          ))
        ) : (
          <p>No destinations available.</p>
        )}
      </div>
    </section>
  );

  return (
    <div className="package-details-container">
      <div className="package-details-header-flex">
        <section className="package-details-section package-details-header-section">
          <h1 className="package-title">{packageName}</h1>
          <h2 className="package-subtitle">Duration: {duration}</h2>
          <h3 className="package-price">Price: ₹{price}</h3>
        </section>
      </div>

      <div className="package-details-header-flex">
        <img src={photo} alt={packageName} className="package-details-main-image" />
        <div className="package-details-icons">
          <img src={Hotel} alt="Hotel" className="package-icon" />
          <img src={Taxi} alt="Taxi" className="package-icon" />
        </div>
        <div className="package-details-icons">
          <img src={Passport} alt="Passport" className="package-icon" />
          <img src={Flight} alt="Flight" className="package-icon" />
        </div>
      </div>

      <div className="package-details-flex-wrapper">
        <div className="package-details-left" ref={leftRef}>
          <section className="package-details-section">
            <h1 className="package-title">About the Package</h1>
            <p className="package-description">{description}</p>
          </section>

          <div className="mobile-only">
            {DestinationsJSX}
          </div>

          <section className="package-details-section">
            <h1 className="package-title">Inclusions</h1>
            {inclusionsArray.length ? (
              <ul className="package-details-list">
                {inclusionsArray.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p>No inclusions available.</p>}
          </section>

          <section className="package-details-section">
            <h1 className="package-title">Itinerary</h1>
            <table className="itinerary-table">
              <tbody>
                {days.length ? (
                  days.map((day, i) => (
                    <React.Fragment key={i}>
                      {day.dayLabel && (
                        <tr className="itinerary-day-row">
                          <td colSpan="2">{day.fullHeading}</td>
                        </tr>
                      )}
                      {day.activities.map((act, j) => (
                        <tr key={`${i}-${j}`} className="itinerary-item-row">
                          <td colSpan="2">{act}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr><td colSpan="2">No itinerary available.</td></tr>
                )}
              </tbody>
            </table>
          </section>
        </div>

        <div className="package-details-right" ref={rightRef}>
          <div className="desktop-only">
            {DestinationsJSX}
          </div>
        </div>
      </div>

      <button className="request-package-button" onClick={() => setShowQuoteForm(true)}>
        Get customise quote
      </button>

      {showQuoteForm && (
        <div className="quote-popup-overlay" onClick={() => setShowQuoteForm(false)}>
          <div className="quote-popup" onClick={(e) => e.stopPropagation()}>
            <h1 className="package-title">Get Customized Quote</h1>
            <form className="quote-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="travelers"
                placeholder="Number of Travelers"
                min="1"
                value={formData.travelers}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="date"
                placeholder="Preferred Travel Date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
              <button type="submit">Submit Request</button>
            </form>
            <button onClick={() => setShowQuoteForm(false)} className="close-popup-button">X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetails;
