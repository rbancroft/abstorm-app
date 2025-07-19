import React from 'react';
import './Footer.css';
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import cloudflareLogo from "../assets/Cloudflare_Logo.svg";
import honoLogo from "../assets/hono.svg";

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <a 
          href="https://github.com/rbancroft/abstorm-app" 
          target="_blank" 
          rel="noopener noreferrer"
          className="github-link"
          aria-label="View source code on GitHub"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className="github-icon"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="github-text">View on GitHub</span>
        </a>
        
        <div className="footer-divider">|</div>
        
        <div className="tech-links">
          <span className="footer-info">Built with</span>
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer" className="tech-link" aria-label="Vite" title="Vite - Next Generation Frontend Tooling">
            <img src={viteLogo} className="tech-icon" alt="Vite" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="tech-link" aria-label="React" title="React - A JavaScript library for building user interfaces">
            <img src={reactLogo} className="tech-icon" alt="React" />
          </a>
          <a href="https://hono.dev/" target="_blank" rel="noopener noreferrer" className="tech-link" aria-label="Hono" title="Hono - Ultrafast web framework for the Edges">
            <img src={honoLogo} className="tech-icon" alt="Hono" />
          </a>
          <a href="https://workers.cloudflare.com/" target="_blank" rel="noopener noreferrer" className="tech-link" aria-label="Cloudflare Workers" title="Cloudflare Workers - Serverless platform for building applications">
            <img src={cloudflareLogo} className="tech-icon" alt="Cloudflare" />
          </a>
        </div>
      </div>
    </footer>
  );
};
