import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    initials: { type: String, required: true, maxlength: 5 },
    isAadhaarVerified: { type: Boolean, default: false },
    trustScore: { type: Number, default: 75 }
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
