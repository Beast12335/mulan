const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  teams: {
    type: String,
    required: true,
  },
  tags: {
    type: [],
    },
  dc: {
    type: [],
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
