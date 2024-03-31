import React from "react";
import "./App.css";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import { RouterProvider } from "./components/RouterContext";
import Calchome from "./components/Calculator_Home";
import Home from "./components/Home";
import DarkModeToggle from "./components/darkmode";
import Footer from "./components/Footer";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import ResponsiveAlert from "./components/Alert";
import PageNotFound from "./components/404";
import Appraisal from "./components/Appraisal";
import Video from "./components/video";

const App = () => {
  return (
    <>
      <Video />
      <BrowserRouter>
        <RouterProvider>
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
            <main id="swup" className="transition-main">
              <div>
                <ResponsiveAlert
                  breakpointWidth={1450}
                  message="Optimizing for desktop first, screen resolution too low!"
                />
              </div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Calculator" element={<Calchome />} />
                <Route path="/Appraisal" element={<Appraisal />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </RouterProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
