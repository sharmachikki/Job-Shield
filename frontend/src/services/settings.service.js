import api from './api';

export const settingsService = {
  getPublic: () => api.get('/settings/public').then((r) => r.data),
  getAdmin: () => api.get('/settings/admin').then((r) => r.data),
  update: (payload) => api.put('/settings/admin', payload).then((r) => r.data),
};
