const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const { excludeSoftDeleted } = require('../utils/softDeleteUtils');

exports.createResource = async (req, res) => {
  try {
    const resource = await prisma.resource.create({
      data: req.body,
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllResources = async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
          where: excludeSoftDeleted(),
        });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: req.params.id },
    });
    if (!resource || resource.is_deleted) return res.status(404).json({ error: 'Not found' });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateResource = async (req, res) => {
  try {
    const resource = await prisma.resource.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    await prisma.resource.update({
      where: { id: req.params.id },
      data: { is_deleted: true },
    });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
