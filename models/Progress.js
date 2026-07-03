const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  checked: { type: [String], default: [] },
  lessonProgress: {
    current: { type: Number, default: 0 },
    completed: { type: [Number], default: [] },
    codeDone: { type: Map, of: Boolean, default: {} },
    practiceDone: { type: Map, of: Boolean, default: {} },
    notes: { type: Map, of: String, default: {} },
  },
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
