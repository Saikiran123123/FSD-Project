const Home = () => {
  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Book Tickets for the Latest Blockbusters</h1>
          <p>Experience cinema like never before.</p>
          <button className="primary-btn">Browse Movies</button>
        </div>
      </section>

      <section className="movies-section">
        <h2>Now Showing</h2>
        <div className="movie-grid">
          <div className="movie-card">Movie 1</div>
          <div className="movie-card">Movie 2</div>
          <div className="movie-card">Movie 3</div>
          <div className="movie-card">Movie 4</div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h3>⚡ Fast Booking</h3>
          <p>Book tickets in seconds with a smooth interface.</p>
        </div>
        <div className="feature">
          <h3>💺 Easy Seat Selection</h3>
          <p>Select your favorite seats with a visual layout.</p>
        </div>
        <div className="feature">
          <h3>🔒 Secure Payments</h3>
          <p>Your transactions are safe and encrypted.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
