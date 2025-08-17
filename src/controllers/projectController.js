const projectService = require('../services/projectService');

exports.getAllProjects = async (req, res, next) => {
  try {
    const items = await projectService.getAllProjects();
    res.json(items);
  } catch (err) { next(err); }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const item = await projectService.getProjectById(req.params.id);
    if (!item || item.is_deleted) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.createProject = async (req, res, next) => {
  try {
    const data = { ...req.body, createdById: req.user.id, created_on: new Date() };
    const item = await projectService.createProject(data);
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.updateProject = async (req, res, next) => {
  try {
    const data = { ...req.body, modifiedById: req.user.id, modified_on: new Date() };
    const item = await projectService.updateProject(req.params.id, data);
    res.json(item);
  } catch (err) { next(err); }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const data = { is_deleted: true, modifiedById: req.user.id, modified_on: new Date() };
    await projectService.deleteProject(req.params.id, data);
    res.status(204).end();
  } catch (err) { next(err); }
};

exports.getProjectPositions = async (req, res, next) => {
  try {
    const project = await projectService.getProjectPositions(req.params.id);

    if (!project || project.is_deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project.positions);
  } catch (error) {
    next(error);
  }
};