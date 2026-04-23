const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route files
const auth = require('./routes/auth');
const batches = require('./routes/batches');
const sessions = require('./routes/sessions');
const attendance = require('./routes/attendance');
const summary = require('./routes/summary');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/batches', batches);
app.use('/api/sessions', sessions);
app.use('/api/attendance', attendance);
app.use('/api/summary', summary);

// Basic route
app.get('/', (req, res) => {
  res.send('SkillBridge API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
