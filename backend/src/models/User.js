import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"]
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    profilePic: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Enforce unique index at the database level
userSchema.index({ email: 1 }, { unique: true });

// Ensure password comes back when needed explicitly
userSchema.methods.getPassword = function () {
  return this.password;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;