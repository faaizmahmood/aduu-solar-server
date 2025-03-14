const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const swaggerSetup = require('./src/config/swagger'); // Import Swagger setup
const db = require('./src/config/db')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://aduu-solar.vercel.app'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.use(morgan('dev'));

// Initialize Swagger
swaggerSetup(app);

// Routes
const signinRouter = require('./src/routes/auth/signin');
const signupRouter = require('./src/routes/auth/signup');
const profileRouter = require('./src/routes/profile/profile');
const projectCreationRouter = require('./src/routes/projectManagement/createProject');
const clientProjectRouter = require('./src/routes/projectManagement/viewProject');
const clientOrderServiceRouter = require('./src/routes/projectManagement/orderService');
const addStaffRouter = require('./src/routes/staff/addStaff');
const getStaffRouter = require('./src/routes/staff/getStaff');

app.use('/api/auth', signinRouter);
app.use('/api/auth', signupRouter);
app.use('/api/user', profileRouter);
app.use('/api/project', projectCreationRouter);
app.use('/api/project', clientProjectRouter);
app.use('/api/order', clientOrderServiceRouter);
app.use('/api/add', addStaffRouter);
app.use('/api/get', getStaffRouter);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Express is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});
