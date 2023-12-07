const mongoose = require('mongoose');

const { Schema } = mongoose;

const StaffSchema = new Schema({
  image: {
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
  designation: { type: String, required: true },
  bio: { type: String, required: true },
});

StaffSchema.virtual('fullName').get(function () {
  return `${this.lastName}, ${this.firstName}`;
});

StaffSchema.virtual('url').get(function () {
  return `/staff/${this._id}`;
});

module.exports = mongoose.model('Staff', StaffSchema);
