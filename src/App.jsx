import React from "react";
import "./App.css";
import Home from "./components/Home";
import Appraisal from "./components/Appraisal";
import { Route } from "wouter";

const App = () => {
  return (
    <>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/appraisal">
        <Appraisal />
      </Route>
    </>
  );
};

export default App;
