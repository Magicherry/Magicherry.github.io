import React, { useState, useEffect, useRef, useCallback } from "react";
import { Navbar, Nav, Container, Modal } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
  AiFillGithub,
  AiOutlineFileText,
  AiOutlineDownload,
  AiFillStar
} from "react-icons/ai";
import { MdWorkOutline } from "react-icons/md";
import { FiSidebar, FiMapPin, FiMail, FiPhone } from "react-icons/fi";
import { FaLinkedinIn, FaWeixin } from "react-icons/fa";
import { SiBilibili } from "react-icons/si";
import Tilt from "react-parallax-tilt";
import avatarImg from "../../Assets/avatar/avatar.png";
import wechatQrCode from "../../Assets/about/social/Wechat.jpg";
import cvFile from "../../Assets/cv/Yuting_Zhou_CV.pdf";

const NAV_ITEMS = [
  { path: "/", icon: AiOutlineHome, label: "Home" },
  { path: "/about", icon: AiOutlineUser, label: "About" },
  { path: "/experiences", icon: MdWorkOutline, label: "Tracks" },
  { path: "/project", icon: AiOutlineFundProjectionScreen, label: "Projects" },
  { path: "/resume", icon: AiOutlineFileText, label: "Resume" }
];

const BOTTOM_NAV_ITEMS = NAV_ITEMS;

function useNavMode() {
  const getInitial = () => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage ? window.localStorage.getItem("navMode") : null;
    if (stored === "side" && window.innerWidth >= 992) return true;
    if (stored === "top") return false;
    return window.innerWidth >= 992;
  };

  const [isSideNavVisible, setIsSideNavVisible] = useState(getInitial);

  // Persist
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("navMode", isSideNavVisible ? "side" : "top");
    }
  }, [isSideNavVisible]);

  // Auto-disable on small screens
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      if (window.innerWidth < 992 && isSideNavVisible) {
        setIsSideNavVisible(false);
        if (window.localStorage) {
          window.localStorage.setItem("navMode", "top");
        }
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [isSideNavVisible]);

  const toggleSideNav = useCallback(() => {
    setIsSideNavVisible((prev) => {
      const next = !prev;
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("navMode", next ? "side" : "top");
      }
      return next;
    });
  }, []);

  return { isSideNavVisible, toggleSideNav, setIsSideNavVisible };
}

function useScrollHideNav({ isExpanded, setIsExpanded }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTopNavHidden, setIsTopNavHidden] = useState(false);
  const [isBottomNavHidden, setIsBottomNavHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const atBottom = window.innerHeight + scrollY >= document.body.offsetHeight - 10;
      const isMobile = window.innerWidth < 992;
      setIsScrolled(scrollY >= 20);

      if (isExpanded) {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => setIsExpanded(false), 0);
      }

      const isScrollingDown = scrollY > lastScrollYRef.current;
      if (isMobile) {
        setIsTopNavHidden(isScrollingDown && scrollY > 80);
      } else {
        setIsTopNavHidden(false);
      }

      if (atBottom) {
        setIsBottomNavHidden(false);
      } else if (isScrollingDown && scrollY > 80) {
        setIsBottomNavHidden(false); // Changed to false to keep it always visible
      } else {
        setIsBottomNavHidden(false);
      }

      lastScrollYRef.current = scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [isExpanded, setIsExpanded]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isBottomNavHidden) {
      document.body.classList.add("bottom-nav-is-hidden");
    } else {
      document.body.classList.remove("bottom-nav-is-hidden");
    }
  }, [isBottomNavHidden]);

  return { isScrolled, isTopNavHidden, isBottomNavHidden };
}

function NavLinks({ items = NAV_ITEMS, linkClassName, iconClassName, onClick, navItemClassName, navLinkProps = {}, hideIcon = false }) {
  return items.map((item) => {
    const IconComponent = item.icon;
    return (
      <Nav.Item key={item.path} className={navItemClassName}>
        <Nav.Link
          as={NavLink}
          to={item.path}
          end={item.path === "/"}
          onClick={onClick}
          className={linkClassName}
          {...navLinkProps}
        >
          {!hideIcon && <IconComponent className={iconClassName} />}
          <span>{item.label}</span>
        </Nav.Link>
      </Nav.Item>
    );
  });
}

