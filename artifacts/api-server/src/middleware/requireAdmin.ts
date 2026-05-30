import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";

const adminUserIds = (process.env.ADMIN_USER_IDS ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const auth = getAuth(req);
  const userId = auth?.userId;

  if (!userId) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  if (adminUserIds.length > 0 && !adminUserIds.includes(userId)) {
    res.status(403).json({ error: "Access denied. Admin privileges required." });
    return;
  }

  next();
}

export function isAdminUser(userId: string): boolean {
  if (adminUserIds.length === 0) return false;
  return adminUserIds.includes(userId);
}
