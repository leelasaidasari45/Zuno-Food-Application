// config/db.js
// This file connects our Node.js app to MongoDB using Mongoose

const mongoose = require("mongoose");

// connectDB is an async function because connecting to DB takes time
const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise, so we await it
    // process.env.MONGO_URI reads the URI from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If connection is successful, log the host name
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and stop the app
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // exit with failure code
  }
};

module.exports = connectDB;
