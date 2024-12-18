// File: /config/aws-config.js
const AWS = require('aws-sdk');
require('dotenv').config()

// Configure the region
AWS.config.update({
    region: process.env.AWS_REGION // Change this to the region of your S3 bucket
});

// Optionally configure the credentials here, or better use environment variables
AWS.config.credentials = new AWS.Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // It's safer to use environment variables
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Export configured S3 instance
const s3 = new AWS.S3();
module.exports = s3;
