import React, { useState, useEffect, useRef, useCallback } from "react";
import { Navbar, Nav, Container, Modal } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineCode,
  AiFillGithub,
  AiOutlineFileText,
  AiOutlineDownload,
  AiFillStar
} from "react-icons/ai";
import { MdWorkOutline, MdDarkMode, MdLightMode } from "react-icons/md";
import { FiSidebar, FiMapPin, FiMail, FiPhone } from "react-icons/fi";
import { FaLinkedinIn, FaWeixin } from "react-icons/fa";
import { SiBilibili } from "react-icons/si";
import Tilt from "react-parallax-tilt";
import avatarImg from "../../Assets/avatar/avatar.png";
import wechatQrCode from "../../Assets/about/social/Wechat.jpg";
import cvFile from "../../Assets/cv/Yuting_Zhou_CV.pdf";
import cvFileZh from "../../Assets/cv/Yuting_Zhou_CV_zh.pdf";
import { useLanguage } from "../../context/LanguageContext";
import { useCloseOnWindowScroll } from "../../hooks/useCloseOnWindowScroll";

const NAV_ITEMS = {
  en: [
    { path: "/", icon: AiOutlineHome, label: "Home" },
    { path: "/about", icon: AiOutlineCode, label: "Stacks" },
    { path: "/experiences", icon: MdWorkOutline, label: "Tracks" },
    { path: "/project", icon: AiOutlineFundProjectionScreen, label: "Projects" },
    { path: "/resume", icon: AiOutlineFileText, label: "Resume" }
  ],
  zh: [
    { path: "/", icon: AiOutlineHome, label: "首页" },
    { path: "/about", icon: AiOutlineCode, label: "技术栈" },
    { path: "/experiences", icon: MdWorkOutline, label: "经历" },
    { path: "/project", icon: AiOutlineFundProjectionScreen, label: "项目" },
    { path: "/resume", icon: AiOutlineFileText, label: "简历" }
  ]
};

function useNavMode() {
  const getInitial = () => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage ? window.localStorage.getItem("navMode") : null;
    if (stored === "side" && window.innerWidth >= 992) return true;
    if (stored === "top") return false;
    return false;
  };

  const [isSideNavVisible, setIsSideNavVisible] = useState(getInitial);

  // Persist
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("navMode", isSideNavVisible ? "side" : "top");
    }
  }, [isSideNavVisible]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 991.98px)");
    const handleBreakpointChange = (event) => {
      if (event.matches) {
        setIsSideNavVisible(false);
        if (window.localStorage) {
          window.localStorage.setItem("navMode", "top");
        }
      }
    };

    handleBreakpointChange(mediaQuery);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleBreakpointChange);
      return () => mediaQuery.removeEventListener("change", handleBreakpointChange);
    }

    mediaQuery.addListener(handleBreakpointChange);
    return () => mediaQuery.removeListener(handleBreakpointChange);
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
  const isExpandedRef = useRef(isExpanded);
  const isScrolledRef = useRef(false);

  useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let rafId = null;

    const updateOnScroll = () => {
      rafId = null;

      const nextIsScrolled = window.scrollY >= 20;

      if (isScrolledRef.current !== nextIsScrolled) {
        isScrolledRef.current = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      }

      if (isExpandedRef.current) {
        setIsExpanded(false);
      }
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateOnScroll);
      }
    };

    updateOnScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [setIsExpanded]);

  return { isScrolled, isTopNavHidden: false, isBottomNavHidden: false };
}

