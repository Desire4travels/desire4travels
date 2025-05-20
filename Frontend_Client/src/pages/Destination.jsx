import React, { useEffect, useState } from 'react';
import './Destination.css';
import DestinationCard from '../Components/Destination/DestinationCard';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";

const Destination = () => {
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/destinations')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        console.log("Fetched destinations:", data);
        setDestinations(data.destinations);
      })
      .catch(err => {
        console.error('Failed to fetch destinations:', err);
      });
  }, []);

  return (
    <div className="destination-page">
      <Helmet>
        <title>Destinations | Desire4Travels</title>
        <meta name="description" content="Explore a wide variety of travel destinations across states and types." />
        <meta name="keywords" content="travel, destinations, tourism, holiday, vacation" />
        <meta name="author" content="Your Company Name" />
        <meta property="og:title" content="Destinations - Travel Packages" />
        <meta property="og:description" content="Explore a wide variety of travel destinations across states and types." />
      </Helmet>

      <h1>Destinations</h1>
      <div className="cards-container">
        {destinations.length > 0 ? (
          destinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              imgSrc={`http://localhost:3000/uploads/${dest.image}`}
              title={`${dest.name}-${dest.state}`} // this is important!
              location={dest.state}
              tripType={dest.type}  // type is an array
              rating={parseFloat(dest.rating || 0).toFixed(1)}
              onClick={() => navigate(`/destination/${dest.id}`, { state: { destinationName: dest.name } })}
            />
          ))
        ) : (
          <p>No destinations available.</p>
        )}
      </div>
    </div>
  );
};

export default Destination;
