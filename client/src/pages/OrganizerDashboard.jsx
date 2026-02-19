import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OrganizerDashboard() {
    //State variables
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [showForm, setShowForm] = useState(false); //toggle form visibilty
    const navigate = useNavigate();

    //Edit states
    const [editingEvent, setEditingEvent] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDate, setEditDate] = useState("");
    const [editLocation, setEditLocation] = useState("");

    //Auto-hide alerts
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError("");
                setSuccess("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    //Fetch events
    useEffect(()=> {
        const fetchOrganizerEvents = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL;
                const token = localStorage.getItem("token");

                if (!token) {
                    window.location.href = "/login";
                    return;
                }

                const res = await axios.get(`${API_URL}/users/organizer/dashboard`, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                setEvents(res.data.createdEvents || []);//backend returns registered events
            } catch (err) {
                setError(err.response?.data?.error || "Failed to load Organizer dashboard");
            }
        };

        fetchOrganizerEvents();
    }, []);

    //Handle event creation
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const API_URL= import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");

            const res = await axios.post(
                `${API_URL}/events`,
                {title, date, location},
                {headers: {Authorization: `Bearer ${token}`}}
            );

            //Add new event to state instantly
            setEvents([...events, res.data]); //backend returns the event directly
            setTitle("");
            setDate("");
            setLocation("");
            setShowForm(false); //hide form after creation
            setSuccess("Event created successfully!");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create event");
        }
    };

    //Handle Event Deletion
    const handleDeleteEvent = async (id) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");

            const res = await axios.delete(
                `${API_URL}/events/${id}`,
                {headers: {Authorization: `Bearer ${token}`}}
            );

            //Remove from State
            setEvents(events.filter((event) => event._id != id));
            setSuccess("Event deleted successfully!");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete event");
        }
    };

    //Start editing
    const startEdit =(event) => {
        setEditingEvent(event._id);
        setEditTitle(event.title);
        setEditDate(event.date.slice(0, 10)); //format YYYY-MM-DD
        setEditLocation(event.location);
    };

    //Handle event update
    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");

            const res = await axios.put(
                `${API_URL}/events/${editingEvent}`,
                {title: editTitle, date: editDate, location: editLocation},
                {headers: {Authorization: `Bearer ${token}`}}
            );

            setEvents(events.map(ev => ev._id === editingEvent? res.data : ev))
            setEditingEvent(null);
            setSuccess("Event updated successfully!");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update event");
        }
    };
    
    return (
        <div className="container mt-5">
            <h2 className="mb-3">Organizer Dashboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Toggle button */}
            {!showForm && (
                <button className="btn btn-success mb-3" onClick={()=> setShowForm(true)}>
                    Create Event
                </button>
            )}

            {/* Event Creation Form (when showForm=true) */}
            {showForm && (
                <form onSubmit={handleCreateEvent} className="mb-4">
                    <div className="mb-3">
                        <label className="form-label">Event Title</label>
                        <input type="text" className="form-control" value={title} onChange={
                            (e)=>setTitle(e.target.value)
                        } required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Event Date</label>
                        <input type="date" className="form-control" value={date} onChange={
                            (e)=>setDate(e.target.value)
                        } required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Event Location</label>
                        <input type="text" className="form-control" value={location} onChange={
                            (e)=>setLocation(e.target.value)
                        } required />
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                        Create
                    </button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={
                        (e)=> setShowForm(false)
                    }>Cancel</button>
                </form>
            )}

            {/* Event List */}
            {events.length > 0 ? (
                <ul className="list-group">
                    {events.map((event)=>(
                        <li key={event.id || event._id} className="list-group-item">
                            {editingEvent === event._id ? (
                                <form onSubmit={handleUpdateEvent}>
                                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                                    <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} required />
                                    <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} required />
                                    <button type="submit" className="btn btn-primary btn-sm">Save</button>
                                    <button type="button" className="btn btn-secondary btn-sm ms-2" onClick={()=> setEditingEvent(null)}>Cancel</button>
                                </form>
                            ):(
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{event.title}</strong>
                                        <br />
                                        {new Date(event.date).toLocaleDateString("en-GB",{
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })} - {event.location}
                                    </div>
                                    <div>
                                        <button className="btn btn-warning btn-sm me-2" onClick={()=> startEdit(event)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={()=> handleDeleteEvent(event._id)}>Delete</button>
                                        <button className="btn btn-info btn-sm ms-2" onClick={()=> navigate(`/events/${event._id}`)}>View Details</button>
                                    </div>
                                </div>
                            )} 
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events created yet.</p>
            )}
        </div>
    );
}