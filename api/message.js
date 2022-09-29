const Message = require('../models/Message');

module.exports = {
  newMessage: async data => {
    try {
      const newMessage = new Message({ ...data });
      await newMessage.save();
      return { newMessage };
    } catch (error) {
      return { error };
    }
  }
};
