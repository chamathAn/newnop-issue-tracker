const express = require('express');
const prisma = require('../config/prisma');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    });
    res.json(users.map(({ id, ...rest }) => ({ _id: id, ...rest })));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
