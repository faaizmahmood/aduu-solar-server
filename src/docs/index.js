const authDocs = require('./auth'); // Import all authentication docs
const profileDocs = require('./profile');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

module.exports = {
  ...authDocs,
  ...profileDocs
};
