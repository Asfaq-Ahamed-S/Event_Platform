import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
    //State variables
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [showForm, setShowForm] = useState(false); //toggle form visibilty

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

            console.log("Create Event response:", res.data);

            //Add new event to state instantly
            setEvents([...events, res.data]); //backend returns the event directly
            setTitle("");
            setDate("");
            setLocation("");
            setShowForm(false); //hide form after creation
        } catch (err) {
            console.log(err.response?.data);
            setError(err.response?.data?.error || "Failed to create event");
        }
    };
    
    return (
        <div className="container mt-5">
            <h2 className="mb-3">Organizer Dashboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}

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
                        <li key={event.id || event._id || index} className="list-group-item">
                            <strong>{event.title}</strong> - {new Date(event.date).toLocaleDateString("en-GB",{
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events created yet.</p>
            )}
        </div>
    );
}