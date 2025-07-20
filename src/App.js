import React, { useState, useEffect } from "react";
import Preloader from "./components/MainFrame/Pre";
import Navbar from "./components/MainFrame/Navbar";
import Home_1 from "./components/Home/Home_1";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Footer from "./components/MainFrame/Footer";
import Resume from "./components/Resume/ResumeNew";
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

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Preloader load={load} />
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home_1 />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
