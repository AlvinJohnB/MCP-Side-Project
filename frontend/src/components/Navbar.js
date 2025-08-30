import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

export default function AppNavbar() {
  return (
    <Navbar
      className="mx-auto col-lg-10 border rounded"
      bg="light"
      data-bs-theme="light"
    >
      <Container>
        <Navbar.Brand href="#home" className="fw-bold text-gradient">
          BookingApp
        </Navbar.Brand>
        <Nav className="justify-content-end">
          <Nav.Link href="#home">Cart</Nav.Link>
          <Nav.Link href="#home">Manage Bookings</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
