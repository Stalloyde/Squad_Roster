const mongoose = require('mongoose');

const { Schema } = mongoose;

const Staff = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
  designation: { type: String, required: true },
  bio: { type: String, required: true },
});

Staff.virtual('fullName').get(function () {
  return `${this.lastName}, ${this.firstName}`;
});

Staff.virtual('url').get(() => `/staff/${this._id}`);

module.exports = mongoose.model('Staff', Staff);
