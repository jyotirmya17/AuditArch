const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  caId:    { type: mongoose.Schema.Types.ObjectId, ref: 'CAProfile', required: true },
  name:    { type: String, required: true, trim: true },
  address: { type: String, required: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

ClientSchema.index({ caId: 1 });

module.exports = mongoose.model('Client', ClientSchema);
