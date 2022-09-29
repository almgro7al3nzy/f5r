const User = require('../models/User');

module.exports = {
  createUser: async data => {
    try {
      const user = await User.findOne({ username: data.username })
        .select('-password')
        .exec();
      if (user) {
        console.log('user already exists');
        return { error: 'user already exists' };
      }
      const newUser = new User({ ...data });
      await newUser.save();
      const nUser = {
        _id: newUser._id,
        user: newUser.username,
        avatarColor: newUser.avatarColor
      };

      return { nUser, msg: 'user created with success' };
    } catch (error) {
      console.log(error);
    }
  },

  login: async data => {
    try {
      const resUser = await User.findOne({ username: data.username }).exec();
      if (!resUser) return { error: 'user does not exist' };

      const doesMatch = data.password === resUser.password;
      if (doesMatch) {
        const user = {
          username: resUser.username,
          _id: resUser._id,
          avatarColor: resUser.avatarColor
        };
        return { user, msg: 'user logged in' };
      }

      return { error: 'username or password does not match' };
    } catch (error) {
      console.log(error);

      return { error };
    }
  },
  getUserById: async id => {
    try {
      const resUser = await User.findById(id)
        .select('-password')
        .exec();
      if (!resUser) return { error: 'user does not exist' };
      return resUser;
    } catch (error) {
      console.log(error);
      return { error };
    }
  }
};
