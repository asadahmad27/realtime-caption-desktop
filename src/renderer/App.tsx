import React, { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function Hello() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
      loadExternalURL();
    }, 2000); // waits 2 seconds before executing

    return () => clearTimeout(timer); // cleanup the timer
  }, []); // empty dependency array means this runs once on mount

  function loadExternalURL() {
    window.electron.ipcRenderer.sendMessage('load-external-url', {
      url: 'http://ec2-3-21-205-201.us-east-2.compute.amazonaws.com:8000/',
    });
  }

  return (
    <div>
      {showLoader ? (
        <div className="loader" /> // Show loader while showLoader is true
      ) : (
        <p>...</p>
        // <p>Error, PLease restart App. </p>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
