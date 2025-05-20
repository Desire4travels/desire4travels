import React, { useEffect, useState } from 'react';
import './TopDestination.css';
import DestinationCard from '../Components/Destination/DestinationCard';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from "react-helmet";


const TopDestination = () => {
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/destinations?limit=4&random=true')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setDestinations(data.destinations || []);
      })
      .catch(err => {
        console.error('Failed to fetch destinations:', err);
      });
  }, []);

  return (
    <div className="topdestination-section">
      <h2 className="topdestination-heading">Top Destinations</h2>
      <div className="topdestination-grid">
        {destinations.length > 0 ? (
          destinations.map(dest => (
            <DestinationCard
              key={dest.id}
              imgSrc={`http://localhost:3000/uploads/${dest.image}`}
              title={`${dest.name} - ${dest.state}`}
              location={dest.state}
              tripType={dest.type}
              rating={parseFloat(dest.rating || 0).toFixed(1)}
              onClick={() =>
                navigate(`/destination/${dest.id}`, {
                  state: { destinationName: dest.name },
                })
              }
            />
          ))
        ) : (
          <p>No destinations available.</p>
        )}
      </div>
      <div className="topdestination-link">
        <Link to="/destination">See all →</Link>
      </div>
    </div>
  );
};

export default TopDestination;
