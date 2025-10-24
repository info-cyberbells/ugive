import mongoose from "mongoose";

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address_line_1: {
      type: String,
      required: true,
      trim: true,
    },
    address_line_2: {
      type: String,
      trim: true,
      default: null,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      enum: ["QLD", "NSW", "ACT", "TAS", "VIC", "SA", "WA", "NT"],
    },
    postcode: {
      type: String,
      required: true,
      trim: true,
    },
    shipping_address_name: {
      type: String,
      required: true,
      trim: true,
    },
    semester_length: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("University", universitySchema);
