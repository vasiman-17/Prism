import React from 'react';
import './Navbar.css';

export default function Navbar({ onHome }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo" onClick={onHome} data-cursor="pointer" style={{ cursor: 'pointer' }}>
          <span className="logo-pr">PR</span>
          <span className="logo-ism">ism</span>
          <div className="logo-dot"></div>
        </div>
      </div>
      <div className="navbar-right">
        <div className="system-status">
          <div className="status-dot"></div>
          <span>SYSTEM: ONLINE</span>
        </div>
      </div>
    </nav>
  );
}
