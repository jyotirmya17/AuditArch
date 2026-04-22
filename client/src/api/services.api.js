import api from './axios';

export const getServices   = (clientId) => api.get(`/services/${clientId}`);
export const addService    = (clientId, data) => api.post(`/services/${clientId}`, data);
export const deleteService = (serviceId) => api.delete(`/services/${serviceId}`);
