const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const { Schema } = mongoose;

const AthleteSchema = new Schema({
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
  sex: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
  dateOfBirth: { type: Date, required: true },
});

AthleteSchema.virtual('fullName').get(function () {
  return `${this.lastName}, ${this.firstName}`;
});

AthleteSchema.virtual('url').get(function () {
  return `/athletes/${this._id}`;
});

AthleteSchema.virtual('dateOfBirthFormatted').get(function () {
  return DateTime.fromJSDate(this.dateOfBirth).toLocaleString(DateTime.DATE_MED);
});

AthleteSchema.virtual('dateOfBirthForm').get(function () {
  return DateTime.fromJSDate(this.dateOfBirth).toISODate();
});
module.exports = mongoose.model('Athlete', AthleteSchema);
