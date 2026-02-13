import userModel from "../models/user.models.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";
export const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await userService.createUser(req.body);

        const token = user.generateAuthToken();
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select("+password");        
        if (!user) {
            res.status(400).json({ error: "Invalid email or password" });
            return;
        }
        const isValid = await user.isValidPassword(password);
        if (!isValid) {
            res.status(400).json({ error: "Invalid email or password" });
            return;
        }
        const token = user.generateAuthToken();
        res.status(200).json({ user, token });
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const profileController = async (req, res) => {
    console.log(req.user);
    res.status(200).json({ user: req.user });
    
};

export const logoutUser = async (req, res) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        redisClient.set(token, "blacklisted", "EX", 24 * 60 * 60); // Blacklist token for 24 hours
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }
};