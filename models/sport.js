const mongoose = require('mongoose');

const { Schema } = mongoose;

const SportSchema = new Schema({
  name: { type: String, required: true },
  athletes: { type: mongoose.Schema.Types.ObjectId, ref: 'Athlete', required: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
});

SportSchema.virtual('url').get(() => `/sport/${this.name}`);

module.exports = mongoose.model('Sport', SportSchema);
