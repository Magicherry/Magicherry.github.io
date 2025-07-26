import React, { useState, useEffect } from "react";
import Preloader from "./components/MainFrame/Pre";
import Navbar from "./components/MainFrame/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Footer from "./components/MainFrame/Footer";
import Resume from "./components/Resume/ResumeNew";
import Experiences from "./components/Experiences/Experiences";
import Particle from "./components/MainFrame/Particle";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import ScrollToTop from "./components/MainFrame/ScrollToTop";
import "./css/style.css";
import "./css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/responsive.css";


function App() {
  const [load, upadateLoad] = useState(true);

  const triggerPreloader = () => {
    upadateLoad(true);
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1000);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    document.body.classList.add("homepage");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Preloader load={load} />
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <Navbar triggerPreloader={triggerPreloader} />
        <Particle />
        <ScrollToTop />
        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="*" element={<Navigate to="/"/>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;