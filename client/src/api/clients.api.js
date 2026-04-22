import api from './axios';

export const getClients             = ()       => api.get('/clients');
export const getDeletedClients      = ()       => api.get('/clients/deleted');
export const createClient           = (data)   => api.post('/clients', data);
export const deleteClient           = (id)     => api.delete(`/clients/${id}`);
export const restoreClient          = (id)     => api.patch(`/clients/${id}/restore`);
export const permanentDeleteClient  = (id)     => api.delete(`/clients/${id}/permanent`);

export const getCAProfile = ()       => api.get('/auth/me'); // Re-using auth/me for profile
