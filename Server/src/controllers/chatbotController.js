export const handleChatbotMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message string is required' });
    }

    const text = message.toLowerCase().trim();
    let reply = '';
    let quickReplies = [];

    if (text.includes('movie') || text.includes('showing') || text.includes('now playing') || text.includes('watch')) {
      reply = "🎬 We currently have blockbuster hits playing including **Dune: Part Two**, **Deadpool & Wolverine**, **Oppenheimer**, and **Inside Out 2**! You can explore trailers, showtimes, and ratings on the Movies page.";
      quickReplies = ['Explore Movies', 'Top Recommendations', 'Book Tickets'];
    } else if (text.includes('book') || text.includes('ticket') || text.includes('how to book')) {
      reply = "🎟️ **Booking is simple:**\n1. Pick your movie from the Home or Movies page.\n2. Choose your preferred theatre & showtime.\n3. Select your favorite seats on the live interactive seat map.\n4. Add delicious popcorn combos.\n5. Apply promo code & complete instant mock checkout to get your Digital QR Ticket!";
      quickReplies = ['View Shows', 'Active Offers', 'Seat Recommendations'];
    } else if (text.includes('seat') || text.includes('smart') || text.includes('best seat')) {
      reply = "💺 **Smart Seat Pick:** Our intelligent algorithm recommends center rows (D, E, F) and center columns (4-7) for the optimal cinematic viewing angle and acoustic sweet spot. Look for the glowing 'Best Pick' badge on the seat map!";
      quickReplies = ['Group Booking', 'View Movies', 'Ticket Pricing'];
    } else if (text.includes('food') || text.includes('popcorn') || text.includes('snack') || text.includes('combo') || text.includes('beverage')) {
      reply = "🍿 We have delicious cinema snacks! Enjoy **Caramel Gold Popcorn (₹220)**, **Cheese Popcorn**, **Nachos Supreme (₹190)**, and our **Blockbuster Duo Combo (₹480)**. You can add them during the booking process.";
      quickReplies = ['Explore Combos', 'Active Offers', 'Book Now'];
    } else if (text.includes('offer') || text.includes('coupon') || text.includes('discount') || text.includes('promo')) {
      reply = "🏷️ **Current Active Offers:**\n• **FIRST50**: 50% off (up to ₹200) on your first booking\n• **WEEKEND20**: 20% off weekend shows\n• **GROUP10**: 10% off when booking 4 or more seats\n• **FOODLOVE**: ₹100 flat off on snacks subtotal above ₹300";
      quickReplies = ['Use FIRST50', 'Explore Movies', 'View Profile'];
    } else if (text.includes('cancel') || text.includes('refund') || text.includes('policy')) {
      reply = "🔄 **Cancellation Policy:** You can easily cancel your booking anytime before showtime from **'My Bookings'** in your profile. 100% of your ticket amount will be instantly refunded to your payment method.";
      quickReplies = ['My Bookings', 'Help Center', 'Contact Support'];
    } else if (text.includes('theatre') || text.includes('cinema') || text.includes('location') || text.includes('screen')) {
      reply = "🏛️ CineBook is available at premium theatres featuring **Dolby Atmos 7.1**, **4K Laser Projection**, and **VIP Recliner seating** across Hyderabad, Bengaluru, Mumbai, and Delhi!";
      quickReplies = ['View Theatres', 'Explore Movies', 'Smart Seats'];
    } else if (text.includes('qr') || text.includes('digital ticket') || text.includes('entry')) {
      reply = "📱 **Digital QR Pass:** Upon booking, a dynamic Digital Ticket is generated with an authentic QR code. Show this QR code at the cinema gate for express paperless entry!";
      quickReplies = ['My Bookings', 'Book Ticket', 'How it Works'];
    } else if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      reply = "👋 Hello there! I'm **CineBot**, your intelligent movie assistant. How can I assist you with your cinema experience today?";
      quickReplies = ['Trending Movies', 'Active Offers', 'Smart Seat Selection', 'How to Book'];
    } else {
      reply = "🍿 I'm here to assist! You can ask me about trending movies, showtimes, smart seat suggestions, popcorn combos, active promo codes, or how to cancel a ticket.";
      quickReplies = ['Trending Movies', 'Active Offers', 'Smart Seats', 'How to Book'];
    }

    res.json({
      success: true,
      reply,
      quickReplies,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
