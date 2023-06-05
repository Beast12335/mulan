const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  teams: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    },
  dc: {
    type: String,
    },
  img1:{
    type: String,
    },
  img2: {
    type: String,
    }
});
const match = mongoose.model('match',schema)
module.exports = match
