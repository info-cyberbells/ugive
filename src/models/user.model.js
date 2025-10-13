import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          if (this.role === "student") {
            return /^[a-zA-Z0-9._%+-]+@usq\.edu\.au$/.test(value);
          }
          return true;
        },
        message: "Student email must end with @usq.edu.au",
      },
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["super_admin", "admin", "student"],
      default: "student",
    },
    university: {
      type: String,
      required: function () {
        return this.role === "student";
      },
      trim: true,
    },
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
    studentId: {
      type: String,
      required: function () {
        return this.role === "student";
      },
      trim: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (plainPwd) {
  return await bcrypt.compare(plainPwd, this.password);
};

export default mongoose.model("User", userSchema);
