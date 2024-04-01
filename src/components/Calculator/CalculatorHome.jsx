import { useState } from "react";
import Body from "src/components/Calculator/CalculatorBody.jsx";

function CalculatorHome() {
  const [advancedMode, setAdvancedMode] = useState(false);
  return (
    <>
      <div id="AletaOceans">
        <Body advancedMode={advancedMode} setAdvancedMode={setAdvancedMode} />
      </div>
    </>
  );
}
export default CalculatorHome;
