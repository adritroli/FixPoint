import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users";
import authRoutes from "./routes/auth";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (_, res) => res.send("API FixPoint"));

export default app;
