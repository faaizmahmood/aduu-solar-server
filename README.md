# Backend – Client Portal App (Node.js + Express + MongoDB)

This is the backend for the Client Portal App MVP developed for a B2B Solar Services Company. It powers the API used by the frontend to manage users, projects, services, messaging, and file uploads.

---

## 🛠️ Tech Stack

- Node.js + Express.js – REST API Framework
- MongoDB + Mongoose – NoSQL database and ODM
- JWT – Authentication and Authorization
- dotenv – Environment variable management
- CORS – Cross-origin support for frontend integration

---

## ⚙️ Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/faaizmahmood/aduu-solar-server.git
cd aduu-solar-server

### 2. Install Dependencies
npm install


### 3. Configure Environment Variables
Create a .env file in the root directory with the following structure:

MONGO_URL=your-mongodb-connection-string
SECRETEJWTKEY=your-jwt-secret-key


### 4. Run the Server (Development)
npm run dev
API will be running at:
http://localhost:5000/api


🔐 Authentication
JWT-based login system
Role-based access: Admin, Staff, Client
Protect routes using middleware

📂 Project Structure
src/
├── models/         # Mongoose schemas (User, Project, Service, etc.)
├── routes/         # Express route handlers
├── middlewares/    # Authentication, error handling, etc.
├── utils/          # Helper functions
├── sockets/        # For web sockets
├── app.js          # Entry point
└── config/         # MongoDB and AWS S3 configuration


🔌 API Endpoints (Sample)
POST /api//auth/signin – Login user
GET  /api/project/get-projects – Fetch all projects for logged-in user
POST /api/project/create-project – Create a new project
POST /api/invoice/get-invoices/:id – Order a service

📦 Deployment
Deployed on AWS App Runner (test version)
Backend integrates with Vercel-hosted frontend
Uses MongoDB Atlas for database hosting