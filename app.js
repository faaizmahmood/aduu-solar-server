const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const swaggerSetup = require('./src/config/swagger'); // Import Swagger setup
const db = require('./src/config/db');
require("./src/utils/cronJobs");
const http = require('http');
const { Server } = require('socket.io');  // Import socket.io
const registerMessagingSocket = require('./src/sockets/messagingSocket');

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://aduu-solar.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket Events
registerMessagingSocket(io)

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
const authRouter = require('./src/routes/auth/index');
const profileRouter = require('./src/routes/profile/profile');
const dashboardRouter = require('./src/routes/dashboard/index');
const companyRouter = require('./src/routes/company/index');
const invoicesRouter = require('./src/routes/invoices/index');
const projectRouter = require('./src/routes/project/index');
const serviceRouter = require('./src/routes/services/index');
const staffRouter = require('./src/routes/staff/index');
const messageRouter = require('./src/routes/messages/index');

app.use('/api/auth', authRouter);
app.use('/api/company', companyRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/invoice', invoicesRouter);
app.use('/api/profile', profileRouter);
app.use('/api/project', projectRouter);
app.use('/api/service', serviceRouter);
app.use('/api/staff', staffRouter);
app.use('/api/message', messageRouter);

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
server.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});
