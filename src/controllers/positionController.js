const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const { excludeSoftDeleted } = require('../utils/softDeleteUtils');

exports.getAllPositions = async (req, res) => {
  try {
    const positions = await prisma.position.findMany({ where: { is_deleted: false } });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPositionById = async (req, res) => {
  try {
    const position = await prisma.position.findUnique({
      where: { id: req.params.id },
    });
    if (!position || position.is_deleted) return res.status(404).json({ error: 'Not found' });
    res.json(position);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPosition = async (req, res) => {
  try {
    const position = await prisma.position.create({
      data: req.body,
    });
    res.status(201).json(position);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePosition = async (req, res) => {
  try {
    const position = await prisma.position.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(position);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePosition = async (req, res) => {
  try {
    await prisma.position.update({
      where: { id: req.params.id },
      data: { is_deleted: true },
    });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