function NavBar({ triggerPreloader }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isSideNavVisible, toggleSideNav } = useNavMode();
  const { isScrolled, isTopNavHidden, isBottomNavHidden } = useScrollHideNav({ isExpanded, setIsExpanded });
  const [showWechatModal, setShowWechatModal] = useState(false);
  
  // Pill position state
  const location = useLocation();
  const navigate = useNavigate();
  const [pillPosition, setPillPosition] = useState(0);
  const [isPillVisible, setIsPillVisible] = useState(true);
  const navContainerRef = useRef(null);
  const pillRef = useRef(null);
  const navbarRef = useRef(null);
  
  // Calculate the pill position
  const calculatePillPosition = useCallback(() => {
    const currentIndex = BOTTOM_NAV_ITEMS.findIndex(item =>
      item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
    );
    if (currentIndex !== -1 && navContainerRef.current) {
      // Use clientWidth to exclude borders for accurate center positioning
      // Account for the 6px padding on each side of the wrapper
      const padding = 6;
      const containerWidth = navContainerRef.current.clientWidth - (padding * 2);
      const itemWidth = containerWidth / BOTTOM_NAV_ITEMS.length;
      const newPosition = padding + (currentIndex * itemWidth) + (itemWidth / 2);
      setPillPosition(newPosition);
      setIsPillVisible(true);
    } else {
      setIsPillVisible(false);
    }
  }, [location.pathname]);

  // Update the pill position based on the route
  useEffect(() => {
    calculatePillPosition();
  }, [calculatePillPosition, location.pathname]);

  // Watch window size and keep the pill aligned
  useEffect(() => {
    const handleResize = () => {
      // Use a timeout so the DOM finishes updating
      setTimeout(calculatePillPosition, 10);
    };

    window.addEventListener('resize', handleResize);
    // Track orientation changes on mobile
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [calculatePillPosition]);

  // Use ResizeObserver for precise container sizing
  useEffect(() => {
    if (!navContainerRef.current) return;

    let resizeTimeout;
    const resizeObserver = new ResizeObserver((entries) => {
      // Debounce to avoid frequent updates
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        calculatePillPosition();
      }, 100);
    });

    resizeObserver.observe(navContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, [calculatePillPosition]);


  useEffect(() => {
    if (isSideNavVisible) {
      document.body.classList.add("side-nav-open");
    } else {
      document.body.classList.remove("side-nav-open");
    }
  }, [isSideNavVisible]);

  useEffect(() => {
    if (!showWechatModal) return;
    const handleScroll = () => setShowWechatModal(false);
    window.addEventListener("wheel", handleScroll);
    window.addEventListener("touchmove", handleScroll);
    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [showWechatModal]);

  const closeNavbar = () => setIsExpanded(false);

  const handleToggleSideNav = () => {
    toggleSideNav();
    closeNavbar();
  };

  const openWechatModal = (event) => {
    event.preventDefault();
    setShowWechatModal(true);
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target) && isExpanded) {
        closeNavbar();
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isExpanded]);

  return (
      <>
        <div className="navbar-vignette-mask d-none d-lg-block" />
        <Navbar
            ref={navbarRef}
            expanded={isExpanded}
            fixed="top"
            expand="lg"
            className={`top-navbar-wrapper ${isTopNavHidden ? "navbar-hidden" : ""} ${isScrolled ? "navbar-scrolled" : ""} ${isSideNavVisible ? "navbar-floating-mode" : ""}`}
            onToggle={setIsExpanded}
        >
          <Container className="d-flex align-items-center justify-content-between navbar-top-inner">
            
            {/* Left Column: Brand */}
            <div className="navbar-brand-col">
              <span className="navbar-brand-text" onClick={() => { navigate("/"); if (triggerPreloader) { triggerPreloader(); } }}>
                YUTING ZHOU.
              </span>
            </div>

            {/* Center Column: Pill Navigation Container */}
            <div className="navbar-center-pill">
              <button
                type="button"
                className={`sidebar-toggle-icon ${isSideNavVisible ? "active" : ""}`}
                onClick={handleToggleSideNav}
                aria-label="Toggle Sidebar"
              >
                <FiSidebar />
              </button>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" className="d-lg-none" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mx-auto" defaultActiveKey="#home">
                  <NavLinks
                    linkClassName=""
                    iconClassName="navbar-icon"
                    onClick={closeNavbar}
                    hideIcon={true}
                  />
                </Nav>
              </Navbar.Collapse>
            </div>

            {/* Right Column: GitHub */}
            <div className="navbar-right-col">
              <a
                href="https://github.com/Magicherry/Bits-of-Me"
                target="_blank"
                rel="noopener noreferrer"
                className="github-pill-btn"
                aria-label="GitHub Repository"
              >
                <AiFillStar className="star-icon" />
                <div className="divider" />
                <AiFillGithub className="github-icon" />
              </a>
            </div>
            
          </Container>
        </Navbar>

        <div className={`floating-nav-container ${isSideNavVisible ? "show" : ""}`}>
          <div className="floating-nav-panel">
            <div className="floating-nav-header">
              <span className="floating-nav-brand" onClick={() => { navigate("/"); if (triggerPreloader) { triggerPreloader(); } }}>
                BITS of ME.
              </span>
              <button type="button" className="floating-nav-close" onClick={toggleSideNav} aria-label="Collapse to top navigation">
                <FiSidebar />
              </button>
            </div>

            <div className="floating-nav-profile">
              <div className="floating-nav-avatar-wrapper">
                <Tilt>
                <img
                  src={avatarImg}
                  alt="Yuting Zhou avatar"
                  className="floating-nav-avatar"
                  loading="lazy"
                  decoding="async"
                />
                </Tilt>
              </div>

              <div className="floating-nav-name">Yuting Zhou</div>
              <div className="floating-nav-title">M.S. in Computer Science</div>
              <div className="floating-nav-actions">
                <a
                  className="floating-nav-icon-btn"
                  href="https://github.com/Magicherry"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <AiFillGithub />
                </a>
                <a
                  className="floating-nav-icon-btn"
                  href="https://www.linkedin.com/in/yuting-zhou-5140ba299/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  className="floating-nav-icon-btn"
                  href="#wechat"
                  aria-label="WeChat"
                  onClick={openWechatModal}
                >
                  <FaWeixin />
                </a>
                <a
                  className="floating-nav-icon-btn"
                  href="https://space.bilibili.com/155876727"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Bilibili"
                >
                  <SiBilibili />
                </a>
              </div>
            </div>

            <div className="floating-nav-divider" />

            <Nav className="floating-nav-list">
              <NavLinks
                linkClassName="floating-nav-link"
                onClick={closeNavbar}
              />
            </Nav>

            <div className="floating-nav-divider" />

            <div className="floating-nav-bottom">
              <div className="floating-nav-contact-group">
                <a
                  className="floating-nav-contact-item"
                  href="https://www.google.com/maps/search/?api=1&query=Rutgers%20University%E2%80%93New%20Brunswick"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiMapPin />
                  <span>Rutgers University, NJ, USA</span>
                </a>
                <a className="floating-nav-contact-item" href="mailto:zyt680129@gmail.com">
                  <FiMail />
                  <span>zyt680129@gmail.com</span>
                </a>
                <a className="floating-nav-contact-item" href="tel:+18482309757">
                  <FiPhone />
                  <span>+1 (848) 230-9757</span>
                </a>
              </div>

              <div className="floating-nav-footer">
                <a
                  href={cvFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="floating-nav-ghost-btn"
                >
                  <AiOutlineDownload />
                  <span>Download CV</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Bar for Mobile */}
        <div className={`d-lg-none bottom-nav-container ${isBottomNavHidden ? "bottom-nav-hidden" : ""}`}>
          {/* Main navigation buttons with rounded rectangle background */}
          <div className="main-nav-wrapper" ref={navContainerRef}>
            {/* Pill slider */}
            {/* Position and opacity are dynamic (route/container); see style.css header for rationale */}
            <div
              className="draggable-pill"
              style={{
                left: `${pillPosition}px`,
                transform: 'translateX(-50%)',
                opacity: isPillVisible ? 1 : 0
              }}
              ref={pillRef}
            />
            
            <Nav className="main-nav">
              <NavLinks
                items={BOTTOM_NAV_ITEMS}
                linkClassName="main-nav-link"
                onClick={closeNavbar}
              />
            </Nav>
          </div>
        </div>

        <Modal show={showWechatModal} onHide={() => setShowWechatModal(false)} centered>
          <Modal.Body className="modal-body-center" onClick={() => setShowWechatModal(false)}>
            <img
              src={wechatQrCode}
              alt="WeChat QR Code"
              className="img-max-full"
              loading="lazy"
              decoding="async"
            />
          </Modal.Body>
        </Modal>
      </>
  );
}

export default NavBar;
