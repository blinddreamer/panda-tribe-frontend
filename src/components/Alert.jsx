import React, { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";

const ResponsiveAlert = ({ breakpointWidth, message }) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setShowAlert(window.innerWidth < breakpointWidth);
    };

    // Call handleResize initially and add event listener for window resize
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpointWidth]);

  return showAlert ? <Alert variant="danger">{message}</Alert> : null;
};

export default ResponsiveAlert;
