import { Request, Response } from "express";
import { pool } from "../db";

// GET /api/companies
export async function getAllCompanies(req: Request, res: Response) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM companies ORDER BY id DESC"
    ) as any[];
    console.log(`[COMPANIES] getAllCompanies: count=${rows.length}`);
    res.json(rows);
  } catch (e) {
    console.error("[COMPANIES] getAllCompanies error:", e);
    res.status(500).json({ error: "Error al obtener empresas" });
  }
}

// POST /api/companies
export async function createCompany(req: Request, res: Response) {
  try {
    const { owner_name, company_name, country, city, address, phone, email, status } = req.body;
    if (!owner_name || !company_name || !country || !city || !address || !phone || !email) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Función para generar un emp_codigo único
    async function generateUniqueEmpCodigo(): Promise<string> {
      let emp_codigo: string;
      let exists: any[] = [];
      do {
        emp_codigo =
          country.slice(0, 2).toUpperCase() +
          city.slice(0, 2).toUpperCase() +
          Math.floor(1000 + Math.random() * 9000); // 4 dígitos aleatorios
        const [rows]: any = await pool.query(
          "SELECT id FROM companies WHERE emp_codigo = ?",
          [emp_codigo]
        );
        exists = rows;
      } while (exists.length > 0);
      return emp_codigo;
    }

    const emp_codigo = await generateUniqueEmpCodigo();

    const [result]: any = await pool.query(
      `INSERT INTO companies (emp_codigo, owner_name, company_name, country, city, address, phone, email, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        emp_codigo,
        owner_name,
        company_name,
        country,
        city,
        address,
        phone,
        email,
        status || "en_proceso",
      ]
    );
    console.log("[COMPANIES] createCompany:", req.body.company_name);
    res.status(201).json({ id: result.insertId, emp_codigo });
  } catch (e) {
    console.error("[COMPANIES] createCompany error:", e);
    res.status(500).json({ error: "Error al crear empresa" });
  }
}

// PUT /api/companies/:id
export async function updateCompany(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { owner_name, company_name, country, city, address, phone, email, status } = req.body;
    if (status && !(owner_name || company_name || country || city || address || phone || email)) {
      // Solo actualizar estado
      await pool.query(
        `UPDATE companies SET status=? WHERE id=?`,
        [status, id]
      );
      return res.json({ ok: true });
    }
    await pool.query(
      `UPDATE companies SET owner_name=?, company_name=?, country=?, city=?, address=?, phone=?, email=?, status=? WHERE id=?`,
      [owner_name, company_name, country, city, address, phone, email, status, id]
    );
    console.log("[COMPANIES] updateCompany:", req.params.id);
    res.json({ ok: true });
  } catch (e) {
    console.error("[COMPANIES] updateCompany error:", e);
    res.status(500).json({ error: "Error al actualizar empresa" });
  }
}

// DELETE /api/companies/:id
export async function deleteCompany(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await pool.query("DELETE FROM companies WHERE id=?", [id]);
    console.log("[COMPANIES] deleteCompany:", req.params.id);
    res.json({ ok: true });
  } catch (e) {
    console.error("[COMPANIES] deleteCompany error:", e);
    res.status(500).json({ error: "Error al eliminar empresa" });
  }
}
