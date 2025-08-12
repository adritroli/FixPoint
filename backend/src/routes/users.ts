import { Request, Response, NextFunction, Router } from "express";
import * as usersController from "../controllers/users";
import   multer from "multer";
import path from "path";

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

export default router;
