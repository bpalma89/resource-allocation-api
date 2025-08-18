const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticateUser = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Token missing or invalid' });
  }

  try {
    const token = authorization.substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'Token invalid' });
    }

    const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied: role is insufficient' });
    }

    next();
  };
}

module.exports =  {
  authenticateUser,
  authorizeRoles
}
