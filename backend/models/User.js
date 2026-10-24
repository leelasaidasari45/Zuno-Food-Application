// models/User.js
// This model stores all users - both customers and restaurant admins

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the shape of a User document in MongoDB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // name is mandatory
      trim: true,     // removes extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,   // no two users can have the same email
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    // role decides if this user is a customer or a restaurant admin
    role: {
      type: String,
      enum: ["customer", "restaurant"], // only these two values allowed
      default: "customer",
    },
    phone: {
      type: String,
      default: "",
    },
  },
  {
    // timestamps: true automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// This runs BEFORE saving a user to the database
// It automatically hashes the password so we never store plain text passwords
userSchema.pre("save", async function () {
  // Only hash if password was changed (or is new)
  if (!this.isModified("password")) return;

  // bcrypt.hash() scrambles the password - 10 is the "salt rounds" (higher = more secure but slower)
  this.password = await bcrypt.hash(this.password, 10);
});

// A helper method on every user to compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt.compare() checks if the entered password matches the hashed one
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
