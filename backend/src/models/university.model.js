import mongoose from "mongoose";

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "University name is required"],
      unique: true,
      trim: true,
    },
    address_line_1: {
      type: String,
      required: [true, "Address line 1 is required"],
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
    shipping_address_name: {
      type: String,
      required: false,
      trim: true,
    },
    semester_length: {
      type: Number,
      required: false,
      min: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("University", universitySchema);
