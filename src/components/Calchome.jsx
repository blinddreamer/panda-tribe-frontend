import { useState } from "react";
import Body from "./Body";

function Home() {
  const [advancedMode, setAdvancedMode] = useState(false);
  return (
    <>
      <div id="AletaOceans">
        <Body advancedMode={advancedMode} setAdvancedMode={setAdvancedMode} />
      </div>
    </>
  );
}
export default Home;
