const Room = require('../models/Room');
const User = require('../models/User');
const Message = require('../models/Message');

module.exports = {
  getRoom: async name => {
    try {
      const room = await Room.findOne({ name }).exec();
      console.log(room);
      return room;
    } catch (error) {
      console.log(error);
    }
  },
  createRoom: async name => {
    try {
      const room = await Room.findOne({ name }).exec();
      if (room) {
        console.log('already exists');
        return;
      }
      const newRoom = new Room({ name });
      await newRoom.save();
      console.log('new room', newRoom);
      return newRoom;
    } catch (error) {
      console.log(error);
    }
  },
  newUserInTheRoom: async userId => {
    try {
      const room = await Room.findOne({ name: 'main channel' }).exec();
      const alredyExists = room.users.includes(userId);
      if (alredyExists) {
        console.log('already in the room');
        return;
      }
      const user = await User.findById(userId)
        .select('-password')
        .exec();
      if (user) {
        await room.users.push(userId);
        await room.save();
        console.log('new user in the room');
        return { msg: 'new user has arrived', user };
      }
      console.log('wtf nao tem user');

      return { error: 'the user id does not exist' };
    } catch (error) {
      console.log('error:', error);

      throw new Error(error);
    }
  },

  getAllUsers: async () => {
    try {
      const room = await Room.findOne({ name: 'main channel' }).exec();
      const users = await User.find({ _id: { $in: room.users } })
        .select('-password')
        .exec();
      return { users };
    } catch (error) {
      return { error };
    }
  },

  newMessage: async messageId => {
    try {
      const room = await Room.findOne({ name: 'main channel' }).exec();
      room.messages.push(messageId);
      room.save();
    } catch (error) {
      return { error };
    }
  },

  getAllMessages: async (limit = 0, skip = 0) => {
    try {
      const room = await Room.findOne({ name: 'main channel' }).exec();
      const resMessages = await Message.find({ _id: { $in: room.messages } })
        .skip(skip)
        .limit(limit)
        .exec();

      const usersIdFromMessages = resMessages.map(msg => msg.user);

      const users = await User.find({ _id: { $in: usersIdFromMessages } })
        .select('-password')
        .exec();

      let messages = resMessages.map(message => {
        let user = null;
        for (const [index, usr] of users.entries()) {
          if (message.user.toString() === usr._id.toString()) {
            user = users[index];
            break;
          }
        }
        return {
          user,
          body: message.body,
          date: message.date,
          _id: message._id
        };
      });
      return { messages };
    } catch (error) {
      console.log(error);
      return { error };
    }
  }
};
