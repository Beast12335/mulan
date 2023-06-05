const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  tag: {
    type: String,
  },

  image: {
    type: String,
  },
  added: {
    type: String,
    },
  time: {
    type: String,
}
});
const player = mongoose.model('player',schema)
module.exports = player
