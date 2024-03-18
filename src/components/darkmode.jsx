import React, { useState } from "react";
import Button from "react-bootstrap/Button";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.documentElement.setAttribute(
      "data-bs-theme",
      darkMode ? "light" : "dark"
    );
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
