const mongoose = require('mongoose');

const CAProfileSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  firmName:       { type: String, required: true, trim: true },
  designation:    { type: String, default: 'Chartered Accountants' },
  addressLine1:   { type: String, required: true },
  addressLine2:   { type: String, default: '' },
  city:           { type: String, default: 'Jaipur' },
  bankHolderName: { type: String, required: true },
  accountNumber:  { type: String, required: true },
  bankName:       { type: String, required: true },
  branchName:     { type: String, required: true },
  ifscCode:       { type: String, required: true },
  billPrefix:     { type: String, required: true, default: 'CA' },
  billCounter:    { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('CAProfile', CAProfileSchema);
