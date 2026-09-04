const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/environment');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploaded documents/resumes/attachments
app.use('/uploads', express.static('uploads'));

app.get('/health', (req, res) => res.json({ status: 'ok', env: env.nodeEnv }));

app.use(env.apiPrefix, routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
