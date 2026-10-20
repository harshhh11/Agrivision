import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, Farmer, Farm } from "../models";
import { generateToken, AuthRequest } from "../middleware/auth";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "farmer",
      phone
    });

    const token = generateToken(user._id.toString(), user.email);

    return res.status(201).json({
      message: "Farmer registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Registration failed", error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email or mobile number and password are required" });
    }

    const cleanIdentifier = email.trim();
    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier.toLowerCase() },
        { phone: cleanIdentifier }
      ]
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString(), user.email);
    const farm = await Farm.findOne({ farmerId: user._id });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      farmId: farm ? farm._id : null
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = req.user;
    const farm = await Farm.findOne({ farmerId: user._id });
    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      },
      farmId: farm ? farm._id : null
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Could not fetch user profile", error: err.message });
  }
}
