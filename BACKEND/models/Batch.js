import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  name: String,
  year: String,
});

export default mongoose.model("Batch", batchSchema);