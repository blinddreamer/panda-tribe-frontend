import React from "react";
import "./App.css";
import Calchome from "./components/Calculator_Home";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DarkModeToggle from "./components/darkmode";
import Footer from "./components/Footer";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ResponsiveAlert from "./components/Alert";
import PageNotFound from "./components/404";
import Appraisal from "./components/Appraisal";

const App = () => {
  return (
    <>
      <main id="swup" className="transition-main">
        <div id="HukuBartopolos">
          <Navbar expand="lg" className="bg-body-tertiary navbarh">
            <Container>
              <Navbar.Brand>eve-helper</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="/">Home</Nav.Link>
                  <Nav.Link href="/calculator">Calculator</Nav.Link>
                  <Nav.Link href="/Appraisal">Appraisal</Nav.Link>
                </Nav>
                <Nav>
                  <DarkModeToggle />
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <p />

          <div>
            <ResponsiveAlert
              breakpointWidth={1450}
              message="Optimizing for desktop first, screen resolution too low!"
            />
          </div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calculator" element={<Calchome />} />
              <Route path="/Appraisal" element={<Appraisal />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>

          <Footer />
        </div>
      </main>
    </>
  );
};

export default App;
