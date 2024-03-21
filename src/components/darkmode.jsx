import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-bs-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div>
      <Button variant="secondary" onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </Button>
    </div>
  );
};

export default DarkModeToggle;
