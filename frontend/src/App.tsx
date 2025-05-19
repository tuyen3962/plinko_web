// import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Simulation } from "./pages/Simulation";
import { Game } from "./pages/Game";
import { Simulation } from "./pages/Simulation";
// import { Home } from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        {/* <Route path="/" element={<Home />} />
        <Route path="/simulation" element={<Simulation />} /> */}
         <Route path="/simulation" element={<Simulation />} />
        <Route path="/" element={<Game />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
