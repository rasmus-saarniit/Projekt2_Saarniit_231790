const express = require('express');
const db = require('./config/database'); // This will authenticate and connect
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const patsiendidRouter = require('./routes/patsiendid');
const kliendidRouter = require('./routes/kliendid');
const liigidRouter = require('./routes/liigid');
const visiididRouter = require('./routes/visiidid');
const haigusloodRouter = require('./routes/haiguslood');
const t99tajadRouter = require('./routes/t99tajad');
const spetsialiseerumisedRouter = require('./routes/spetsialiseerumised');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (optional)
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Server is running and connected to the database!');
});

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VetaBase API',
      version: '1.0.0',
      description: 'API documentation for the veterinary clinic platform',
    },
  },
  apis: ['./routes/*.js', './main.js'], // Path to the API docs
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/patsiendid', patsiendidRouter);
app.use('/kliendid', kliendidRouter);
app.use('/liigid', liigidRouter);
app.use('/visiidid', visiididRouter);
app.use('/haiguslood', haigusloodRouter);
app.use('/tootajad', t99tajadRouter);
app.use('/spetsialiseerumised', spetsialiseerumisedRouter);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
