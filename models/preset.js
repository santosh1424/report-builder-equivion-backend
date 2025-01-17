const mongoose = require('mongoose');

const presetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  structure: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Preset', presetSchema); 