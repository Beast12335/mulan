const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },
  added: {
    type: String,
    required: true,
    },
  time: {
    type: String,
    required: true,
}
});
const player = mongoose.model('player',schema)
module.exports = player
