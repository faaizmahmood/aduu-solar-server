const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aduu Solar Client Portal MVP API',
      version: '1.0.0',
      description: 'API documentation for Aduu Solar Client Portal',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./src/docs/*.js'], // Load all docs from the docs folder
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerSetup;
