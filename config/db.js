const mongoose = require('mongoose');

const connectDB = async (uri = process.env.MONGODB_URI) => {
  try {
    // Close previous connections if they exist
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 