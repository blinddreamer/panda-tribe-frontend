import { useState } from "react";
import "./App.css";
import Body from "./components/Body";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [advancedMode, setAdvancedMode] = useState(false);
  return (
    <div>
      <Header />
      <Body advancedMode={advancedMode} setAdvancedMode={setAdvancedMode} />
      <Footer />
    </div>
  );
}

export default App;
