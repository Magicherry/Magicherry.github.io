import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { CgFileDocument } from "react-icons/cg";
import {
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
  AiFillGithub,
  AiOutlineStar
} from "react-icons/ai";
import { MdWorkOutline } from "react-icons/md";

function NavBar({ triggerPreloader }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTopNavHidden, setIsTopNavHidden] = useState(false);
  const [isBottomNavHidden, setIsBottomNavHidden] = useState(false);
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
  
  // 导航项配置
  const navItems = [
    { path: "/", icon: AiOutlineHome, label: "HOME" },
    { path: "/about", icon: AiOutlineUser, label: "ABOUT" },
    { path: "/experiences", icon: MdWorkOutline, label: "TRACKS" },
    { path: "/project", icon: AiOutlineFundProjectionScreen, label: "PROJECTS" }
  ];

  // 计算药丸位置的函数
  const calculatePillPosition = () => {
    const currentIndex = navItems.findIndex(item => 
      item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
    );
    if (currentIndex !== -1 && navContainerRef.current) {
      const containerWidth = navContainerRef.current.offsetWidth;
      const itemWidth = containerWidth / navItems.length;
      const newPosition = currentIndex * itemWidth + itemWidth / 2;
      setPillPosition(newPosition);
    }
  };

  // 更新药丸位置基于当前路由
  useEffect(() => {
    calculatePillPosition();
  }, [location.pathname, navItems]);

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
  }, [location.pathname, navItems]);

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
  }, [location.pathname, navItems]);

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

  const handleMouseMove = (e) => {
    if (!isDragging || !navContainerRef.current) return;
    
    const containerRect = navContainerRef.current.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - dragStartX;
    const itemWidth = containerRect.width / navItems.length;
    const clampedX = Math.max(itemWidth / 2, Math.min(newX, containerRect.width - itemWidth / 2));
    setPillPosition(clampedX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !navContainerRef.current) return;
    
    e.preventDefault(); // 防止页面滚动
    const containerRect = navContainerRef.current.getBoundingClientRect();
    const newX = e.touches[0].clientX - containerRect.left - dragStartX;
    const itemWidth = containerRect.width / navItems.length;
    const clampedX = Math.max(itemWidth / 2, Math.min(newX, containerRect.width - itemWidth / 2));
    setPillPosition(clampedX);
  };

  const handleDragEnd = () => {
    if (!isDragging || !navContainerRef.current) return;
    
    setIsDragging(false);
    
    // 计算最近的导航项
    const containerWidth = navContainerRef.current.offsetWidth;
    const itemWidth = containerWidth / navItems.length;
    const closestIndex = Math.round((pillPosition - itemWidth / 2) / itemWidth);
    const clampedIndex = Math.max(0, Math.min(closestIndex, navItems.length - 1));
    
    // 导航到对应页面
    const targetPath = navItems[clampedIndex].path;
    if (targetPath !== location.pathname) {
      navigate(targetPath);
      if (triggerPreloader) {
        triggerPreloader();
      }
    }
    
    // 吸附到正确位置
    const finalPosition = clampedIndex * itemWidth + itemWidth / 2;
    setPillPosition(finalPosition);
  };

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
  }, [isDragging, pillPosition, dragStartX]);

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

        {/* Bottom Tab Bar for Mobile */}
        <div className={`d-lg-none bottom-nav-container ${isBottomNavHidden ? "bottom-nav-hidden" : ""}`} ref={navContainerRef}>
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
          
          <Nav className="bottom-nav">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Nav.Item key={item.path}>
                  <Nav.Link 
                    as={NavLink} 
                    to={item.path} 
                    end={item.path === "/"} 
                    onClick={closeNavbar}
                    className="nav-item-clickable"
                  >
                    <IconComponent />
                    <span>{item.label}</span>
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
        </div>
      </>
  );
}

export default NavBar;
