import React from "react";
import "./App.css";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import CalculatorHome from "./components/Calculator/CalculatorHome.jsx";
import Home from "./components/Homepage";
import Footer from "./components/Footer";
import PageNotFound from "./components/PageNotFound";
import Appraisal from "./components/Appraisal/Appraisal.jsx";
import Video from "./components/Video";
import NavbarMenu from "./components/NavbarMenu";

function App() {
  return (
    <>
      <Video />
      <BrowserRouter>
        <div id="HukuBartopolos">
          <NavbarMenu />
          {/*<main id="swup" className="transition-main">*/}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Calculator" element={<CalculatorHome />} />
            <Route path="/Appraisal" element={<Appraisal />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          {/*</main>*/}
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
