const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },

  tag: {
    type: String,
    required: true,
  }
});
const claim = mongoose.model('claim',schema)
module.exports = claim
