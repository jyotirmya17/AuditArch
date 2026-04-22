const CAProfile = require('../models/CAProfile.model');
const Client    = require('../models/Client.model');
const Service   = require('../models/Service.model');
const Bill      = require('../models/Bill.model');

const getClientsForCA = async (userId) => {
  const ca = await CAProfile.findOne({ userId });
  if (!ca) return [];

  // Aggregation to find clients and their most recent bill's generatedAt date
  return Client.aggregate([
    { $match: { caId: ca._id, isDeleted: false } },
    {
      $lookup: {
        from: 'bills',
        localField: '_id',
        foreignField: 'clientId',
        as: 'lastBill'
      }
    },
    {
      $addFields: {
        lastBillDate: { 
          $let: {
            vars: {
              sortedBills: { $sortArray: { input: '$lastBill', sortBy: { generatedAt: -1 } } }
            },
            in: { $arrayElemAt: ['$$sortedBills.generatedAt', 0] }
          }
        }
      }
    },
    { $project: { lastBill: 0 } },
    { $sort: { createdAt: -1 } }
  ]);
};

const createClient = async (userId, data) => {
  const ca = await CAProfile.findOne({ userId });
  if (!ca) {
    const err = new Error('Complete your firm profile before adding clients');
    err.statusCode = 400;
    throw err;
  }
  return Client.create({ ...data, caId: ca._id });
};

const deleteClient = async (userId, clientId) => {
  const ca = await CAProfile.findOne({ userId });
  if (!ca) {
    const err = new Error('Profile not found');
    err.statusCode = 404;
    throw err;
  }

  const client = await Client.findOne({ _id: clientId, caId: ca._id });
  if (!client) {
    const err = new Error('Client not found');
    err.statusCode = 404;
    throw err;
  }

  // Soft Delete
  client.isDeleted = true;
  await client.save();
};

const getDeletedClientsForCA = async (userId) => {
  const ca = await CAProfile.findOne({ userId });
  if (!ca) return [];

  return Client.aggregate([
    { $match: { caId: ca._id, isDeleted: true } },
    {
      $lookup: {
        from: 'bills',
        localField: '_id',
        foreignField: 'clientId',
        as: 'lastBill'
      }
    },
    {
      $addFields: {
        lastBillDate: { 
          $let: {
            vars: {
              sortedBills: { $sortArray: { input: '$lastBill', sortBy: { generatedAt: -1 } } }
            },
            in: { $arrayElemAt: ['$$sortedBills.generatedAt', 0] }
          }
        }
      }
    },
    { $project: { lastBill: 0 } },
    { $sort: { updatedAt: -1 } }
  ]);
};

const restoreClient = async (userId, clientId) => {
  const ca = await CAProfile.findOne({ userId });
  if (!ca) {
    const err = new Error('Restore Error: Associated Firm Profile not found.');
    err.statusCode = 404;
    throw err;
  }

  const client = await Client.findOne({ _id: clientId, caId: ca._id });
  if (!client) {
    const err = new Error('Restore Error: Client record physically missing from database.');
    err.statusCode = 404;
    throw err;
  }

  if (client.isDeleted === false) {
    const err = new Error('Restore Notice: Client is already active.');
    err.statusCode = 400;
    throw err;
  }

  client.isDeleted = false;
  await client.save();
};

const permanentDeleteClient = async (userId, clientId) => {
  const ca = await CAProfile.findOne({ userId });
  if (!ca) {
    const err = new Error('Profile not found');
    err.statusCode = 404;
    throw err;
  }

  const client = await Client.findOne({ _id: clientId, caId: ca._id, isDeleted: true });
  if (!client) {
    const err = new Error('Client record not found in Recycle Bin');
    err.statusCode = 404;
    throw err;
  }

  // Delete all services for this client
  await Service.deleteMany({ clientId });
  await Client.findByIdAndDelete(clientId);
};

module.exports = { 
  getClientsForCA, 
  createClient, 
  deleteClient,
  getDeletedClientsForCA,
  restoreClient,
  permanentDeleteClient
};
