import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        if (this.role === "student" && this.universityDomain) {
          return new RegExp(`^[a-zA-Z0-9._%+-]+@${this.universityDomain}$`).test(value);
        }
        return true;
      },
      message: "Student email must match university domain",
    },
  },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ["super_admin", "admin", "student"],
    default: "student",
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    required: function () {
      return this.role !== "super_admin";
    },
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },
  // universityDomain: { type: String, trim: true }, // internal helper
  phoneNumber: {
    type: String,
    validate: {
      validator: function (value) {
        if (this.role === "student") {
          return /^\+?[1-9]\d{1,14}$/.test(value);
        }
        return true;
      },
      message: "Invalid phone number format",
    },
  },
  studentUniId: {
    type: String,
    required: function () {
      return this.role === "student";
    },
    trim: true,
  },
  profileImage: { type: String, default: null },
}, { timestamps: true });

// Password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (plainPwd) {
  return await bcrypt.compare(plainPwd, this.password);
};

export default mongoose.model("User", userSchema);
