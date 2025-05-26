// import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Simulation } from "./pages/Simulation";
import { Game } from "./pages/Game";
import { Footer, Navbar } from "./components";
import { Home } from "./pages/Home";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=0.6, user-scalable=no';
    document.head.appendChild(meta);

  }, []);
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/game" element={<Game />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
