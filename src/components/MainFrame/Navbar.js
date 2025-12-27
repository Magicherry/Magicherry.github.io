import React, { useState, useEffect, useRef, useCallback } from "react";
import { Navbar, Nav, Container, Modal } from "react-bootstrap";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
  AiFillGithub,
  AiOutlineStar,
  AiOutlineFileText
} from "react-icons/ai";
import { MdWorkOutline } from "react-icons/md";
import { FiSidebar, FiMapPin } from "react-icons/fi";
import { FaLinkedinIn, FaWeixin } from "react-icons/fa";
import { SiBilibili } from "react-icons/si";
import avatarImg from "../../Assets/avatar/avatar.png";
import wechatQrCode from "../../Assets/about/social/Wechat.jpg";
import cvFile from "../../Assets/cv/Yuting_Zhou_CV.pdf";

const NAV_ITEMS = [
  { path: "/", icon: AiOutlineHome, label: "HOME" },
  { path: "/about", icon: AiOutlineUser, label: "ABOUT" },
  { path: "/experiences", icon: MdWorkOutline, label: "TRACKS" },
  { path: "/project", icon: AiOutlineFundProjectionScreen, label: "PROJECTS" }
];

function NavBar({ triggerPreloader }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTopNavHidden, setIsTopNavHidden] = useState(false);
  const [isBottomNavHidden, setIsBottomNavHidden] = useState(false);
  const [isSideNavVisible, setIsSideNavVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage ? window.localStorage.getItem("navMode") : null;
    if (stored === "side" && window.innerWidth >= 992) return true;
    if (stored === "top") return false;
    return window.innerWidth >= 992;
  });
  const [showWechatModal, setShowWechatModal] = useState(false);
  const lastScrollYRef = useRef(window.scrollY);
  const scrollTimeoutRef = useRef(null);
  
  // 拖拽相关状态
  const location = useLocation();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [pillPosition, setPillPosition] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const navContainerRef = useRef(null);
  const pillRef = useRef(null);
  const navbarRef = useRef(null);
  
  // 计算药丸位置的函数
  const calculatePillPosition = useCallback(() => {
    const currentIndex = NAV_ITEMS.findIndex(item =>
      item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
    );
    if (currentIndex !== -1 && navContainerRef.current) {
      const containerWidth = navContainerRef.current.offsetWidth;
      const itemWidth = containerWidth / NAV_ITEMS.length;
      const newPosition = currentIndex * itemWidth + itemWidth / 2;
      setPillPosition(newPosition);
    }
  }, [location.pathname]);

  // 更新药丸位置基于当前路由
  useEffect(() => {
    calculatePillPosition();
  }, [calculatePillPosition, location.pathname]);

  // 监听窗口大小变化，自适应调整药丸位置
  useEffect(() => {
    const handleResize = () => {
      // 使用setTimeout延迟执行，确保DOM更新完成
      setTimeout(calculatePillPosition, 10);
    };

    window.addEventListener('resize', handleResize);
    // 监听方向变化（移动端）
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [calculatePillPosition]);

  // 使用ResizeObserver监听容器大小变化（更精确）
  useEffect(() => {
    if (!navContainerRef.current) return;

    let resizeTimeout;
    const resizeObserver = new ResizeObserver((entries) => {
      // 防抖处理，避免频繁触发
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

  // 拖拽事件处理
  const handlePillMouseDown = (e) => {
    if (!navContainerRef.current) return;
    setIsDragging(true);
    const containerRect = navContainerRef.current.getBoundingClientRect();
    setDragStartX(e.clientX - containerRect.left - pillPosition);
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePillTouchStart = (e) => {
    if (!navContainerRef.current) return;
    setIsDragging(true);
    const containerRect = navContainerRef.current.getBoundingClientRect();
    setDragStartX(e.touches[0].clientX - containerRect.left - pillPosition);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !navContainerRef.current) return;
      
      const containerRect = navContainerRef.current.getBoundingClientRect();
      const newX = e.clientX - containerRect.left - dragStartX;
      const itemWidth = containerRect.width / NAV_ITEMS.length;
      const clampedX = Math.max(itemWidth / 2, Math.min(newX, containerRect.width - itemWidth / 2));
      setPillPosition(clampedX);
    },
    [dragStartX, isDragging]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging || !navContainerRef.current) return;
      
      e.preventDefault(); // 防止页面滚动
      const containerRect = navContainerRef.current.getBoundingClientRect();
      const newX = e.touches[0].clientX - containerRect.left - dragStartX;
      const itemWidth = containerRect.width / NAV_ITEMS.length;
      const clampedX = Math.max(itemWidth / 2, Math.min(newX, containerRect.width - itemWidth / 2));
      setPillPosition(clampedX);
    },
    [dragStartX, isDragging]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging || !navContainerRef.current) return;
    
    setIsDragging(false);
    
    // 计算最近的导航项
    const containerWidth = navContainerRef.current.offsetWidth;
    const itemWidth = containerWidth / NAV_ITEMS.length;
    const closestIndex = Math.round((pillPosition - itemWidth / 2) / itemWidth);
    const clampedIndex = Math.max(0, Math.min(closestIndex, NAV_ITEMS.length - 1));
    
    // 导航到对应页面
    const targetPath = NAV_ITEMS[clampedIndex].path;
    if (targetPath !== location.pathname) {
      navigate(targetPath);
      if (triggerPreloader) {
        triggerPreloader();
      }
    }
    
    // 吸附到正确位置
    const finalPosition = clampedIndex * itemWidth + itemWidth / 2;
    setPillPosition(finalPosition);
  }, [isDragging, location.pathname, navigate, pillPosition, triggerPreloader]);

  useEffect(() => {
    if (isDragging) {
      const options = { passive: false };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleTouchMove, options);
      document.addEventListener('touchend', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleTouchMove, options);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [handleDragEnd, handleMouseMove, handleTouchMove, isDragging]);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      const atBottom = window.innerHeight + scrollY >= document.body.offsetHeight - 10;
      const isMobile = window.innerWidth < 992;
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
      if (isMobile) {
        if (isScrollingDown && scrollY > 80) {
          setIsTopNavHidden(true);
        } else {
          setIsTopNavHidden(false);
        }
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

  useEffect(() => {
    if (isSideNavVisible) {
      document.body.classList.add("side-nav-open");
    } else {
      document.body.classList.remove("side-nav-open");
    }
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("navMode", isSideNavVisible ? "side" : "top");
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

  // Auto-disable floating side navigation on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992 && isSideNavVisible) {
        setIsSideNavVisible(false);
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem("navMode", "top");
        }
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [isSideNavVisible]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    const storedMode = window.localStorage.getItem("navMode");
    if (storedMode === "side" && window.innerWidth >= 992) {
      setIsSideNavVisible(true);
    }
  }, []);

  const closeNavbar = () => setIsExpanded(false);

  const toggleSideNav = () => {
    setIsSideNavVisible((prev) => {
      const next = !prev;
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("navMode", next ? "side" : "top");
      }
      return next;
    });
    closeNavbar();
  };

  const openWechatModal = (event) => {
    event.preventDefault();
    setShowWechatModal(true);
  };

  // 监听点击外部区域关闭汉堡菜单
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
        <Navbar
            ref={navbarRef}
            expanded={isExpanded}
            fixed="top"
            expand="lg"
            className={`${isTopNavHidden ? "navbar-hidden" : ""} ${isScrolled ? "navbar-scrolled" : ""} ${isSideNavVisible ? "navbar-floating-mode" : ""}`}
            onToggle={setIsExpanded}
        >
          <Container className="custom-navbar-container">
            <Navbar.Brand as={Link} to="/" onClick={() => { closeNavbar(); if (triggerPreloader) { triggerPreloader(); } }}>
              MAGICHERRY.
            </Navbar.Brand>
            <div className="layout-toggle-wrapper">
              <button
                type="button"
                className={`layout-toggle-btn ${isSideNavVisible ? "active" : ""}`}
                onClick={toggleSideNav}
              >
                <FiSidebar />
              </button>
            </div>
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
                
                <Nav.Item className="fork-btn">
                  <Nav.Link
                    href="https://github.com/Magicherry/Bits-of-Me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fork-btn-inner"
                  >
                    <AiFillGithub className="navbar-fork-icon" />
                    <AiOutlineStar className="navbar-star-icon" />
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div className={`floating-nav-container ${isSideNavVisible ? "show" : ""}`}>
          <div className="floating-nav-panel">
            <div className="floating-nav-header">
              <span className="floating-nav-brand" onClick={() => { navigate("/"); if (triggerPreloader) { triggerPreloader(); } }}>
                MAGICHERRY.
              </span>
              <button type="button" className="floating-nav-close" onClick={toggleSideNav} aria-label="Collapse to top navigation">
                <FiSidebar />
              </button>
            </div>

            <div className="floating-nav-profile">
              <div className="floating-nav-avatar-wrapper">
                <img src={avatarImg} alt="Yuting Zhou avatar" className="floating-nav-avatar" />
              </div>
              <div className="floating-nav-name">Yuting Zhou</div>
              <div className="floating-nav-title">M.S. in Computer Science</div>
              <a
                className="floating-nav-location"
                href="https://www.google.com/maps/search/?api=1&query=Edison%2C%20NJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiMapPin />
                <span>Edison, NJ</span>
              </a>
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
              {NAV_ITEMS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Nav.Item key={item.path}>
                    <Nav.Link
                      as={NavLink}
                      to={item.path}
                      end={item.path === "/"}
                      className="floating-nav-link"
                      onClick={() => {
                        closeNavbar();
                      }}
                    >
                      <IconComponent />
                      <span>{item.label}</span>
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>

            <div className="floating-nav-divider" />

            <div className="floating-nav-bottom">
              <div className="floating-nav-contact-text">
                <a href="mailto:zyt680129@gmail.com">zyt680129@gmail.com</a>
                <a href="tel:+18482309757">+1 (848) 230-9757</a>
              </div>
              <div className="floating-nav-footer">
                <a
                  href={cvFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="floating-nav-ghost-btn"
                >
                  <AiOutlineFileText />
                  <span>View my resume</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Bar for Mobile */}
        <div className={`d-lg-none bottom-nav-container ${isBottomNavHidden ? "bottom-nav-hidden" : ""}`}>
          {/* Main navigation buttons with rounded rectangle background */}
          <div className="main-nav-wrapper" ref={navContainerRef}>
            {/* 可拖拽的药丸滑块 */}
            <div 
              className={`draggable-pill ${isDragging ? 'dragging' : ''}`}
              style={{
                left: `${pillPosition}px`,
                transform: 'translateX(-50%)'
              }}
              ref={pillRef}
            >
              {/* 拖拽手柄 */}
              <div 
                className="drag-handle"
                onMouseDown={handlePillMouseDown}
                onTouchStart={handlePillTouchStart}
              />
            </div>
            
            <Nav className="main-nav">
              {NAV_ITEMS.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Nav.Item key={item.path}>
                    <Nav.Link 
                      as={NavLink} 
                      to={item.path} 
                      end={item.path === "/"} 
                      onClick={closeNavbar}
                      className="main-nav-link"
                    >
                      <IconComponent />
                      <span>{item.label}</span>
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
          </div>
          
          {/* Independent circular GitHub button */}
          <div className="github-nav-wrapper">
            <a
              href="https://github.com/Magicherry/Bits-of-Me"
              target="_blank"
              rel="noopener noreferrer"
              className="github-nav-button"
            >
              <AiFillGithub />
            </a>
          </div>
        </div>

        <Modal show={showWechatModal} onHide={() => setShowWechatModal(false)} centered>
          <Modal.Body style={{ textAlign: "center", cursor: "pointer" }} onClick={() => setShowWechatModal(false)}>
            <img src={wechatQrCode} alt="WeChat QR Code" style={{ maxWidth: "100%" }} />
          </Modal.Body>
        </Modal>
      </>
  );
}

export default NavBar;
