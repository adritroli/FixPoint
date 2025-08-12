import { Router } from "express";
import * as companiesController from "../controllers/companies";

const router = Router();

router.get("/", companiesController.getAllCompanies);
router.post("/", companiesController.createCompany);
router.put("/:id", companiesController.updateCompany);
router.delete("/:id", companiesController.deleteCompany);

export default router;
