import { NavLink } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";

export default function AppNavbar() {
  return (
    <Navbar
      className="mx-auto col-lg-10 border rounded"
      bg="light"
      data-bs-theme="light"
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold text-gradient">
          BookingApp
        </Navbar.Brand>
        <Nav className="justify-content-end">
          {/* <Nav.Link as={NavLink} to="/cart">
            Cart
          </Nav.Link> */}
          <Nav.Link as={NavLink} to="/manage-bookings">
            Manage Bookings
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
