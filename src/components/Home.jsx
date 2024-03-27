import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

function Appraisal() {
  return (
    <>
      <div id="HukuBartopolos">
        <Header />

        <div>
          <h2>BETA!</h2>

          <main>
            <p>
              eve-helper is an advanced industrial calculator aiming to help
              with your industrial costs.
            </p>
            <p>
              Whether you're a seasoned industrialist or just starting out,{" "}
              <a href="https://eve-helper.com">eve-helper</a> provides
              comprehensive tools and features to streamline your industrial
              operations in EVE.
            </p>
            <p>
              With <a href="https://eve-helper.com">eve-helper</a>, you can
              calculate material requirements, production costs, profit margins,
              and more for a wide range of industrial activities. Our
              user-friendly interface and customizable settings make it easy to
              optimize your industry and maximize your profits.
            </p>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
export default Appraisal;
