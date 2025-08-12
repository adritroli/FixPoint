import { Request, Response } from "express";
import { pool } from "../db";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

// GET /api/users?company_id=#
// Obtener todos los usuarios, filtrando por company_id y excluyendo los eliminados (deleted_at IS NULL)
export async function getAllUsers(req: Request, res: Response) {
  try {
    const company_id = req.query.company_id;
    const [rows] = await pool.query(
      `SELECT id, name, last_name, email, role, avatar, created_at, is_logged_in, last_login_at, last_logout_at, created_by, updated_by, deleted_by, deleted_at
       FROM users
       WHERE company_id = ? AND deleted_at IS NULL
       ORDER BY id DESC`,
      [company_id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
}

// POST /api/users
// Crear un nuevo usuario
export async function createUser(req: Request, res: Response) {
  try {
    const { name, last_name, email, password, role, company_id, created_by } = req.body;
    let avatarUrl = null;

    // Si se subió un archivo, guardar la URL
    if (req.file) {
      avatarUrl = `/public/avatars/${req.file.filename}`;
    }

    // Validar campos obligatorios
    if (!name || !last_name || !email || !password || !company_id || !created_by) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    // Verificar si el email ya está registrado en la misma empresa
    const [exists]: any = await pool.query("SELECT id FROM users WHERE email = ? AND company_id = ?", [email, company_id]);
    if (exists.length > 0) return res.status(409).json({ error: "Email ya registrado" });
    // Hash de la contraseña
    const password_hash = await bcrypt.hash(password, 10);
    // Insertar el nuevo usuario en la base de datos
    const [result]: any = await pool.query(
      `INSERT INTO users (name, last_name, email, password_hash, role, avatar, company_id, created_by, created_at, is_logged_in)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0)`, // is_logged_in se inicializa en 0
      [name, last_name, email, password_hash, role, avatarUrl, company_id, created_by]
    );
    res.status(201).json({ id: result.insertId, avatar: avatarUrl });
  } catch (e) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
}

// PUT /api/users/:id
// Actualizar un usuario existente
export async function updateUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { name, last_name, email, role, updated_by } = req.body;
    // Actualizar los datos del usuario
    await pool.query(
      `UPDATE users SET name=?, last_name=?, email=?, role=?, updated_by=?, updated_at=NOW() WHERE id=?`,
      [name, last_name, email, role, updated_by, id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
}

// DELETE (soft) /api/users/:id
// Eliminar un usuario (soft delete)
export async function deleteUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { deleted_by } = req.body;
    // Marcar al usuario como eliminado, estableciendo deleted_at y deleted_by
    await pool.query(
      `UPDATE users SET deleted_at=NOW(), deleted_by=? WHERE id=?`,
      [deleted_by, id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
}

// POST /api/users/:id/login
// Registrar el inicio de sesión de un usuario
export async function loginUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    // Actualizar el estado de inicio de sesión y la fecha/hora del último inicio de sesión
    await pool.query(
      `UPDATE users SET is_logged_in=1, last_login_at=NOW() WHERE id=?`,
      [id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Error al loguear usuario" });
  }
}

// POST /api/users/:id/logout
// Registrar el cierre de sesión de un usuario
export async function logoutUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    // Actualizar el estado de cierre de sesión y la fecha/hora del último cierre de sesión
    await pool.query(
      `UPDATE users SET is_logged_in=0, last_logout_at=NOW() WHERE id=?`,
      [id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Error al desloguear usuario" });
  }
}


