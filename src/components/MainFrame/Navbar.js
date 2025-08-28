import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { CgFileDocument } from "react-icons/cg";
import {
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
} from "react-icons/ai";
import { MdWorkOutline } from "react-icons/md";

function NavBar({ triggerPreloader }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTopNavHidden, setIsTopNavHidden] = useState(false);
  const [isBottomNavHidden, setIsBottomNavHidden] = useState(false);
  const lastScrollYRef = useRef(window.scrollY);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      const atBottom = window.innerHeight + scrollY >= document.body.offsetHeight - 10;
      setIsScrolled(scrollY >= 20);

      // 滚动时自动关闭展开的汉堡菜单
      if (isExpanded) {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          setIsExpanded(false);
        }, 0);
      }

      // 顶部navbar隐藏逻辑
      const isScrollingDown = scrollY > lastScrollYRef.current;
      if (isScrollingDown && scrollY > 80) {
        setIsTopNavHidden(false);
      } else {
        setIsTopNavHidden(false);
      }

      // 底部Tab栏隐藏逻辑
      if (atBottom) {
        setIsBottomNavHidden(false);
      } else if (isScrollingDown && scrollY > 80) {
        setIsBottomNavHidden(true);
      } else {
        setIsBottomNavHidden(false);
      }

      lastScrollYRef.current = scrollY;
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (isBottomNavHidden) {
      document.body.classList.add("bottom-nav-is-hidden");
    } else {
      document.body.classList.remove("bottom-nav-is-hidden");
    }
  }, [isBottomNavHidden]);

  const closeNavbar = () => setIsExpanded(false);

  return (
      <>
        <Navbar
            expanded={isExpanded}
            fixed="top"
            expand="lg"
            className={`${isTopNavHidden ? "navbar-hidden" : ""} ${isScrolled ? "navbar-scrolled" : ""}`}
            onToggle={setIsExpanded}
        >
          <Container className="custom-navbar-container">
            <Navbar.Brand as={Link} to="/" onClick={() => { closeNavbar(); triggerPreloader(); }}>
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
                    <MdWorkOutline className="navbar-icon" /> TRACKS
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={NavLink} to="/project" onClick={closeNavbar}>
                    <AiOutlineFundProjectionScreen className="navbar-icon" /> PROJECTS
                  </Nav.Link>
                </Nav.Item>
                {/* <Nav.Item>
                  <Nav.Link as={NavLink} to="/resume" onClick={closeNavbar}>
                    <CgFileDocument className="navbar-icon" /> RESUME
                  </Nav.Link>
                </Nav.Item> */}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Bottom Tab Bar for Mobile */}
        <div className={`d-lg-none bottom-nav-container ${isBottomNavHidden ? "bottom-nav-hidden" : ""}`}>
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
                <span>TRACKS</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to="/project" onClick={closeNavbar}>
                <AiOutlineFundProjectionScreen />
                <span>PROJECTS</span>
              </Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
              <Nav.Link as={NavLink} to="/resume" onClick={closeNavbar}>
                <CgFileDocument />
                <span>RESUME</span>
              </Nav.Link>
            </Nav.Item> */}
          </Nav>
        </div>
      </>
  );
}

export default NavBar;
