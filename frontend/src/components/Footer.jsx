import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="https://github.com/vasiman-17" target="_blank" rel="noopener noreferrer" className="footer-link">GITHUB</a>
          <span className="footer-sep">/</span>
          <a href="https://www.linkedin.com/in/vaibhav-vasistha-8a6803358/" target="_blank" rel="noopener noreferrer" className="footer-link">LINKEDIN</a>
          <span className="footer-sep">/</span>
          <a href="mailto:vaibhav.vasistha06@gmail.com" className="footer-link">EMAIL</a>
        </div>
        <div className="footer-copy">
          © {new Date().getFullYear()} VAIBHAV VASISTHA. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
