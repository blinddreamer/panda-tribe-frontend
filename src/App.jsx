import React from "react";
import "./App.css";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import CalculatorHome from "./components/CalculatorHome";
import Home from "./components/Homepage";
import DarkModeToggle from "./components/DarkModeToggle";
import Footer from "./components/Footer";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import ResponsiveAlert from "./components/ResponsiveAlert";
import PageNotFound from "./components/PageNotFound";
import Appraisal from "./components/Appraisal";
import Video from "./components/Video";

const App = () => {
  return (
    <>
      <Video />
      <BrowserRouter>
        <div id="HukuBartopolos">
          <Navbar expand="lg" className="bg-body-tertiary navbarh">
            <Container>
              <Navbar.Brand>eve-helper</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/">
                    Home
                  </Nav.Link>
                  <Nav.Link as={Link} to="/Calculator">
                    Calculator
                  </Nav.Link>
                  <Nav.Link as={Link} to="/Appraisal">
                    Appraisal
                  </Nav.Link>
                </Nav>
                <Nav>
                  <DarkModeToggle />
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <p></p>
          {/*<main id="swup" className="transition-main">*/}
          <div>
            <ResponsiveAlert
              breakpointWidth={1450}
              message="Optimizing for desktop first, screen resolution too low!"
            />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Calculator" element={<CalculatorHome />} />
            <Route path="/Appraisal" element={<Appraisal />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          {/*</main>*/}
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
