import { pool } from "../db";
import bcrypt from "bcryptjs";

// POST /api/auth/login
export async function login(req: any, res: any) {
  try {
    const { email, password } = req.body;
    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1",
      [email]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

    // Actualiza el estado a online y la fecha de login
    await pool.query(
      "UPDATE users SET is_logged_in=1, last_login_at=NOW() WHERE id=?",
      [user.id]
    );

    // Trae los datos actualizados
    const [updatedRows]: any = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [user.id]
    );
    const updatedUser = updatedRows[0];

    // Devuelve los datos necesarios (incluyendo emp_codigo)
    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      emp_codigo: updatedUser.emp_codigo,
      is_logged_in: updatedUser.is_logged_in,
      last_login_at: updatedUser.last_login_at,
      status: updatedUser.status
      // ...agrega otros campos si necesitas...
    });
  } catch (e) {
    console.error("[AUTH] login error:", e);
    res.status(500).json({ error: "Error en login" });
  }
}