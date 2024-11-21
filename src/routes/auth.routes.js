import { Router } from "express";
import {
  login,
  logout,
  register,
  verifyToken,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema, loginTiendaSchema, registerTiendaSchema} from "../schemas/auth.schema.js"
import { registerTienda,loginTienda,verifyTiendaToken,  } from "../controllers/vendores.controller.js";


const router = Router();



router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.get("/verify", verifyToken);
router.post("/logout",logout);
router.post("/register-tienda",validateSchema(registerTiendaSchema) ,registerTienda);
router.post("/login-tienda", validateSchema(loginTiendaSchema),loginTienda);
router.get("/verify-tienda", verifyTiendaToken);

export default router;
