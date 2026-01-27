const Home = () => {
  return (
    <div className="home">

      {/* 🎬 HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>Your Ticket to the <span>Best Movies</span></h1>
          <p>Book Now and Enjoy the Show!</p>
          <button className="primary-btn">Book Tickets</button>
        </div>
      </section>

      {/* 🎟 NOW SHOWING */}
      <section className="ticket-section">
        <h2 className="section-title">Now Showing</h2>
        <div className="ticket-row">
          <div className="ticket-card">Action Saga<button>Book Now</button></div>
          <div className="ticket-card">Galactic Quest<button>Book Now</button></div>
          <div className="ticket-card">Mystery Manor<button>Book Now</button></div>
          <div className="ticket-card">Romantic Escape<button>Book Now</button></div>
        </div>
      </section>

      {/* ⭐ FEATURES */}
      <section className="features">
        <h2 className="section-title">Why Choose CineBook?</h2>
        <div className="feature-row">
          <div className="feature-card">⚡ Easy Booking</div>
          <div className="feature-card">🎥 Best Experience</div>
          <div className="feature-card">🔒 Secure Payments</div>
        </div>
      </section>

    </div>
  );
};

export default Home;
