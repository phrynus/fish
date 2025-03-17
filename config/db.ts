import mongoose from "mongoose";

// connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI as string).then(() => {
  console.log("Connected to MongoDB");
});

process.on("SIGINT", () => {
  mongoose.connection.close();
  process.exit();
});
process.on("SIGTERM", () => {
  mongoose.connection.close();
  process.exit();
});

export default mongoose.connection;
