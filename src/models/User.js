import mongoose from "mongoose";
//import bcrypt from "bcryptjs";  hash the password for safety

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  avatar: {
    type: String,
  },
});

export default mongoose.model("User", userSchema);
