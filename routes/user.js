const express = require('express'),
  router = express.Router();

const apiUser = require('../api/user');

router.post('/cadastrar', async (req, res) => {
  try {
    const { nUser: newUser, msg } = await apiUser.createUser(req.body);
    res.status(201).json({ newUser, msg });
  } catch (error) {
    return res.status(404).json(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { user, msg } = await apiUser.login(req.body);
    if (user) {
      return res.status(200).json({ user, msg });
    }
    return res.status(404).json({ msg: 'user not found' });
  } catch (error) {
    return res.status(404).json(error);
  }
});

module.exports = router;
