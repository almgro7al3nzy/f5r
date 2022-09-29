const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  users: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  messages: {
    type: [Schema.Types.ObjectId],
    default: []
  }
});

module.exports = Room = mongoose.model('room', RoomSchema);
