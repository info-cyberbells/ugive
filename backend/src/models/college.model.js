import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    required: true,
  },
  address: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.model("College", collegeSchema);
