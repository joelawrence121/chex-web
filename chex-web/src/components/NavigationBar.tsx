import React from "react";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";

function NavigationBar() {

    return (
        <Navbar collapseOnSelect expand="lg" variant="dark">
            <Container>
                <Navbar.Brand href="/">Chexplanations</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav>
                        <Nav.Link href="/multiplayer">Multiplayer</Nav.Link>
                        <Nav.Link href="/commentary">Commentary</Nav.Link>
                        <Nav.Link href="/openings">Openings</Nav.Link>
                        <Nav.Link href="/puzzles">Puzzles</Nav.Link>
                        <Nav.Link href="/mate">Mate in N</Nav.Link>
                        <Nav.Link href="/about">About</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;