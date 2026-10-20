import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";

export interface AuthRequest extends Request {
  user?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || "agritwin_super_secret_jwt_key_2026_production";

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // In demo mode, if no bearer token is present, resolve to the primary demo farmer
      const demoUser = await User.findOne({ email: "farmer@agritwin.com" });
      if (demoUser) {
        req.user = demoUser;
        return next();
      }
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid session user" });
    }

    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({ message: "Token expired or invalid", error: err.message });
  }
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });
}
