import { useState } from "react";
import Body from "./Calculator_Body";

function Calchome() {
  const [advancedMode, setAdvancedMode] = useState(false);
  return (
    <>
      <div id="AletaOceans">
        <Body advancedMode={advancedMode} setAdvancedMode={setAdvancedMode} />
      </div>
    </>
  );
}
export default Calchome;
