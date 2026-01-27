import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Booking from "./pages/Booking";
import Contact from "./pages/Contacts";
import "./App.css";
import ChatBot from "./components/Chatbot";

const App = () => {
  return (
    <Router>
      <nav className="navbar">
        <h2 className="logo">🎬 CineBook</h2>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/Movies">Movies</Link>
          <Link to="/Booking">Booking</Link>
          <Link to="/Contact">Contact</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <ChatBot/>
    </Router>
  );
};

export default App;
