import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Body from "./components/Body";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [advancedMode,setAdvancedMode] = useState(false);
  return (
    <div>
      <Header advancedMode={advancedMode} setAdvancedMode={setAdvancedMode}/>
      <Body advancedMode={advancedMode} setAdvancedMode={setAdvancedMode}/>
      <Footer />
    </div>
  );
}

export default App;
