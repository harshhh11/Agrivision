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

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone ? phone.trim() : undefined;

    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    if (cleanPhone) {
      const existingPhone = await User.findOne({ phone: cleanPhone });
      if (existingPhone) {
        return res.status(400).json({ message: "User with this mobile number already exists" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: "farmer",
      phone: cleanPhone
    });

    // Automatically create linked Farmer record
    await Farmer.create({
      userId: user._id,
      fullName: user.name,
      mobileNumber: cleanPhone || "",
      state: "Maharashtra",
      district: "Kolhapur",
      taluka: "Karveer",
      village: "Kasba Bawada"
    });

    const token = generateToken(user._id.toString(), user.email);

    return res.status(201).json({
      message: "Farmer registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Registration failed", error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const identifier = (req.body.email || req.body.phone || req.body.identifier || "").toString().trim();
    const { password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Email or mobile number and password are required" });
    }

    const cleanDigits = identifier.replace(/[^0-9]/g, "");
    const searchConditions: any[] = [
      { email: identifier.toLowerCase() },
      { phone: identifier }
    ];
    if (cleanDigits.length >= 10) {
      const last10 = cleanDigits.slice(-10);
      searchConditions.push({ phone: { $regex: last10 } });
    }

    const user = await User.findOne({ $or: searchConditions });
    if (!user) {
      return res.status(401).json({ message: "Account not found. Please register or check credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
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
        phone: user.phone,
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
