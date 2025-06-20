import { Router } from "express";
import { changeUserPassword, deleteAccount, emailVerification, getCurrentUser, getUsers, loginUser, logoutUser, phoneVerification, refreshAccessToken, registerAdmin, registerUser, sendEmailVerificationCode, updateUserAccountDetails } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authRoles } from "../middlewares/authRoles.middleware.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify-phone").post(phoneVerification);

// Protected  Routes
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(verifyJWT,refreshAccessToken);
router.route("/change-password").post(verifyJWT,changeUserPassword);
router.route("/update-user-details").patch(verifyJWT,updateUserAccountDetails);
router.route("/delete-account").delete(verifyJWT,deleteAccount);
router.route("/send-email-verification-code").patch(verifyJWT,sendEmailVerificationCode);
router.route("/verify-email").patch(verifyJWT,emailVerification);


// Role based Routes
router.route("/:id").get(verifyJWT, authRoles("admin") ,getCurrentUser);
router.route("/").get(verifyJWT,authRoles("admin"),getUsers);



// Developers only routes
router.route("/register-admin").post(registerAdmin);

export default router;