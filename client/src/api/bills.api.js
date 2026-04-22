import api from './axios';

// Returns a blob — must set responseType: 'blob'
export const generateBill = (clientId, overrides = {}) =>
  api.post(`/bills/generate/${clientId}`, overrides, { responseType: 'blob' });

export const getBillHistory = (clientId) => api.get(`/bills/history/${clientId}`);

export const getAllBills = () => api.get('/bills/history/all');
