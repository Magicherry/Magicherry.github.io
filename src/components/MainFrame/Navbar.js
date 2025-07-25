import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { CgGitFork, CgFileDocument } from "react-icons/cg";
import {
  AiFillStar,
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
} from "react-icons/ai";
import { MdWorkOutline } from "react-icons/md";

function NavBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      const atBottom = window.innerHeight + scrollY >= document.body.offsetHeight - 10;
      setIsScrolled(scrollY >= 20);

      // 滚动向下隐藏，滚动向上显示
      if (atBottom) {
        setIsNavbarHidden(false);
      } else if (scrollY > lastScrollYRef.current && scrollY > 80) {
        setIsNavbarHidden(true);
      } else {
        setIsNavbarHidden(false);
      }
      lastScrollYRef.current = scrollY;
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeNavbar = () => setIsExpanded(false);

  return (
      <>
        <Navbar
            expanded={isExpanded}
            fixed="top"
            expand="lg"
            className={`${isScrolled ? "sticky" : "navbar"} ${isNavbarHidden ? "navbar-hidden" : ""}`}
            onToggle={setIsExpanded}
        >
          <Container>
            <Navbar.Brand as={Link} to="/" onClick={closeNavbar}>
              MAGICHERRY.
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav">
              <span />
              <span />
              <span />
            </Navbar.Toggle>
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ms-auto" defaultActiveKey="#home">
                <Nav.Item>
                  <Nav.Link as={NavLink} to="/" end onClick={closeNavbar}>
                    <AiOutlineHome className="navbar-icon" /> HOME
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={NavLink} to="/about" onClick={closeNavbar}>
                    <AiOutlineUser className="navbar-icon" /> ABOUT
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={NavLink} to="/experiences" onClick={closeNavbar}>
                    <MdWorkOutline className="navbar-icon" /> EXPERIENCES
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={NavLink} to="/project" onClick={closeNavbar}>
                    <AiOutlineFundProjectionScreen className="navbar-icon" /> PROJECTS
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={NavLink} to="/resume" onClick={closeNavbar}>
                    <CgFileDocument className="navbar-icon" /> RESUME
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="fork-btn">
                  <Button
                      href="https://github.com/Magicherry/peronsalwebsite"
                      target="_blank"
                      className="fork-btn-inner"
                  >
                    <CgGitFork className="navbar-fork-icon" />
                    <AiFillStar className="navbar-star-icon" />
                  </Button>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Bottom Tab Bar for Mobile */}
        <div className={`d-lg-none bottom-nav-container ${isNavbarHidden ? "bottom-nav-hidden" : ""}`}>
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
              <Nav.Link as={NavLink} to="/experiences" onClick={closeNavbar}>
                <MdWorkOutline />
                <span>EXPERIENCES</span>
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
