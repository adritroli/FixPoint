import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import companiesRoutes from "./routes/companies";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/companies", companiesRoutes);

app.get("/", (_, res) => res.send("API FixPoint"));

export default app;
