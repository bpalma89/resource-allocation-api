const express = require('express');
const app = express();
const projectRoutes = require('./routes/projectRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());

// Routes
app.use('/projects', projectRoutes);

// Global error handler (after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
