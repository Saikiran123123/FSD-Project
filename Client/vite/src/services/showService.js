import API from './api';

export const showService = {
  async getShowsByMovie(tmdbId, date = '', city = '') {
    let url = `/shows/movie/${tmdbId}`;
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (city) params.append('city', city);
    const qs = params.toString();
    if (qs) url += `?${qs}`;
    const res = await API.get(url);
    return res.data;
  },

  async getShowSeats(showId) {
    const res = await API.get(`/shows/${showId}/seats`);
    return res.data;
  },

  async holdSeats(showId, seatIds) {
    const res = await API.post(`/shows/${showId}/hold-seats`, { seatIds });
    return res.data;
  },

  async releaseSeats(showId, seatIds) {
    const res = await API.post(`/shows/${showId}/release-seats`, { seatIds });
    return res.data;
  },

  async getSmartSeats(showId, count = 2, category = 'Gold') {
    const res = await API.get(`/shows/${showId}/smart-seats?count=${count}&category=${category}`);
    return res.data;
  },

  async getGroupSeats(showId, size = 4, category = 'Gold') {
    const res = await API.get(`/shows/${showId}/group-seats?size=${size}&category=${category}`);
    return res.data;
  },
};
