const serverless = require("serverless-http");
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const courseRoutes = require('./routes/courseRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();
app.use(bodyParser.json());

// Include the course and subscription routes
app.use('/api', courseRoutes);
app.use('/api', subscriptionRoutes);

// Start the server
const port = process.env.PORT || 8082;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports.handler = serverless(app);