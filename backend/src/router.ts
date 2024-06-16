import { Request, Response, Router } from "express";
import * as userController from "./controllers/userController";

export const userRouter = Router();
userRouter.get("/login", userController.login);

