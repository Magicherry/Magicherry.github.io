import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProjectCard from "./ProjectCard";

import FadeInOnScroll from "../MainFrame/FadeInOnScroll";
import { BsGridFill, BsListUl, BsChevronDown, BsCheck } from "react-icons/bs";
import { projects } from "./ProjectData";
import { useLanguage } from "../../context/LanguageContext";

const Projects = () => {
  const { locale } = useLanguage();
  const copy = locale === "zh"
    ? {
      headingPrefix: "经历",
      headingAccent: "项目",
      subtitle: "既有个人作品，也有更贴近真实场景的问题拆解与工程实现。",
      sortOptions: [
        { value: "dateDesc", label: "最新优先" },
        { value: "dateAsc", label: "最早优先" },
      ],
      allGenres: "全部标签",
      sort: "排序",
      clear: "清除",
      listView: "列表视图",
      gridView: "网格视图"
    }
    : {
      headingPrefix: "My Previous",
      headingAccent: "Portfolio",
      subtitle: "Built with modern technologies and tools.",
      sortOptions: [
        { value: "dateDesc", label: "Newest first" },
        { value: "dateAsc", label: "Oldest first" },
      ],
      allGenres: "All Genres",
      sort: "Sort",
      clear: "Clear",
      listView: "List view",
      gridView: "Grid view"
    };
  const getInitialViewMode = () => {
    if (typeof window === "undefined") return "list";
    const stored = window.localStorage ? window.localStorage.getItem("projectsViewMode") : null;
    return stored === "grid" || stored === "list" ? stored : "list";
  };

  const [viewMode, setViewMode] = useState(getInitialViewMode);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("dateDesc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  const allTags = useMemo(
    () => Array.from(new Set(projects.flatMap((project) => project.tags))),
    []
  );

  const filteredProjects = useMemo(() => (
    selectedTags.length === 0
      ? projects
      : projects.filter((project) => selectedTags.every((tag) => project.tags.includes(tag)))
  ), [selectedTags]);

  const sortedProjects = useMemo(() => {
    const getYear = (project) => parseInt(project.date, 10) || 0;

    if (sortBy === "dateDesc") {
      return [...filteredProjects].sort((a, b) => getYear(b) - getYear(a));
    }

    if (sortBy === "dateAsc") {
      return [...filteredProjects].sort((a, b) => getYear(a) - getYear(b));
    }

    return filteredProjects;
  }, [filteredProjects, sortBy]);

  const handleTagToggle = useCallback((tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("projectsViewMode", viewMode);
    }
  }, [viewMode]);

  useEffect(() => {
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isDropdownOpen && !isSortDropdownOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen, isSortDropdownOpen]);

  return (
      <Container fluid className="project-section">
        
        <Container>
          <h1 className="project-heading">
          {locale === "zh" ? <><strong className="text-accent">{copy.headingAccent}</strong> {copy.headingPrefix}</> : <>{copy.headingPrefix}{copy.headingPrefix ? " " : ""}<strong className="text-accent">{copy.headingAccent}</strong></>}
          </h1>
          <p className="section-intro-text">
            {copy.subtitle}
          </p>
          <Row className={`projects__row ${viewMode}`}>
            <Col md={12} className="projects__toolbar d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="filter-dropdown-container" ref={dropdownRef}>
                <div className="d-flex align-items-center gap-2">
                  <button 
                    className={`filter-dropdown-toggle ${isDropdownOpen ? 'active' : ''}`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {selectedTags.length === 0 && (
                      <span className="filter-dropdown-label">{copy.allGenres}</span>
                    )}
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

              <div className="filter-dropdown-container sort-dropdown-container" ref={sortDropdownRef}>
                <button
                  className={`filter-dropdown-toggle sort-dropdown-toggle ${isSortDropdownOpen ? "active" : ""}`}
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                >
                  <span className="filter-dropdown-label">
                    {copy.sort}: {copy.sortOptions.find(o => o.value === sortBy)?.label ?? copy.sortOptions[0].label}
                  </span>
                  <BsChevronDown className="dropdown-icon" />
                </button>
                {isSortDropdownOpen && (
                  <div className="filter-dropdown-menu">
                    {copy.sortOptions.map(opt => (
                      <button
                        key={opt.value}
                        className={`filter-dropdown-item ${sortBy === opt.value ? "selected" : ""}`}
                        onClick={() => {
                          setSortBy(opt.value);
                          setIsSortDropdownOpen(false);
                        }}
                      >
                        <span className="item-text">{opt.label}</span>
                        {sortBy === opt.value && <BsCheck className="check-icon" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {(selectedTags.length > 0 || sortBy !== "dateDesc") && (
                <button
                  className="filter-clear-btn"
                  onClick={() => {
                    setSelectedTags([]);
                    setSortBy("dateDesc");
                  }}
                >
                  × {copy.clear}
                </button>
              )}
              </div>

              <div className="view-switcher-container">
                <Button
                    variant="outline-primary"
                    onClick={() => setViewMode("list")}
                    className={`view-switcher__button ${viewMode === "list" ? "view-switcher__button--active" : ""}`}
                    aria-label={copy.listView}
                >
                  <BsListUl />
                </Button>
                <Button
                    variant="outline-primary"
                    onClick={() => setViewMode("grid")}
                    className={`view-switcher__button ${viewMode === "grid" ? "view-switcher__button--active" : ""}`}
                    aria-label={copy.gridView}
                >
                  <BsGridFill />
                </Button>
              </div>
            </Col>
            {sortedProjects.map((project, index) => (
                <Col
                    lg={viewMode === "grid" ? 4 : 12}
                    md={viewMode === "grid" ? 6 : 12}
                    sm={12}
                    className="project-card"
                    key={project.title.en}
                >
              <FadeInOnScroll
                key={`${project.title.en}-${viewMode}`}
                delay={index * 40}
                eager
                skipAnimation={isInitialLoad}
              >
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
