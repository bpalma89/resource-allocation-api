const express = require('express');
const projectRoutes = require('./routes/projectRoutes');
const positionRoutes = require('./routes/positionRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const allocationRoutes = require('./routes/allocationRoutes');
const userRoutes = require('./routes/userRoutes');
const middleware = require('./utils/middleware')

const app = express();

app.use(express.json());
app.use(middleware.requestLogger)

app.use('/projects', projectRoutes);
app.use('/positions', positionRoutes);
app.use('/resources', resourceRoutes);
app.use('/allocations', allocationRoutes);
app.use('/users', userRoutes);

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app;
