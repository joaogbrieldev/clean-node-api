import loginRoutes from "@/main/routes/login-routes";
import { Express, Router } from "express";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);
  loginRoutes(router);
};
