const db = require("../models/index");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await db.User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Email is already associated with an account',
            });
        }

        await db.User.create({
            name,
            email,
            password: await bcrypt.hash(password, 15),
        });

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error in registering user',
            error: err.message,
        });
    }
}

const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Email not found',
            });
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect email and password combination',
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION,
        });

        return res.status(200).json({
            success: true,
            message: 'Sign in successful',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                accessToken: token,
            },
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Sign in error',
            error: err.message,
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userId = req.user.id;

        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const updatedUser = await user.update({
            name,
            email,
            ...(password && { password: await bcrypt.hash(password, 15) })
        });

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
            },
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: err.message,
        });
    }
}


module.exports = {
    registerUser,
    signInUser,
    updateProfile
}