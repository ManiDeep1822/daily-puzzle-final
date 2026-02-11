import { Router } from "express";
import { sql } from "../config/db";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/batch", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const { progress } = req.body;

    for (const p of progress) {
      await sql`
        INSERT INTO user_progress (user_id, date, answer, correct)
        VALUES (${decoded.userId}, ${p.date}, ${p.answer}, ${p.correct})
        ON CONFLICT (user_id, date) DO NOTHING
      `;
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
