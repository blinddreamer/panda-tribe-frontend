import { useState } from "react";
import Body from "./Body";
import Header from "./Header";
import Footer from "./Footer";

function Home() {
  const [advancedMode, setAdvancedMode] = useState(false);
  return (
    <>
      <div id="HukuBartopolos">
        <Header />
        <div id="AletaOceans">
          <Body advancedMode={advancedMode} setAdvancedMode={setAdvancedMode} />
        </div>
        <Footer />
      </div>
    </>
  );
}
export default Home;
