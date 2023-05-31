const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },

  guildId: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("beast", schema);
