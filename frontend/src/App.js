import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";  
import Home from "./pages/Home";
import Airports from "./pages/admin/Airports";
import Flights from "./pages/admin/Flights";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
        <Route path="/" element={<Home />} />
        <Route path="/admin/airports" element={<Airports />} />
        <Route path="/admin/flights" element={<Flights />} />
      </Routes>
    </Router>
  );
}

export default App;
