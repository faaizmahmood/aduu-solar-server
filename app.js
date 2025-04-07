const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const swaggerSetup = require('./src/config/swagger'); // Import Swagger setup
const db = require('./src/config/db')
require("./src/utils/cronJobs");


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
const profileRouter = require('./src/routes/profile/profile');
const projectCreationRouter = require('./src/routes/projectManagement/createProject');
const getProjectsRouter = require('./src/routes/projectManagement/getProjects');
const getSingleProjectsRouter = require('./src/routes/projectManagement/getSingleProject');
const clientProjectRouter = require('./src/routes/projectManagement/viewProject');
const clientOrderServiceRouter = require('./src/routes/projectManagement/orderService');
const addStaffRouter = require('./src/routes/staff/addStaff');
const getStaffRouter = require('./src/routes/staff/getStaff');
const assignStaffRouter = require('./src/routes/staff/assignStaff');
const addServiceRouter = require('./src/routes/services/adminServices/addService');
const getServiceRouter = require('./src/routes/services/adminServices/getServices');
const getSigleServiceRouter = require('./src/routes/services/adminServices/getSingleService');
const updateServiceRouter = require('./src/routes/services/adminServices/editService');
const deleterServiceRouter = require('./src/routes/services/adminServices/deleteServices');
const orderServiceRouter = require('./src/routes/services/userServices/orderServcie');
const createInvoicesRouter = require('./src/routes/invoices/createInvoices');
const getUserInvoicesRouter = require('./src/routes/invoices/getInvoices');
const markAsInvoicesRouter = require('./src/routes/invoices/markAsPaid');


// working with
const signinRouter = require('./src/routes/auth/signin');
const signupRouter = require('./src/routes/auth/signup');
const companyRegisterRouter = require('./src/routes/auth/company');

// ----
const companyRouter = require('./src/routes/company/company');
const dashboardRouter = require('./src/routes/dashboard/dashboard');

app.use('/api/auth', signinRouter);
app.use('/api/auth', companyRegisterRouter);
app.use('/api/auth', signupRouter);
app.use('/api/user', profileRouter);

app.use('/api/project', projectCreationRouter);
app.use('/api/project', clientProjectRouter);
app.use('/api/project', getProjectsRouter);
app.use('/api/project', getSingleProjectsRouter);

app.use('/api/order', clientOrderServiceRouter);

app.use('/api/add', addStaffRouter);
app.use('/api/get', getStaffRouter);
app.use('/api/staff', assignStaffRouter);

app.use('/api/service', addServiceRouter);
app.use('/api/service', getServiceRouter);
app.use('/api/service', getSigleServiceRouter);
app.use('/api/service', updateServiceRouter);
app.use('/api/service', deleterServiceRouter);
app.use('/api/service', orderServiceRouter);

app.use('/api/invoice', createInvoicesRouter);
app.use('/api/invoice', getUserInvoicesRouter);
app.use('/api/invoice', markAsInvoicesRouter);

// --- managed
app.use('/api/company', companyRouter);
app.use('/api/dashboard', dashboardRouter);

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
