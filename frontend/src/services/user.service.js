import api from './api';

export const userService = {
  me: () => api.get('/users/me').then((r) => r.data),
  update: (id, payload) => api.put(`/users/${id}`, payload).then((r) => r.data),
};
