import { AppDataSource } from "./data-source";
import express from "express";
import authRoutes from "./routes/auth.routes";
import transferRoutes from "./routes/transfer.routes";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
AppDataSource.initialize()
  .then(() => {
    console.log("DataSource initialized");
    app.use("/api/auth", authRoutes);
    app.use("/api/transfer", transferRoutes);
    
    const PORT = process.env.PORT || 4000;

    app.get("/", (_, resp) => {
      resp.json({ message: "Welcome" });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
    process.exit(1);
  });
