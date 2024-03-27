import React from "react";
import "./App.css";
import Calchome from "./components/Calchome";
import Home from "./components/Home";
import { Route } from "wouter";

const App = () => {
  return (
    <>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/calculator">
        <Calchome />
      </Route>
    </>
  );
};

export default App;
