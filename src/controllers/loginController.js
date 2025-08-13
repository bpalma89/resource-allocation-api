const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    const passwordCorrect = user && await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrect) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const userForToken = { id: user.id, username: user.username };
    const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, username: user.username, name: user.name });
  } catch (err) {
    next(err);
  }
};
