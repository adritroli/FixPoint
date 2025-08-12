import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        last_name: true,
        email: true,
        role: true,
        avatar: true,
        created_at: true,
      },
      orderBy: { id: "desc" },
    });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { name, last_name, email, password, role } = req.body;
    if (!name || !last_name || !email || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email ya registrado" });
    const password_hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, last_name, email, password_hash, role },
    });
    res.status(201).json({ id: user.id });
  } catch (e) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { name, last_name, email, role } = req.body;
    await prisma.user.update({
      where: { id },
      data: { name, last_name, email, role },
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await prisma.user.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
}
