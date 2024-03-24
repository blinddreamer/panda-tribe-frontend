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
        <Body advancedMode={advancedMode} setAdvancedMode={setAdvancedMode} />
        <Footer />
      </div>
    </>
  );
}
export default Home;
