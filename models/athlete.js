const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const { Schema } = mongoose;

const AthleteSchema = new Schema({
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

module.exports = mongoose.model('Athlete', AthleteSchema);
