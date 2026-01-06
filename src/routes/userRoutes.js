import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get Authenticated User's Details (Protected Route)
// @route GET /api/users/me (or just /me)
// @access Private
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // The user ID is available from the token via req.user.id
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const newUser = await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: newUser.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        res.status(201).json({ token, user: userWithoutPassword });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json({ token, user: userWithoutPassword });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