function NavLinks({ items, linkClassName, iconClassName, onClick, navItemClassName, navLinkProps = {}, hideIcon = false }) {
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

function NavBar({ triggerPreloader, theme, toggleTheme }) {
  const { locale, toggleLocale } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const { isSideNavVisible, toggleSideNav } = useNavMode();
  const { isScrolled, isTopNavHidden, isBottomNavHidden } = useScrollHideNav({ isExpanded, setIsExpanded });
  const [showWechatModal, setShowWechatModal] = useState(false);
  const navItems = NAV_ITEMS[locale];
  const copy = locale === "zh" ? {
    displayName: "周昱廷",
    brandName: "YUTING ZHOU",
    toggleSidebar: "切换侧边导航",
    toggleTheme: "切换主题",
    collapseToTopNav: "收起为顶部导航",
    masterTitle: "罗格斯大学 · 计算机科学硕士",
    location: "美国新泽西州罗格斯大学",
    downloadCv: "下载简历",
    githubRepository: "GitHub 仓库",
    avatarAlt: "周钰婷头像",
    wechatQrAlt: "微信二维码",
    languageToggle: "切换语言",
    languageMode: "当前语言",
    email: "zyt680129@163.com",
    phone: "+86 13681756546"
  } : {
    displayName: "Yuting Zhou",
    brandName: "YUTING ZHOU",
    toggleSidebar: "Toggle sidebar",
    toggleTheme: "Toggle theme",
    collapseToTopNav: "Collapse to top navigation",
    masterTitle: "M.S. in Computer Science",
    location: "Rutgers University, NJ, USA",
    downloadCv: "Download CV",
    githubRepository: "GitHub Repository",
    avatarAlt: "Yuting Zhou avatar",
    wechatQrAlt: "WeChat QR Code",
    languageToggle: "Toggle language",
    languageMode: "Current language",
    email: "zyt680129@gmail.com",
    phone: "+1 (848) 230-9757"
  };
  const activeCvFile = locale === "zh" ? cvFileZh : cvFile;
  
  // Pill position state
  const location = useLocation();
  const navigate = useNavigate();
  const [pillPosition, setPillPosition] = useState(0);
  const [isPillVisible, setIsPillVisible] = useState(true);
  const navContainerRef = useRef(null);
  const navbarRef = useRef(null);
  
  // Calculate the pill position
  const calculatePillPosition = useCallback(() => {
    const currentIndex = navItems.findIndex(item =>
      item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
    );
    if (currentIndex !== -1 && navContainerRef.current) {
      // Use clientWidth to exclude borders for accurate center positioning
      // Account for the 6px padding on each side of the wrapper
      const padding = 6;
      const containerWidth = navContainerRef.current.clientWidth - (padding * 2);
      const itemWidth = containerWidth / navItems.length;
      const newPosition = padding + (currentIndex * itemWidth) + (itemWidth / 2);
      setPillPosition((previousPosition) => (
        previousPosition === newPosition ? previousPosition : newPosition
      ));
      setIsPillVisible(true);
    } else {
      setIsPillVisible(false);
    }
  }, [location.pathname, navItems]);

  useEffect(() => {
    calculatePillPosition();
  }, [calculatePillPosition]);

  useEffect(() => {
    if (!navContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry?.contentRect.width) {
        calculatePillPosition();
      }
    });

    resizeObserver.observe(navContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [calculatePillPosition]);


  useEffect(() => {
    if (isSideNavVisible) {
      document.body.classList.add("side-nav-open");
    } else {
      document.body.classList.remove("side-nav-open");
    }
  }, [isSideNavVisible]);

  useCloseOnWindowScroll(showWechatModal, () => setShowWechatModal(false));

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

  const renderLanguageControls = (variant = "top") => (
    <div className={`language-control-group ${variant === "side" ? "language-control-group--side" : ""}`}>
      <button
        type="button"
        className="language-toggle-btn"
        onClick={toggleLocale}
        aria-label={copy.languageToggle}
        title={copy.languageMode}
      >
        <span className={`language-toggle-btn__option ${locale === "zh" ? "active" : ""}`}>中</span>
        <span className="language-toggle-btn__divider">/</span>
        <span className={`language-toggle-btn__option ${locale === "en" ? "active" : ""}`}>EN</span>
      </button>
    </div>
  );

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
          <div className="d-lg-none mobile-topbar">
            <button
              type="button"
              className="language-toggle-btn mobile-topbar__btn mobile-topbar__btn--language"
              onClick={toggleLocale}
              aria-label={copy.languageToggle}
              title={copy.languageMode}
            >
              <span className={`language-toggle-btn__option ${locale === "zh" ? "active" : ""}`}>中</span>
              <span className="language-toggle-btn__divider">/</span>
              <span className={`language-toggle-btn__option ${locale === "en" ? "active" : ""}`}>EN</span>
            </button>
            <button
              type="button"
              className="theme-toggle-btn mobile-topbar__btn"
              onClick={toggleTheme}
              aria-label={copy.toggleTheme}
            >
              {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
            </button>
          </div>

          <Container className="d-none d-lg-flex align-items-center justify-content-between navbar-top-inner">
            
            {/* Left Column: Brand */}
            <div className="navbar-brand-col">
              <span
                className="navbar-brand-text"
                onClick={() => { navigate("/"); if (triggerPreloader) { triggerPreloader(); } }}
              >
                {copy.brandName}
              </span>
            </div>

            {/* Center Column: Pill Navigation Container */}
            <div className="navbar-center-pill">
              <button
                type="button"
                className={`sidebar-toggle-icon ${isSideNavVisible ? "active" : ""}`}
                onClick={handleToggleSideNav}
                aria-label={copy.toggleSidebar}
              >
                <FiSidebar />
              </button>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" className="d-lg-none" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mx-auto" defaultActiveKey="#home">
                  <NavLinks
                    items={navItems}
                    linkClassName=""
                    iconClassName="navbar-icon"
                    onClick={closeNavbar}
                    hideIcon={true}
                  />
                </Nav>
              </Navbar.Collapse>
            </div>

            {/* Right Column: GitHub & Theme Toggle */}
            <div className="navbar-right-col" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={copy.toggleTheme}
              >
                {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
              </button>
              {renderLanguageControls()}
              <a
                href="https://github.com/Magicherry/Bits-of-Me"
                target="_blank"
                rel="noopener noreferrer"
                className="github-pill-btn"
                aria-label={copy.githubRepository}
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
              {renderLanguageControls("side")}
              <div className="floating-nav-header-actions">
                <button
                  type="button"
                  className="theme-toggle-btn"
                  onClick={toggleTheme}
                  aria-label={copy.toggleTheme}
                  style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}
                >
                  {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
                </button>
                <button type="button" className="floating-nav-close" onClick={toggleSideNav} aria-label={copy.collapseToTopNav}>
                  <FiSidebar />
                </button>
              </div>
            </div>

            <div className="floating-nav-profile">
              <Tilt className="floating-nav-avatar-wrapper">
                <img
                  src={avatarImg}
                  alt={copy.avatarAlt}
                  className="floating-nav-avatar"
                  loading="lazy"
                  decoding="async"
                />
              </Tilt>

              <div className="floating-nav-name">{copy.displayName}</div>
              <div className="floating-nav-title">{copy.masterTitle}</div>
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
                items={navItems}
                linkClassName="floating-nav-link"
                onClick={closeNavbar}
              />
            </Nav>

            <div className="floating-nav-divider" />

            <div className="floating-nav-bottom">
              <div className="floating-nav-contact-group">
                <a
                  className="floating-nav-contact-item"
                  href="https://www.cs.rutgers.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiMapPin />
                  <span>{copy.location}</span>
                </a>
                <a className="floating-nav-contact-item" href={`mailto:${copy.email}`}>
                  <FiMail />
                  <span>{copy.email}</span>
                </a>
                <a className="floating-nav-contact-item" href={`tel:${copy.phone.replace(/[^\d+]/g, "")}`}>
                  <FiPhone />
                  <span>{copy.phone}</span>
                </a>
              </div>

              <div className="floating-nav-footer">
                <a
                  href={activeCvFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="floating-nav-ghost-btn"
                >
                  <AiOutlineDownload />
                  <span>{copy.downloadCv}</span>
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
            />
            
              <Nav className="main-nav">
                <NavLinks
                items={navItems}
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
              alt={copy.wechatQrAlt}
              className="img-max-full"
              loading="lazy"
              decoding="async"
            />
          </Modal.Body>
        </Modal>
      </>
  );
}

export default React.memo(NavBar);
