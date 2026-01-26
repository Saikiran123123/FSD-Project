import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "20px", background: "#111", color: "#fff" }}>
      <h2 style={{ display: "inline-block", marginRight: "20px" }}>CineVerse</h2>

      <Link to="/" style={{ marginRight: "15px", color: "#fff" }}>Home</Link>
      <Link to="/movies" style={{ marginRight: "15px", color: "#fff" }}>Movies</Link>
      <Link to="/releases" style={{ marginRight: "15px", color: "#fff" }}>Releases</Link>
      <Link to="/contacts" style={{ marginRight: "15px", color: "#fff" }}>Contact</Link>
      <Link to="/booking" style={{ marginRight: "15px", color: "#fff" }}>Booking</Link>
      <Link to="/login" style={{ marginRight: "15px", color: "#fff" }}>Login</Link>
    </nav>
  );
}

export default Navbar;