import dotenv from 'dotenv';
import User from '../Models/UserSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendmail from '../utils/mailer.js';




dotenv.config();



if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env file");
}

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const alloweduser = ["user", "admin"];
        const userRole = alloweduser.includes(role) ? role : "user";

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: userRole
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


//login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// forgout password

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Generate a password reset token (you can use JWT or any other method)
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        await sendmail(email, "You are receiving this email because a request was made to reset the password for your account.", `
            Please click the link below to reset your password:
            
            https://airesumeanalyzerfrontend.vercel.app/ResetPassword/${user._id}/${resetToken}

            
            IF you did not request a password reset, please ignore this email and your password will remain unchanged.

            Thank you,
            The Support Team`
        );
        res.status(200).json({ message: "Password reset email sent" })
    } catch (error) {
        console.error("Error in forgot password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// reset password

export const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { userId, token } = req.params;

        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decoded);
            
        }
        catch (error) {
            console.error("Invalid or expired token:", error);
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (decoded.userId !== userId) {
            return res.status(401).json({ message: "Unauthorized request" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Error in reset password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};