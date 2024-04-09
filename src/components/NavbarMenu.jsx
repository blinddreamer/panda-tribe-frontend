import React from "react";
import { Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import ResponsiveAlert from "./ResponsiveAlert";
import Video from "./Video";

function NavbarMenu() {
  return (
    <>
      <Video />
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
      <div>
        <ResponsiveAlert
          breakpointWidth={1280}
          message="Optimizing for desktop first, screen resolution too low!"
        />
      </div>
      <p></p>
    </>
  );
}

export default NavbarMenu;
