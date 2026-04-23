const CAProfile            = require('../models/CAProfile.model');
const Client               = require('../models/Client.model');
const Service              = require('../models/Service.model');
const Bill                 = require('../models/Bill.model');
const { calculateTDS }     = require('../utils/tds');
const { generatePDF }      = require('../utils/generatePDF');
const { generateBillNumber } = require('../utils/billNumber');
const { formatDate }       = require('../utils/formatters');

const generateBill = async (userId, clientId, overrides = {}) => {
  const { 
    billNumber: manualBillNumber, 
    billDate: manualDate, 
    services: inlineServices,
    companyName, companyAddress, 
    clientName, clientAddress,
    tdsRate, bankName, accountNumber, branchName, ifscCode
  } = overrides;

  const ca = await CAProfile.findOne({ userId });
  if (!ca) {
    const err = new Error('Complete your firm profile before generating a bill');
    err.statusCode = 400;
    throw err;
  }

  const client = await Client.findOne({ _id: clientId, caId: ca._id });
  if (!client) {
    const err = new Error('Client not found');
    err.statusCode = 404;
    throw err;
  }

  let services = await Service.find({ clientId }).sort({ dateAdded: 1 });
  if (inlineServices && inlineServices.length > 0) {
     services = inlineServices.map(s => ({ ...s, amount: Number(s.amount) || 0 }));
  }

  if (!services.length) {
    const err = new Error('No services added for this client yet');
    err.statusCode = 400;
    throw err;
  }

  // Support dynamic TDS if supplied.
  const appliedTdsRate = (tdsRate !== undefined) ? Number(tdsRate) : 10;
  
  // Custom TDS Logic since standard 'calculateTDS' is hardcoded to 10%
  const professionalFeeServices = services.filter(s => s.type !== 'Out of Pocket Expense');
  const totalAmount = services.reduce((acc, s) => acc + s.amount, 0);
  const tdsAmount = professionalFeeServices.reduce((acc, s) => acc + (s.amount * (appliedTdsRate / 100)), 0);
  const netPayable = totalAmount - tdsAmount;

  const billNumber = manualBillNumber || generateBillNumber(ca.billPrefix, ca.billCounter);

  await Bill.create({
    clientId, caId: ca._id, billNumber,
    servicesSnapshot: services,
    totalAmount, tdsAmount, netPayable,
  });

  if (!manualBillNumber) {
    await CAProfile.findByIdAndUpdate(ca._id, { $inc: { billCounter: 1 } });
  }

  try {
    const pdfBuffer = await generatePDF({
      ca, client, services, billNumber,
      date: manualDate ? formatDate(new Date(manualDate)) : formatDate(new Date()),
      totalAmount, tdsAmount, netPayable,
    });
    return { pdfBuffer, billNumber };
  } catch (pdfErr) {
    console.error('PDF GENERATION FAILED:', pdfErr.message);
    console.error('PDF STACK:', pdfErr.stack);
    throw pdfErr;
  }
};

const getBillHistory = async (userId, clientId) => {
  const ca = await CAProfile.findOne({ userId });
  if (!ca) return [];
  return Bill.find({ clientId, caId: ca._id }).sort({ generatedAt: -1 }).select('-servicesSnapshot');
};

const getAllBills = async (userId) => {
  const ca = await CAProfile.findOne({ userId });
  if (!ca) return [];
  // Populate clientId to show company names in history
  return Bill.find({ caId: ca._id })
    .sort({ generatedAt: -1 })
    .populate('clientId', 'name address')
    .select('-servicesSnapshot');
};

module.exports = { generateBill, getBillHistory, getAllBills };
