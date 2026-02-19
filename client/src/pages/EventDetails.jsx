import { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import axios from "axios";

export default function EventDetails() {
    const {id} = useParams(); //event id from URL
    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [role, setRole] = useState("")

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL;
                const token = localStorage.getItem("token");

                //Decode role from localStorage
                const userRole = localStorage.getItem("role");
                setRole(userRole);

                const res = await axios.get(`${API_URL}/events/${id}`, {
                    headers: {Authorization: ` Bearer ${token}`},
                });

                setEvent(res.data);

                //Only organizer fetch participants
                if (userRole === "organizer") {
                    const participantsRes = await axios.get(`${API_URL}/events/${id}/participants`,{
                        headers: {Authorization: `Bearer ${token}`},
                    });
                    setParticipants(participantsRes.data.participants);
                }
            } catch (err) {
                setError(err.response?.data?.error || "Failed to load event details");
            }
        };
        fetchEvent();
    }, [id]);

    //User registration
    const handleRegister = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");

            await axios.post(`${API_URL}/events/${id}/register`,{},{
                headers: {Authorization: `Bearer ${token}`},
            });

            setSuccess("You have registered succesfully");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to register");
        }
    };

    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!event) return <p>Loading...</p>;

    return (
        <div className="container mt-5">
            <h2>{event.title}</h2>
            <p><strong>Date:</strong>{new Date(event.date).toLocaleDateString("en-GB",{
                day: "numeric",
                month: "long",
                year: "numeric"
            })}</p>
            <p><strong>Location:</strong>{event.location}</p>
            <p><strong>Description:</strong>{event.description || "No description provided"}</p>

            {role === "user" && (
                <button className="btn btn-primary" onClick={handleRegister}>Register</button>
            )}

            {role === "organizer" && (
                <div className="mt-4">
                    <h4>Participants</h4>
                    {participants.length > 0 ?(
                        <ul className="list-group">
                            {participants.map((p)=>(
                                <li key={p._id} className="list-group-item">{p.name}</li>
                            ))}
                        </ul>
                    ):(
                        <p>No Participants yet.</p>
                    )}
                </div>
            )}
            {success && <div className="alert alert-success mt-3">{success}</div>}
        </div>
    );
}