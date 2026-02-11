import { Router } from "express";
import { authAdmin } from "../config/firebase";
import { sql } from "../config/db";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/firebase", async (req, res) => {
  try {
    const { idToken } = req.body;

    const decoded = await authAdmin.verifyIdToken(idToken);

    const email = decoded.email || "";
    const name = decoded.name || "";
    const firebase_uid = decoded.uid;

    const user =
      await sql`SELECT * FROM users WHERE firebase_uid = ${firebase_uid}`;

    let userId;

    if (user.length === 0) {
      const inserted =
        await sql`
          INSERT INTO users (firebase_uid, email, name)
          VALUES (${firebase_uid}, ${email}, ${name})
          RETURNING id
        `;
      userId = inserted[0].id;
    } else {
      userId = user[0].id;
    }

    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
