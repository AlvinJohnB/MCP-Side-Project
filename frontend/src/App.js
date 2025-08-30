import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register"; 
import Home from "./pages/Home";
import Airports from "./pages/admin/Airports";
import Flights from "./pages/admin/Flights";
import Logout from "./pages/Logout";
import EditAirports from "./pages/admin/EditAirports";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/admin/airports" element={<Airports />} />
        <Route path="/admin/flights" element={<Flights />} />
        <Route path="logout" element={<Logout/>} />
        <Route path="/admin/edit-airports" element={<EditAirports/>}/>
      </Routes>
    </Router>
  );
}

export default App;
