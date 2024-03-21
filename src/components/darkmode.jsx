import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

const DarkModeToggle = (props) => {
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
      <Button variant="secondary" onClick={() => props.setAdvancedMode(!props.advancedMode)}> {props.advancedMode ? "Basic Mode" : "Advanced Mode"}</Button>
    </div>
  );
};

export default DarkModeToggle;
