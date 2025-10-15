// src/main.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import env from "./infrastructure/config/env.js";
import router from "./interface/routes/index.js";
import { errorHandler } from "./interface/middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", router);


app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`✅ API rodando em http://localhost:${env.PORT}`);
});
