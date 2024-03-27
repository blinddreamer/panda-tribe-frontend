import DarkModeToggle from "../components/darkmode";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, Route, Switch } from "wouter";

function Header() {
  return (
    <>
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
    </>
  );
}
export default Header;
