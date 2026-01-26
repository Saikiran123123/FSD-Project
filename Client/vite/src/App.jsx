import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Releases from "./pages/Releases";
import Contacts from "./pages/Contacts";
import Booking from "./pages/Booking";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/releases" element={<Releases />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;