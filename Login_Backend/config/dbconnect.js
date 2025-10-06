const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://edupredict:16UpTekXzOeTDYUH@cluster3.kwhafu3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster3");
  console.log("MongoDB connected.");
};

module.exports = connectDB;
