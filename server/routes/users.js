import express from "express";
import Event from "../models/Event.js";
import {authMiddleware, roleMiddleware} from "../middleware/auth.js";

const router = express.Router();

//User dashboard
router.get("/user/dashboard", authMiddleware, roleMiddleware(["user"]), async (req, res) => {
    try {
        const events = await Event.find({ participants: req.user.id });
        res.json({registeredEvents: events});
    } catch (err) {
        res.staus(500).json({error: err.message});
    }
});

//Organizer dashboard
router.get("/organizer/dashboard", authMiddleware, roleMiddleware(["organizer"]), async (req, res) => {
    try {
        const events = await Event.find({organizer: req.user.id});
        res.json({createdEvents: events});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

export default router;