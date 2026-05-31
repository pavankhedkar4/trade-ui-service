import "./App.css";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UpstockUser from "./pages/UpstockUser";
import UpstockHomepage from "./pages/UpstockHomepage";
import Portfolio from "./pages/Portfolio";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upstock-user" element={<UpstockUser />} />
        <Route path="/upstock-homepage" element={<UpstockHomepage />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </Router>
  );
}

export default App;
