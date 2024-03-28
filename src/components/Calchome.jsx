import { useState } from "react";
import Body from "./Body";
import Header from "./Header";
import Footer from "./Footer";
import ResponsiveAlert from "./Alert";

function Home() {
  const [advancedMode, setAdvancedMode] = useState(false);
  return (
    <>
      <div id="HukuBartopolos">
        <Header />
        <div>
          <ResponsiveAlert
            breakpointWidth={1280}
            message="Optimizing for desktop first, screen resolution too low!"
          />
        </div>
        <div id="AletaOceans">
          <Body advancedMode={advancedMode} setAdvancedMode={setAdvancedMode} />
        </div>
        <Footer />
      </div>
    </>
  );
}
export default Home;
