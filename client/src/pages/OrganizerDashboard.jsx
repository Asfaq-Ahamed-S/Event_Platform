import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
    //State variables
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");

    useEffect(()=> {
        const fetchOrganizerEvents = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL;
                const token = localStorage.getItem("token");

                if (!token) {
                    window.location.href = "/login";
                    return;
                }

                const res = await axios.get(`${API_URL}users/organizer/dashboard`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                console.log()

                setEvents(res.data);//backend returns registered events
            } catch (err) {
                setError(err.response?.data?.error || "Failed to load Organizer dashboard");
            }
        };

        fetchOrganizerEvents();
    }, []);
    
    return (
        <div className="container mt-5">
            <h2 className="mb-4">Organizer Dashboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {events.length > 0 ? (
                <ul className="list-group">
                    {events.map((event)=>(
                        <li key={event.id} className="list-group-item">
                            <strong>{event.title}</strong> - {event.date}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events created yet.</p>
            )}
        </div>
    );
}