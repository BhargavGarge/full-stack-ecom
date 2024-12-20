import mongoose from "mongoose";

const mongoURI =
  "mongodb+srv://bhargaavvv:1234@cluster0.ixk63.mongodb.net/Ecomm?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {});
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
