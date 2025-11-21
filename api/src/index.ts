import { AppDataSource } from "./data-source";
import express from "express";
import authRoutes from "./routes/auth.routes";
const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("DataSource initialized");
    app.use("/api/auth", authRoutes);
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
