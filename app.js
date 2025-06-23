const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();

connectDB();


app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/profile', require('./routes/profile.route'));
app.use('/api/applications', require('./routes/application.route'));
app.use('/api/multi-apply', require('./routes/multiApply.route'));
app.use('/api/templates', require('./routes/template.route'));
app.use('/api/resume', require('./routes/resume.route'));
app.use('/api/plans', require('./routes/plan.route'));


module.exports = app;
