import express from "express";
import userControllers from "../controllers/user_controllers";
import { Router } from "express";

const router = express.Router();

router.post("/register", userControllers.register);

router.post("/login", userControllers.login);

router.post("/refresh", userControllers.refresh);

router.post("/logout", userControllers.logout);

export default router;