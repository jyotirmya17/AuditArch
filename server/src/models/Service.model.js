const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  clientId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  caId:          { type: mongoose.Schema.Types.ObjectId, ref: 'CAProfile', required: true },
  particulars:   { type: String, required: true },
  financialYear: { type: String, required: true },   // e.g. '24-25'
  amount:        { type: Number, required: true, min: 0 },
  entryType:     { type: String, enum: ['professional', 'ope'], required: true },
  // professional → subject to 10% TDS
  // ope          → Out of Pocket Expense, no TDS
  subNote:       { type: String, default: '' },
  dateAdded:     { type: Date, default: Date.now },
}, { timestamps: true });

ServiceSchema.index({ clientId: 1, dateAdded: 1 });
ServiceSchema.index({ caId: 1 });

module.exports = mongoose.model('Service', ServiceSchema);
