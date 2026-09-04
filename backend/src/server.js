const app = require('./app');
const env = require('./config/environment');

const server = app.listen(env.port, () => {
  console.log(`Job Portal API running on port ${env.port} [${env.nodeEnv}]`);
  console.log(`API base: http://localhost:${env.port}${env.apiPrefix}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
