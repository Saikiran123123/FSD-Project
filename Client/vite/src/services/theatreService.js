import API from './api';

export const theatreService = {
  async getTheatres(city = '') {
    const url = city ? `/theatres?city=${encodeURIComponent(city)}` : '/theatres';
    const res = await API.get(url);
    return res.data;
  },

  async getTheatreById(id) {
    const res = await API.get(`/theatres/${id}`);
    return res.data;
  },
};
