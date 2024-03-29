import React, { Fragment } from "react";
import Header from "./Header";
import Footer from "./Footer";

const PageNotFound = () => {
  return (
    <Fragment>
      <Header />
      <div id="HukuBartopolos">
        <h1>404</h1>
        <h2>page not found</h2>
      </div>
      <Footer />
    </Fragment>
  );
};

export default PageNotFound;
