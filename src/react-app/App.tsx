// src/App.tsx

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import cloudflareLogo from "./assets/Cloudflare_Logo.svg";
import honoLogo from "./assets/hono.svg";
import "./App.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginButton } from "./components/LoginButton";
import { UserProfile } from "./components/UserProfile";
import { Footer } from "./components/Footer";

function AppContent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");
  const [version, setVersion] = useState<{
    version: string;
    commitHash: string;
    buildTime: string;
    timestamp: string;
  } | null>(null);
  
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://hono.dev/" target="_blank">
          <img src={honoLogo} className="logo cloudflare" alt="Hono logo" />
        </a>
        <a href="https://workers.cloudflare.com/" target="_blank">
          <img
            src={cloudflareLogo}
            className="logo cloudflare"
            alt="Cloudflare logo"
          />
        </a>
      </div>
      <h1>Vite + React + Hono + Cloudflare</h1>
      
      {/* OAuth Authentication Section */}
      <div className="card">
        <h2>Authentication</h2>
        {isAuthenticated ? <UserProfile /> : <LoginButton />}
      </div>
      
      <div className="card">
        <button
          onClick={() => setCount((count) => count + 1)}
          aria-label="increment"
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <button
          onClick={() => {
            fetch("/api/version")
              .then((res) => res.json() as Promise<{ name: string }>)
              .then((data) => setName(data.name));
          }}
          aria-label="get name"
        >
          Name from API is: {name}
        </button>
        <p>
          Edit <code>worker/index.ts</code> to change the name
        </p>
      </div>
      <div className="card">
        <button
          onClick={() => {
            fetch("/api/version")
              .then((res) => res.json())
              .then((data) => setVersion(data));
          }}
          aria-label="get version"
        >
          Get Version Info
        </button>
        {version && (
          <div style={{ marginTop: "10px", fontSize: "12px", textAlign: "left" }}>
            <p><strong>Version:</strong> {version.version}</p>
            <p><strong>Commit:</strong> {version.commitHash}</p>
            <p><strong>Build Time:</strong> {version.buildTime}</p>
            <p><strong>Request Time:</strong> {version.timestamp}</p>
          </div>
        )}
        <p>
          Click to get server version information
        </p>
      </div>
      <p className="read-the-docs">Click on the logos to learn more</p>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
