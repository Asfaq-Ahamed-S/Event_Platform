import { authMiddleware,roleMiddleware } from "../middleware/auth.js";
import router from "./auth.js";
import Event from "../models/Event.js";

//Only organizers can create events
router.post("/", authMiddleware, roleMiddleware(["organizer"]), async (req, res) => {
    try {
        const event = new Event({...req.body, organizer: req.user.id});
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

//Any logged-in user can browse events
router.get("/", authMiddleware, async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//Update event
router.put("/:id", authMiddleware, roleMiddleware(["organizer"]), async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}//return updated event
        );

        if (!event) return res,status(404).json({error: "Event not found"});
        res.json(event);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

//Delete event
router.delete("/:id", authMiddleware, roleMiddleware(["organizer"]), async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if(!event) return res.status(404).json({error: "Event not found"});
        res.json({message: "Event deleted successfully"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//Get single event by ID
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if(!event) return res.status(404).json({error:"Event not found"});
        res.json(event);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//Register for an event (user only)
router.post("/:id/register", authMiddleware, roleMiddleware(["user"]), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if(!event) return res.status(404).json({error: "Event not found"});
        
        //Prevent duplicate registration
        if (event.participants.includes(req.user.id)){
            return res.status(400).json({error: "Already registered"});
        }

        event.participants.push(req.user.id);
        await event.save();

        res.json({message: "Registered Successfully", event});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//View participants (organizer only)
router.get("/:id/participants", authMiddleware, roleMiddleware(["organizer"]), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("participants", "name email");
        if(!event) return res.status(404).json({error: "Event not found"});

        res.json({ participants: event.participants });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//Purchase ticket
router.post("/:id/tickets", authMiddleware, roleMiddleware(["user"]), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if(!event) return res.status(404).json({error: "Event not found"});

        if(event.ticketsSold >= event.totalTickets){
            return res.status(400).json({error: "Tickets sold out"});
        }

        //Increment tickets sold
        event.ticketsSold += 1;
        event.participants.push(req.user.id);
        await event.save();

        res.json({message: "Ticket purchased successfully", event});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//View ticket sales (organizer only)
router.get("/:id/sales", authMiddleware, roleMiddleware(["organizer"]), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if(!event) return res.status(404).json({error: "Event not found"});

        res.json({
            totalTickets: event.totalTickets,
            ticketsSold: event.ticketsSold,
            remaining: event.totalTickets - event.ticketsSold
        });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

export default router;