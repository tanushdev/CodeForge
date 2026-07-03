const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  checked: { type: [String], default: [] },
  lessonProgress: {
    current: { type: Number, default: 0 },
    completed: { type: [Number], default: [] },
    codeDone: { type: Map, of: Boolean, default: {} },
    practiceDone: { type: Map, of: Boolean, default: {} },
    notes: { type: Map, of: String, default: {} },
  },
  reviewSchedule: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
  designGrades: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    email: this.email,
    checked: this.checked,
    lessonProgress: {
      current: this.lessonProgress.current,
      completed: this.lessonProgress.completed,
      codeDone: Object.fromEntries(this.lessonProgress.codeDone || new Map()),
      practiceDone: Object.fromEntries(this.lessonProgress.practiceDone || new Map()),
      notes: Object.fromEntries(this.lessonProgress.notes || new Map()),
    },
    reviewSchedule: Object.fromEntries((this.reviewSchedule || new Map()).entries()),
    designGrades: Object.fromEntries((this.designGrades || new Map()).entries()),
  };
};

module.exports = mongoose.model('User', userSchema);
