import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
    //State variables
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");

    useEffect(()=> {
        const fetchUserEvents = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL;
                const token = localStorage.getItem("token");

                if (!token) {
                    window.location.href = "/login";
                    return;
                }

                const res = await axios.get(`${API_URL}/users/user/dashboard`, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                setEvents(res.data.registeredEvents);//backend returns registered events
            } catch (err) {
                setError(err.response?.data?.error || "Failed to load user dashboard");
            }
        };

        fetchUserEvents();
    }, []);
    
    return (
        <div className="container mt-5">
            <h2 className="mb-4">User Dashboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {events.length > 0 ? (
                <ul className="list-group">
                    {events.map((event)=>(
                        <li key={event.id} className="list-group-item">
                            <strong>{event.title}</strong> - {new Date(event.date).toLocaleDateString('en-GB',{
                                day: "numeric",
                                month:"long",
                                year: "numeric"
                            })}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No registerd events found</p>
            )}
        </div>
    );
}