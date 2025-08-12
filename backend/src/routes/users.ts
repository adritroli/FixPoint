import { Request, Response, NextFunction, Router } from "express";
import * as usersController from "../controllers/users";
import   multer from "multer";
import path from "path";
import { pool } from "../db";

// Configuración de multer para guardar imágenes en /public/avatars

const storage = multer.diskStorage({
  destination: function (req: Request, file: any, cb: (error: any, destination: string) => void) {
    cb(null, path.join(__dirname, "../../public/avatars"));
  },
  filename: function (req: Request, file: any, cb: (error: any, filename: string) => void){
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

const router = Router();

router.get("/", usersController.getAllUsers);
router.post("/", upload.single("avatar"), usersController.createUser);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);
router.post("/:id/login", usersController.loginUser);
router.post("/:id/logout", usersController.logoutUser);
router.get("/count", async (req, res) => {
  const emp_codigo = req.query.emp_codigo;
  if (!emp_codigo) return res.json({ count: 0 });
  const [rows]: any = await pool.query(
    "SELECT COUNT(*) as count FROM users WHERE emp_codigo = ? AND deleted_at IS NULL",
    [emp_codigo]
  );
  res.json({ count: rows[0]?.count ?? 0 });
});

export default router;
