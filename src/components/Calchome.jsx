import { useState } from "react";
import Body from "./Body";
import AnimatedPage from "./Animated";

function Home() {
  const [advancedMode, setAdvancedMode] = useState(false);
  return (
    <>
      <div id="HukuBartopolos">
        <AnimatedPage>
          <div id="AletaOceans">
            <Body
              advancedMode={advancedMode}
              setAdvancedMode={setAdvancedMode}
            />
          </div>
        </AnimatedPage>
      </div>
    </>
  );
}
export default Home;
