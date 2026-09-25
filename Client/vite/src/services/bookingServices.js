import API from './api';

export const foodService = {
  async getFoodItems(category = '') {
    const url = category && category !== 'All' ? `/food?category=${category}` : '/food';
    const res = await API.get(url);
    return res.data;
  },
};

export const offerService = {
  async getActiveOffers() {
    const res = await API.get('/offers');
    return res.data;
  },

  async validateOffer(payload) {
    const res = await API.post('/offers/validate', payload);
    return res.data;
  },
};

export const bookingService = {
  async initiatePayment(payload) {
    const res = await API.post('/payment/initiate', payload);
    return res.data;
  },

  async verifyPayment(payload) {
    const res = await API.post('/payment/verify', payload);
    return res.data;
  },

  async createBooking(payload) {
    const res = await API.post('/bookings', payload);
    return res.data;
  },

  async getMyBookings() {
    const res = await API.get('/bookings/my-bookings');
    return res.data;
  },

  async getBookingById(id) {
    const res = await API.get(`/bookings/${id}`);
    return res.data;
  },

  async cancelBooking(id) {
    const res = await API.put(`/bookings/${id}/cancel`);
    return res.data;
  },
};

export const reviewService = {
  async getReviews(params) {
    const qs = new URLSearchParams(params).toString();
    const res = await API.get(`/reviews?${qs}`);
    return res.data;
  },

  async createReview(payload) {
    const res = await API.post('/reviews', payload);
    return res.data;
  },

  async likeReview(id) {
    const res = await API.post(`/reviews/${id}/like`);
    return res.data;
  },
};

export const chatbotService = {
  async sendMessage(message) {
    const res = await API.post('/chatbot/message', { message });
    return res.data;
  },
};

export const recommendationService = {
  async getMovieRecommendations() {
    const res = await API.get('/recommendations/movies');
    return res.data;
  },
};

export const adminService = {
  async getDashboardStats() {
    const res = await API.get('/admin/dashboard');
    return res.data;
  },
};
