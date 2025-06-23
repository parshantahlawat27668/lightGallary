import { Router } from "express";
import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/product/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authRoles } from "../middlewares/authRoles.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add").post(verifyJWT,authRoles("admin"),upload.fields([{name:"frontImage", maxCount:1},{name:"backImage",maxCount:1}]),addProduct);
router.route("/delete/:id").delete(verifyJWT,authRoles("admin"),deleteProduct);
router.route("/update/:id").patch(verifyJWT,authRoles("admin"),updateProduct);
router.route("/").get(getProducts);
router.route("/:id").get(getProduct);


export default router;