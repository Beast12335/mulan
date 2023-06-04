const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

  teams: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
    },
  dc: {
    type: String,
    required: true,
    },
  img1:{
    type: String,
    required: true,
    },
  img2: {
    type: String,
    required: true,
    }
});
const match = mongoose.model('match',schema)
module.exports = match
