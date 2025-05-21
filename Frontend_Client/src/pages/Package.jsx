// import React, { useEffect, useState } from "react";
// import PackageCard from "../Components/Package/PackageCard";
// import "./Package.css";

// const Package = () => {
//   const [packages, setPackages] = useState([]);

//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         const res = await fetch("https://desire4travels-1.onrender.com/api/packages");
//         const data = await res.json();
//         setPackages(data);
//       } catch (error) {
//         console.error("Error fetching packages:", error);
//       }
//     };
//     fetchPackages();
//   }, []);

//   return (
//     <div className="package-container">
//       <div className="package-list">
//         <h1>Our Packages</h1>
//         <div className="package-grid">
//           {packages.length > 0 ? (
//             packages.map((pkg) => (
//               <PackageCard
//                 key={pkg.id}
//                 id={pkg.id}
//                 imgSrc={pkg.photo}
//                 packageName={pkg.packageName}
//                 destinations={pkg.destinations}
//                 price={pkg.price}
//                 duration={pkg.duration}
//               />
//             ))
//           ) : (
//             <p>No packages available.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Package;


import React, { useEffect, useState } from "react";
import PackageCard from "../Components/Package/PackageCard";
import "./Package.css";
import { Helmet } from "react-helmet";

const Package = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("https://desire4travels-1.onrender.com/api/packages");
        const data = await res.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="package-container">
      <Helmet>
        <title>Explore Travel Packages | Best Deals & Destinations</title>
        <meta
          name="description"
          content="Discover our curated travel packages with top destinations, affordable prices, and unforgettable experiences."
        />
        <meta
          name="keywords"
          content="travel packages, holiday deals, affordable travel, best destinations, tour packages"
        />
        <meta name="author" content="Your Company Name" />
        <meta property="og:title" content="Explore Travel Packages | Best Deals & Destinations" />
        <meta
          property="og:description"
          content="Discover our curated travel packages with top destinations, affordable prices, and unforgettable experiences."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="package-list">
        <h1>Our Packages</h1>
        <div className="package-grid">
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                id={pkg.id}
                imgSrc={pkg.photo}
                packageName={pkg.packageName}
                destinations={pkg.destinations}
                price={pkg.price}
                duration={pkg.duration}
              />
            ))
          ) : (
            <p>No packages available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Package;
