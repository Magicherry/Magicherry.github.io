import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProjectCard from "./ProjectCard";

import FadeInOnScroll from "../MainFrame/FadeInOnScroll";
import { BsGridFill, BsListUl, BsChevronDown, BsCheck } from "react-icons/bs";
import { projects } from "./ProjectData";

const Projects = () => {
  const getInitialViewMode = () => {
    if (typeof window === "undefined") return "list";
    const stored = window.localStorage ? window.localStorage.getItem("projectsViewMode") : null;
    return stored === "grid" || stored === "list" ? stored : "list";
  };

  const [viewMode, setViewMode] = useState(getInitialViewMode);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));

  const filteredProjects = selectedTags.length === 0 
    ? projects 
    : projects.filter(p => selectedTags.every(tag => p.tags.includes(tag)));

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("projectsViewMode", viewMode);
    }
  }, [viewMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    // After the first render, it's no longer the initial load
    setIsInitialLoad(false);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
      <Container fluid className="project-section">
        
        <Container>
          <h1 className="project-heading">
            My Recent <strong className="blue">Works</strong>
          </h1>
          <p style={{ color: "white" }}>
            My works make use of a vast variety of the latest technology tools.
          </p>
          <Row className={`projects__row ${viewMode}`}>
            <Col md={12} className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div className="filter-dropdown-container" ref={dropdownRef}>
                <div className="d-flex align-items-center gap-2">
                  <button 
                    className={`filter-dropdown-toggle ${isDropdownOpen ? 'active' : ''}`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="filter-dropdown-label">All Genres</span>
                    {selectedTags.length > 0 && (
                      <div 
                        className="filter-selected-tags"
                        onWheel={(e) => {
                          e.stopPropagation();
                          e.currentTarget.scrollLeft += e.deltaY;
                        }}
                      >
                        {selectedTags.map(tag => (
                          <span key={tag} className="filter-selected-tag">
                            {tag}
                            <span 
                              className="filter-tag-remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTagToggle(tag);
                              }}
                            >
                              ×
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                    <BsChevronDown className="dropdown-icon" />
                  </button>

                  {selectedTags.length > 0 && (
                    <button 
                      className="filter-clear-btn"
                      onClick={() => setSelectedTags([])}
                    >
                      × Clear
                    </button>
                  )}
                </div>
                
                {isDropdownOpen && (
                  <div className="filter-dropdown-menu">
                    {allTags.map(tag => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          className={`filter-dropdown-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleTagToggle(tag)}
                        >
                          <span className="item-text">{tag}</span>
                          {isSelected && <BsCheck className="check-icon" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="view-switcher-container">
                <Button
                    variant="outline-primary"
                    onClick={() => setViewMode("list")}
                    className={`view-switcher__button ${viewMode === "list" ? "view-switcher__button--active" : ""}`}
                >
                  <BsListUl />
                </Button>
                <Button
                    variant="outline-primary"
                    onClick={() => setViewMode("grid")}
                    className={`view-switcher__button ${viewMode === "grid" ? "view-switcher__button--active" : ""}`}
                >
                  <BsGridFill />
                </Button>
              </div>
            </Col>
            {filteredProjects.map((project, index) => (
                <Col
                    lg={viewMode === "grid" ? 4 : 12}
                    md={viewMode === "grid" ? 6 : 12}
                    sm={12}
                    className="project-card"
                    key={`${viewMode}-${index}`}
                >
              <FadeInOnScroll delay={index * 40} eager skipAnimation={isInitialLoad}>
                    <ProjectCard
                        {...project}
                        viewMode={viewMode}
                    />
                  </FadeInOnScroll>
                </Col>
            ))}
          </Row>
        </Container>
      </Container>
  );
};

export default Projects;