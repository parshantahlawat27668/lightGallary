import { Router } from "express";
import { changeUserPassword, deleteAccount, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerAdmin, registerUser, updateUserAccountDetails } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authRoles } from "../middlewares/authRoles.middleware.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Protected  Routes
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(verifyJWT,refreshAccessToken);
router.route("/change-password").post(verifyJWT,changeUserPassword);
router.route("/update-user-details").patch(verifyJWT,updateUserAccountDetails);
router.route("/delete-account").delete(verifyJWT,deleteAccount);


// Role based Routes
router.route("/:id").get(verifyJWT, authRoles("admin") ,getCurrentUser);



// Developers only routes
router.route("/register-admin").post(registerAdmin);

export default router;