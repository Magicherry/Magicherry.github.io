import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { CgGitFork, CgFileDocument } from "react-icons/cg";
import {
  AiFillStar,
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
} from "react-icons/ai";

function NavBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY && window.scrollY > 80) { // if scroll down hide the navbar
        setIsNavbarHidden(true);
      } else { // if scroll up show the navbar
        setIsNavbarHidden(false);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeNavbar = () => setIsExpanded(false);

  return (
    <>
      <Navbar
        expanded={isExpanded}
        fixed="top"
        expand="md"
        className={`${isScrolled ? "sticky" : "navbar"} ${isNavbarHidden ? "navbar-hidden" : ""}`}
      >
        <Container>
          <Navbar.Brand href="/" className="brand-centered">
            MAGICHERRY.
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setIsExpanded(!isExpanded)}>
            <span></span>
            <span></span>
            <span></span>
          </Navbar.Toggle>

          <Navbar.Collapse id="responsive-navbar-nav">
            {/* This part is for desktop view */}
            <Nav className="ms-auto d-none d-md-flex" defaultActiveKey="#home">
              <Nav.Item>
                <Nav.Link as={Link} to="/" onClick={closeNavbar}>
                  <AiOutlineHome className="navbar-icon" /> HOME
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/about" onClick={closeNavbar}>
                  <AiOutlineUser className="navbar-icon" /> ABOUT
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/project" onClick={closeNavbar}>
                  <AiOutlineFundProjectionScreen className="navbar-icon" /> PROJECTS
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/resume" onClick={closeNavbar}>
                  <CgFileDocument className="navbar-icon" /> RESUME
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="fork-btn">
                <Button
                  href="https://github.com/Magicherry/peronsalwebsite"
                  target="_blank"
                  className="fork-btn-inner"
                >
                  <CgGitFork className="navbar-fork-icon" />{" "}
                  <AiFillStar className="navbar-star-icon" />
                </Button>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* This part is for mobile view bottom bar */}
      <div className="d-md-none bottom-nav-container">
        <Nav className="bottom-nav">
          <Nav.Item>
            <Nav.Link as={NavLink} to="/" end onClick={closeNavbar}>
              <AiOutlineHome />
              <span>HOME</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to="/about" onClick={closeNavbar}>
              <AiOutlineUser />
              <span>ABOUT</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to="/project" onClick={closeNavbar}>
              <AiOutlineFundProjectionScreen />
              <span>PROJECTS</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to="/resume" onClick={closeNavbar}>
              <CgFileDocument />
              <span>RESUME</span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </>
  );
}

export default NavBar;
