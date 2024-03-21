import DarkModeToggle from "../components/darkmode";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import AdvancedModeToggle from "../components/AdvancedMode";

function Header(props) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary navbarh">
      <Container>
        <Navbar.Brand href="#home">eve-helper</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
          </Nav>
          <Nav>
            <AdvancedModeToggle setAdvancedMode={props.setAdvancedMode} advancedMode={props.advancedMode}/>
            <DarkModeToggle />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default Header;
