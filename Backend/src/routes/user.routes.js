import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authRoles } from "../middlewares/authRoles.middleware.js";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user/auth.controller.js";
import { getCurrentUser, getUsers } from "../controllers/user/admin.controller.js";
import { emailVerification, phoneVerification, sendEmailVerificationCode } from "../controllers/user/verification.controller.js";
import { addToCart, clearCartProducts, deleteAccount, getCartProducts, getWishlist, toggleWishlistProducts, updateUserAccountDetails } from "../controllers/user/profile.controller.js";
import { changeUserPassword, resetForgotPassword, sendForgotPasswordOtpToEmail, sendForgotPasswordOtpToPhone, verifyForgotPasswordOtpFromEmail, verifyForgotPasswordOtpFromPhone } from "../controllers/user/password.controller.js";
import { registerAdmin } from "../controllers/user/devOnly.controller.js";
const router = Router();

// Auth
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(verifyJWT,refreshAccessToken);
router.route("/send-forgot-password-email").patch(sendForgotPasswordOtpToEmail);
router.route("/verify-forgot-password-email").post(verifyForgotPasswordOtpFromEmail);
router.route("/send-forgot-password-phone").patch(sendForgotPasswordOtpToPhone);
router.route("/verify-forgot-password-phone").post(verifyForgotPasswordOtpFromPhone);
router.route("/reset-forgot-password").put(resetForgotPassword);



//Password
router.route("/password-forgot-email").post(sendForgotPasswordOtpToEmail);
router.route("/password-verify-email").post(verifyForgotPasswordOtpFromEmail);
router.route("/password-forgot-phone").post(sendForgotPasswordOtpToPhone);
router.route("/password-verify-phone").post(verifyForgotPasswordOtpFromPhone);
router.route("/password-reset").patch(resetForgotPassword);
router.route("/change-password").patch(verifyJWT,changeUserPassword);

// verification
router.route("/verify-email").post(verifyJWT,emailVerification);
router.route("/send-email-verification-code").patch(verifyJWT,sendEmailVerificationCode);
router.route("/verify-phone").post(phoneVerification);

// Proflie
router.route("/update-user-details").patch(verifyJWT,updateUserAccountDetails);
router.route("/delete-account").delete(verifyJWT,deleteAccount);
router.route("/toggle-wishlist-products").patch(verifyJWT,toggleWishlistProducts);
router.route("/wishlist").get(verifyJWT,getWishlist);
router.route("/add-to-cart").patch(verifyJWT,addToCart);
router.route("/get-cart-products").get(verifyJWT, getCartProducts);
router.route("/clear-cart-products").patch(verifyJWT,clearCartProducts);


// Admin
router.route("/:id").get(verifyJWT, authRoles("admin") ,getCurrentUser);
router.route("/").get(getUsers);

// Developers only routes
router.route("/register-admin").post(registerAdmin);

export default router;