import { Request, Response, NextFunction } from "express";
import { admin_id } from "../config/admin";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
    const raw =
        (req.query.id as string) || (req.headers["x-telegram-id"] as string);

    const adminId = Number(raw);

    if (!adminId || Number.isNaN(adminId) || !admin_id.includes(adminId)) {
        return res.status(403).json({ error: "Unauthorized: admin only" });
    }

    next();
}
