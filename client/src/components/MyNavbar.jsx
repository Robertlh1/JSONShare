import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import LoginModal from './LoginModal.jsx'

export default function MyNavbar(props) {
  if (props.userID === null) {
    return(
      <Navbar variant="dark" className="red" expand="lg" sticky="top">
        <Container fluid>
          <Navbar.Brand href="#">HMFS</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link style={{color: "white"}} href="#action1">Home</Nav.Link>
            <Nav.Link style={{color: "white"}} onClick={props.showLoginModal}>Login</Nav.Link>
            <Nav.Link style={{color: "white"}} onClick={props.showRegisterModal}>Register</Nav.Link>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  } else {
    return(
      <Navbar variant="dark" className="red" expand="lg" sticky="top">
        <Container fluid>
          <Navbar.Brand href="#">HMFS</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
          <Nav.Link style={{color: "white"}} href="#action1">Home</Nav.Link>
          <Nav.Link style={{color: "white"}} onClick={props.showUploadModal}>Upload File</Nav.Link>
          <Nav.Link style={{color: "white"}} onClick={props.logOut}>Logout</Nav.Link>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
}