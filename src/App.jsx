import React from "react";
import "./App.css";
import Calchome from "./components/Calchome";
import Home from "./components/Home";
import { Route, useLocation, useRouter, Link } from "wouter";
import { AnimatePresence } from "framer-motion";
import DarkModeToggle from "./components/darkmode";
import Footer from "./components/Footer";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ResponsiveAlert from "./components/Alert";

const App = () => {
  const location = useLocation();
  const router = useRouter();
  return (
    <>
      <div id="HukuBartopolos">
        <Navbar expand="lg" className="bg-body-tertiary navbarh">
          <Container>
            <Navbar.Brand>eve-helper</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/calculator">Calculator</Nav.Link>
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
            breakpointWidth={1280}
            message="Optimizing for desktop first, screen resolution too low!"
          />
        </div>

        <AnimatePresence mode={"wait"}>
          <Route key="1" path="/">
            <Home />
          </Route>
          <Route key="2" path="/calculator">
            <Calchome />
          </Route>
        </AnimatePresence>

        <Footer />
      </div>
    </>
  );
};

export default App;
