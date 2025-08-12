import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoutes);

app.get("/", (_, res) => res.send("API FixPoint"));

export default app;
