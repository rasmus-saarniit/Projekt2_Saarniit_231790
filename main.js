const express = require('express');
const db = require('./config/database'); 
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const patsiendidRouter = require('./routes/patsiendid');
const kliendidRouter = require('./routes/kliendid');
const liigidRouter = require('./routes/liigid');
const visiididRouter = require('./routes/visiidid');
const haigusloodRouter = require('./routes/haiguslood');
const t99tajadRouter = require('./routes/t99tajad');
const spetsialiseerumisedRouter = require('./routes/spetsialiseerumised');
const cors = require('cors');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all origins

app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Server is running and connected to the database!');
});

app.use('/auth', authRouter);

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VetaBase API',
      version: '1.0.0',
      description: 'API documentation for the veterinary clinic platform',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js', './main.js'],
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

// Global error handler (must be after all routes)
app.use(require('./middleware/errorHandler'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
