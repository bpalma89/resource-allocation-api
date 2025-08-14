const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userService.authenticateUser(username, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const userForToken = { id: user.id, username: user.username };
    const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, username: user.username, name: user.name });
  } catch (err) {
    next(err);
  }
};
