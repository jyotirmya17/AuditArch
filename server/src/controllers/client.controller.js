const ClientService = require('../services/client.service');

const getClients = async (req, res, next) => {
  try {
    const clients = await ClientService.getClientsForCA(req.user._id);
    res.json({ success: true, data: clients });
  } catch (err) { next(err); }
};

const createClient = async (req, res, next) => {
  try {
    const client = await ClientService.createClient(req.user._id, req.validatedData);
    res.status(201).json({ success: true, data: client });
  } catch (err) { next(err); }
};

const deleteClient = async (req, res, next) => {
  try {
    await ClientService.deleteClient(req.user._id, req.params.id);
    res.json({ success: true, message: 'Client moved to recycle bin' });
  } catch (err) { next(err); }
};

const getDeletedClients = async (req, res, next) => {
  try {
    const clients = await ClientService.getDeletedClientsForCA(req.user._id);
    res.json({ success: true, data: clients });
  } catch (err) { next(err); }
};

const restoreClient = async (req, res, next) => {
  try {
    await ClientService.restoreClient(req.user._id, req.params.id);
    res.json({ success: true, message: 'Client restored successfully' });
  } catch (err) { next(err); }
};

const permanentDeleteClient = async (req, res, next) => {
  try {
    await ClientService.permanentDeleteClient(req.user._id, req.params.id);
    res.json({ success: true, message: 'Client permanently deleted' });
  } catch (err) { next(err); }
};

module.exports = { 
  getClients, 
  createClient, 
  deleteClient,
  getDeletedClients,
  restoreClient,
  permanentDeleteClient
};
