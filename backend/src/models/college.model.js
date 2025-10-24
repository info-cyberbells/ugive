import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "College name is required"], 
    trim: true 
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    required: [true, "University is required"],
  },
  // address: { type: String, trim: true },
  address_line_1: {
    type: String,
    required: [true, "Address line 1 is required"],
    trim: true,
  },
  address_line_2: {
    type: String,
    trim: true,
    default: null,
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
  },
  state: {
    type: String,
    required: [true, "State is required"],
    // enum: ["QLD", "NSW", "ACT", "TAS", "VIC", "SA", "WA", "NT"],
    trim: true,
  },
  postcode: {
    type: String,
    required: [true, "Postcode is required"],
    trim: true,
  },
}, { timestamps: true });

export default mongoose.model("College", collegeSchema);
