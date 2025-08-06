const express = require('express');
const app = express();
const projectRoutes = require('./routes/projectRoutes');
const positionRoutes = require('./routes/positionRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());
app.use('/projects', projectRoutes);
app.use('/positions', positionRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
