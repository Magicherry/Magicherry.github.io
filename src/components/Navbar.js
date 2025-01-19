import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CgGitFork, CgFileDocument } from "react-icons/cg";
import { ImBlog } from "react-icons/im";
import {
  AiFillStar,
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
} from "react-icons/ai";

function NavBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleNavbar = () => setIsExpanded((prevState) => !prevState);
  const closeNavbar = () => setIsExpanded(false);

  return (
    <Navbar
      expanded={isExpanded}
      fixed="top"
      expand="md"
      className={isScrolled ? "sticky" : "navbar"}
    >
      <Container>
        <Navbar.Brand
            href="/"
            className="d-flex"
            style={{ color: "#00aaff", marginBottom: "2px" }}
        >
          Magicherry
          <span style={{ color: "#ffffff", margin: "0 8px" }}>|</span>
          Portfolio
        </Navbar.Brand>


        <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={toggleNavbar}>
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" defaultActiveKey="#home">
            <Nav.Item>
              <Nav.Link as={Link} to="/" onClick={closeNavbar}>
                <AiOutlineHome style={{ marginBottom: "2px" }} /> Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/about" onClick={closeNavbar}>
                <AiOutlineUser style={{ marginBottom: "2px" }} /> About
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/project" onClick={closeNavbar}>
                <AiOutlineFundProjectionScreen style={{ marginBottom: "2px" }} /> Projects
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/resume" onClick={closeNavbar}>
                <CgFileDocument style={{ marginBottom: "2px" }} /> Resume
              </Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
              <Nav.Link
                href="https://soumyajitblogs.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                <ImBlog style={{ marginBottom: "2px" }} /> Blogs
              </Nav.Link>
            </Nav.Item> */}
            <Nav.Item className="fork-btn">
              <Button
                href="https://github.com/Magicherry"
                target="_blank"
                className="fork-btn-inner"
              >
                <CgGitFork style={{ fontSize: "1.2em" }} />{" "}
                <AiFillStar style={{ fontSize: "1.1em" }} />
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
