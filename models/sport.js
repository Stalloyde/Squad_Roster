const mongoose = require('mongoose');

const { Schema } = mongoose;

const SportSchema = new Schema({
  name: { type: String, required: true },
});

SportSchema.virtual('url').get(function () {
  return `/sports/${this.name}`;
});

module.exports = mongoose.model('Sport', SportSchema);
