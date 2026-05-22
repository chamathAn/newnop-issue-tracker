const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const users = await User.find().select('name email').sort('name');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
