require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const issuesRoutes = require('./routes/issues.routes');
const usersRoutes = require('./routes/users.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const corsOrigins =
  process.env.NODE_ENV === 'production'
    ? ['newnop-issue-tracker-g797mogtn-chamath-anjulas-projects.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8000'];
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/issues', issuesRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
