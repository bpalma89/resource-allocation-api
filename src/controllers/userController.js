const userService = require('../services/userService');
const { isValidRole } = require('../utils/validator');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { username, name, email, password, role } = req.body;

    if (!isValidRole(role)) {
      return res.status(400).json({
        error: `Invalid role. Allowed roles are: admin, editor, viewer.`,
      });
    }

    const user = await userService.createUser({ username, name, email, password, role });
    res.status(201).json({ id: user.id, username: user.username });
  } catch (err) {
    next(err);
  }
};
