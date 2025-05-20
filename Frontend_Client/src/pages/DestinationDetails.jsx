import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import PackageCard from "../Components/Package/PackageCard";
import "./DestinationDetails.css";

const DestinationDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const rawDestinationName = location.state?.destinationName || "";

  const normalizeDestination = (dest) => {
    if (!dest) return "";
    const parts = dest.split("-").map((p) => p.trim());
    while (
      parts.length > 1 &&
      parts[parts.length - 1].toLowerCase() ===
        parts[parts.length - 2].toLowerCase()
    ) {
      parts.pop();
    }
    return parts.join(" - ");
  };

  const stripState = (dest) => {
    if (!dest) return "";
    return dest.split("-")[0].trim();
  };

  const destinationName = stripState(normalizeDestination(rawDestinationName));

  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(null);

  const [destinationInfo, setDestinationInfo] = useState(null);
  const [destInfoError, setDestInfoError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setError(null);

        const res = await fetch(`http://localhost:3000/api/packages`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const allPackages = await res.json();

        const cleanedDestinationName = normalizeDestination(rawDestinationName).toLowerCase();

        const filtered = allPackages.filter((pkg) => {
          if (!Array.isArray(pkg.destinations)) return false;

          return pkg.destinations.some(
            (dest) =>
              normalizeDestination(dest).toLowerCase() === cleanedDestinationName
          );
        });

        setPackages(filtered);
      } catch (error) {
        setError("Failed to load packages. Please try again later.");
      }
    };

    fetchPackages();
  }, [rawDestinationName]);

  useEffect(() => {
    const fetchDestinationInfo = async () => {
      try {
        setDestInfoError(null);

        const res = await fetch(`http://localhost:3000/api/admin/destinations`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const destinations = await res.json();

        const match = destinations.find((dest) => {
          if (!dest.name) return false;
          const normalizedDestName = normalizeDestination(dest.name).toLowerCase();
          return normalizedDestName === destinationName.toLowerCase();
        });

        if (match) {
          setDestinationInfo(match);
        } else {
          setDestinationInfo(null);
          setDestInfoError("No details found for this destination.");
        }
      } catch (error) {
        setDestInfoError("Failed to load destination details.");
      }
    };

    fetchDestinationInfo();
  }, [destinationName]);

  return (
    <div className="destination-detail-page">
      {destInfoError && <p className="error">{destInfoError}</p>}
      {destinationInfo && (
        <div className="destination-info">
          <img
            src={`http://localhost:3000/uploads/${destinationInfo.image}`}
            alt={destinationInfo.name}
            className="destination-image destination-image-desktop"
            style={{ height: '300px'}}
          />
          <div className="destination-description">
            <h1>{destinationInfo.name}</h1>
            <p>{destinationInfo.description || "No description available."}</p>
          </div>
        </div>
      )}

      <h2 className="packages-heading">Packages for {destinationName}</h2>

      {error && <p className="error">{error}</p>}

      <div className="package-grid">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              id={pkg.id}
              imgSrc={pkg.photo}
              packageName={pkg.packageName}
              destinations={pkg.destinations.map(stripState)} 
              price={pkg.price}
              duration={pkg.duration}
            />
          ))
        ) : (
          !error && <p>No packages found for this destination.</p>
        )}
      </div>
    </div>
  );
};

export default DestinationDetail;
