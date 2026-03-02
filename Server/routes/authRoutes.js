import express from "express";
import { forgotPassword, loginUser, registerUser, resetPassword } from "../Controllers/authController.js";




const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/forgotpassword", forgotPassword)
router.post("/ResetPassword/:userId/:token", resetPassword)




export default router;