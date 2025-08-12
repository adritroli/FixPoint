import { Request, Response } from "express";
import { pool } from "../db";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

// GET /api/users?emp_codigo=#
// Obtener todos los usuarios, filtrando por emp_codigo y excluyendo los eliminados (deleted_at IS NULL)
export async function getAllUsers(req: Request, res: Response) {
  try {
    const emp_codigo = req.query.emp_codigo;
    let rows: any;
    if (emp_codigo) {
      const result = await pool.query(
        `SELECT * FROM users WHERE emp_codigo = ? AND deleted_at IS NULL AND status='activo' ORDER BY id DESC`,
        [emp_codigo]
      );
      rows = result[0];
      console.log(`[USERS] getAllUsers: emp_codigo=${emp_codigo}, count=${rows.length}`);
    } else {
      const result = await pool.query(
        `SELECT * FROM users WHERE deleted_at IS NULL AND status='activo' ORDER BY id DESC`
      );
      rows = result[0];
      console.log(`[USERS] getAllUsers: ALL, count=${rows.length}`);
    }
    res.json(rows);
  } catch (e) {
    console.error("[USERS] getAllUsers error:", e);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
}

// POST /api/users
// Crear un nuevo usuario
export async function createUser(req: Request, res: Response) {
  try {
    const { name, last_name, email, password, role, emp_codigo, created_by, phone, address, status } = req.body;
    let avatarUrl = null;

    // Si se subió un archivo, guardar la URL
    if (req.file) {
      avatarUrl = `/public/avatars/${req.file.filename}`;
    }

    // Validar campos obligatorios
    if (!name || !last_name || !email || !password || !emp_codigo || !created_by) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Verificar si el email ya está registrado en la misma empresa
    const [exists]: any = await pool.query(
      "SELECT id FROM users WHERE email = ? AND emp_codigo = ?",
      [email, emp_codigo]
    );
    if (exists.length > 0) return res.status(409).json({ error: "Email ya registrado" });

    // Hash de la contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    const [result]: any = await pool.query(
      `INSERT INTO users (name, last_name, email, password_hash, role, avatar, emp_codigo, created_by, created_at, is_logged_in, phone, address, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0, ?, ?, ?)`,
      [name, last_name, email, password_hash, role, avatarUrl, emp_codigo, created_by, phone, address, status || "activo"]
    );
    console.log("[USERS] createUser:", req.body.email);
    res.status(201).json({ id: result.insertId, avatar: avatarUrl });
  } catch (e) {
    console.error("[USERS] createUser error:", e);
    res.status(500).json({ error: "Error al crear usuario" });
  }
}

// PUT /api/users/:id
// Actualizar un usuario existente
export async function updateUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { name, last_name, email, role, updated_by, phone, address, status } = req.body;
    await pool.query(
      `UPDATE users SET name=?, last_name=?, email=?, role=?, updated_by=?, updated_at=NOW(), phone=?, address=?, status=? WHERE id=?`,
      [name, last_name, email, role, updated_by, phone, address, status, id]
    );
    console.log("[USERS] updateUser:", req.params.id);
    res.json({ ok: true });
  } catch (e) {
    console.error("[USERS] updateUser error:", e);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
}

// DELETE (soft) /api/users/:id
// Eliminar un usuario (soft delete)
export async function deleteUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await pool.query(
      "UPDATE users SET deleted_at=NOW(), status='inactivo' WHERE id=?",
      [id]
    );
    console.log("[USERS] deleteUser (soft):", id);
    res.json({ ok: true });
  } catch (e) {
    console.error("[USERS] deleteUser error:", e);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
}

// POST /api/users/:id/login
// Registrar el inicio de sesión de un usuario
export async function loginUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await pool.query(
      `UPDATE users SET is_logged_in=1, last_login_at=NOW() WHERE id=?`,
      [id]
    );
    console.log("[USERS] loginUser:", req.params.id);
    res.json({ ok: true });
  } catch (e) {
    console.error("[USERS] loginUser error:", e);
    res.status(500).json({ error: "Error al loguear usuario" });
  }
}

// POST /api/users/:id/logout
// Registrar el cierre de sesión de un usuario
export async function logoutUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await pool.query(
      `UPDATE users SET is_logged_in=0, last_logout_at=NOW() WHERE id=?`,
      [id]
    );
    console.log("[USERS] logoutUser:", req.params.id);
    res.json({ ok: true });
  } catch (e) {
    console.error("[USERS] logoutUser error:", e);
    res.status(500).json({ error: "Error al desloguear usuario" });
  }
}
  
