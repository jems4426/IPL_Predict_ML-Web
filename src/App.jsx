import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Predictor from "./pages/Predictor";
import ResultDashboard from "./pages/ResultDashboard";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-darkBg text-white selection:bg-neonGreen selection:text-black font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predictor />} />
            <Route path="/result" element={<ResultDashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
