require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const issuesRoutes = require('./routes/issues.routes');
const usersRoutes = require('./routes/users.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();


app.use(cors({ origin: "newnop-issue-tracker-puce.vercel.app", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/issues', issuesRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
