const ServiceService = require('../services/service.service');

const getServices = async (req, res, next) => {
  try {
    const services = await ServiceService.getServices(req.user._id, req.params.clientId);
    res.json({ success: true, data: services });
  } catch (err) { next(err); }
};

const addService = async (req, res, next) => {
  try {
    const service = await ServiceService.addService(
      req.user._id, req.params.clientId, req.validatedData
    );
    res.status(201).json({ success: true, data: service });
  } catch (err) { next(err); }
};

const deleteService = async (req, res, next) => {
  try {
    await ServiceService.deleteService(req.user._id, req.params.serviceId);
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) { next(err); }
};

module.exports = { getServices, addService, deleteService };
