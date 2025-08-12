import { Router } from "express";
import { pool } from "../db";
import bcrypt from "bcryptjs";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const [rows]: any = await pool.query(
    "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1",
    [email]
  );
  const user = rows[0];
  if (!user) return res.status(401).json({ error: "Usuario no encontrado" });
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });
  // Aquí podrías generar un JWT y devolverlo si lo deseas
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

export default router;
