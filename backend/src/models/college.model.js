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
  address_line_1: {
    type: String,
    required: [true, "Address line 1 is required"],
    trim: true,
  },
  contactName: {
    type: String,
    required: [true, "Contact Name is required"],
    trim: true,
  },
   phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
  },
  state: {
    type: String,
    required: [true, "State is required"],
    trim: true,
  },
  postcode: {
    type: String,
    required: [true, "Postcode is required"],
    trim: true,
  },
}, { timestamps: true });

export default mongoose.model("College", collegeSchema);
