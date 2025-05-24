import React, { useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleTripTypeChange = (e) => {
    const selectedType = e.target.value;
    if (selectedType) {
      navigate(`/triptype/${selectedType}`);
      setMenuOpen(false);
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="nav">
      <div className="nav-header">
        <div className="nav-logo">
          <Link to="/">Desire<span>4</span>Travels</Link>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div className={`nav-container ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-menu">
          <li><Link to="/" className="nav-link" onClick={handleLinkClick}>Home</Link></li>
          <li><Link to="/destination" className="nav-link" onClick={handleLinkClick}>Destinations</Link></li>
          <li className="dropdown">
            <select onChange={handleTripTypeChange} defaultValue="">
              <option value="" disabled>Type of Trip</option>
              <option value="mountain">Mountain</option>
              <option value="beach">Beach</option>
              <option value="religious">Religious</option>
              <option value="heritage">Heritage</option>
              <option value="offbeat">Offbeat</option>
              <option value="other">Other</option>
            </select>
          </li>
          <li><Link to="/package" className="nav-link" onClick={handleLinkClick}>Packages</Link></li>
          <li><Link to="/contact" className="nav-link" onClick={handleLinkClick}>Contact Us</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
