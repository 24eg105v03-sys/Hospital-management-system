import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav class="landing-navbar">
      <Link to="/" className="brand-logo">
        <div className="brand-icon">
          <i className="fa-solid fa-hospital"></i>
        </div>
        CarePulse HMS
      </Link>
      <ul className="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#stats">Departments</a></li>
        <li><a href="#about">About</a></li>
        <li>
          <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
        </li>
        <li>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </li>
      </ul>
    </nav>
  );
}
