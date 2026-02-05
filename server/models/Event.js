import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {type: String, required: true},
    date: {type: Date, required: true},
    location: {type: String, required: true},
    description: {type: String},
    organizer: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    participants:[{type: mongoose.Schema.Types.ObjectId, ref:"User"}],

    //Ticketing
    ticketPrice: {type: Number, default: 0},
    totalTickets: {type: Number, default: 100},
    ticketsSold: {type: Number, default: 0}
}, {timestamps: true});

export default mongoose.model("Event", eventSchema);