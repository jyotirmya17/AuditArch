const CAProfile = require('../models/CAProfile.model');
const Client    = require('../models/Client.model');
const Service   = require('../models/Service.model');

const getServices = async (userId, clientId) => {
  const ca = await CAProfile.findOne({ userId });
  if (!ca) return [];

  // Verify client belongs to this CA
  const client = await Client.findOne({ _id: clientId, caId: ca._id });
  if (!client) {
    const err = new Error('Client not found');
    err.statusCode = 404;
    throw err;
  }

  return Service.find({ clientId }).sort({ dateAdded: 1 });
};

const addService = async (userId, clientId, data) => {
  const ca = await CAProfile.findOne({ userId });
  if (!ca) {
    const err = new Error('Complete your firm profile first');
    err.statusCode = 400;
    throw err;
  }

  const client = await Client.findOne({ _id: clientId, caId: ca._id });
  if (!client) {
    const err = new Error('Client not found');
    err.statusCode = 404;
    throw err;
  }

  return Service.create({ ...data, clientId, caId: ca._id });
};

const deleteService = async (userId, serviceId) => {
  const ca = await CAProfile.findOne({ userId });
  if (!ca) {
    const err = new Error('Profile not found');
    err.statusCode = 404;
    throw err;
  }

  const service = await Service.findOne({ _id: serviceId, caId: ca._id });
  if (!service) {
    const err = new Error('Service not found');
    err.statusCode = 404;
    throw err;
  }

  await Service.findByIdAndDelete(serviceId);
};

module.exports = { getServices, addService, deleteService };
