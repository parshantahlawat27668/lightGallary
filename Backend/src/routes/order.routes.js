import { Router } from "express";
import { getOrders } from "../controllers/order/admin/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createOrder } from "../controllers/order/order.controller.js";
const router = Router();

router.route("/admin").get(getOrders);
router.route("/").post(verifyJWT,createOrder);

export default router;