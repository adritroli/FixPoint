import { Request, Response } from "express";
import { pool } from "../db";
import bcrypt from "bcryptjs";

// GET /api/users
export async function getAllUsers(req: Request, res: Response) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, last_name, email, role, avatar, created_at FROM users ORDER BY id DESC"
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
}

// POST /api/users
export async function createUser(req: Request, res: Response) {
  try {
    const { name, last_name, email, password, role } = req.body;
    if (!name || !last_name || !email || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const [exists]: any = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length > 0) return res.status(409).json({ error: "Email ya registrado" });
    const password_hash = await bcrypt.hash(password, 10);
    const [result]: any = await pool.query(
      "INSERT INTO users (name, last_name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [name, last_name, email, password_hash, role]
    );
    res.status(201).json({ id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
}

// PUT /api/users/:id
export async function updateUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { name, last_name, email, role } = req.body;
    await pool.query(
      "UPDATE users SET name=?, last_name=?, email=?, role=? WHERE id=?",
      [name, last_name, email, role, id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
}

// DELETE /api/users/:id
export async function deleteUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await pool.query("DELETE FROM users WHERE id=?", [id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
}


  