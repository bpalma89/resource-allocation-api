const express = require('express');
const app = express();
const projectRoutes = require('./routes/projectRoutes');
const positionRoutes = require('./routes/positionRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const allocationRoutes = require('./routes/allocationRoutes');
const middleware = require('./utils/middleware')

app.use(express.json());
app.use(middleware.requestLogger)

app.use('/projects', projectRoutes);
app.use('/positions', positionRoutes);
app.use('/resources', resourceRoutes);
app.use('/allocations', allocationRoutes);

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
