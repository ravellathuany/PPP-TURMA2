const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Swagger setup - load from file
const swaggerPath = path.join(__dirname, '..', 'resources', 'swagger.json');
let swaggerDoc = {};
try {
  swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
} catch (e) {
  console.warn('Swagger file not found yet.');
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, { swaggerOptions: { persistAuthorization: true } }));

app.use('/api', routes);

// Multer and other error handler
app.use((err, req, res, next) => {
  if (err && (err.name === 'MulterError' || /arquivo/i.test(err.message))) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

// Global 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
