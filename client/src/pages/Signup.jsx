import { useState } from "react";
import axios from "axios";

export default function Signup(){
    //State variables for form inputs and error message
    const [name, setName] = useState("");//name input
    const [email, setEmail] = useState("");//email input
    const [password, setPassword] = useState("");//password input
    const [error, setError] = useState("");//error message

    //Function to run on form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //Get API URL
            const API_URL = import.meta.env.VITE_API_URL;

            //Send signup req to backend
            const res = await axios.post(`${API_URL}/auth/register`, {name, email, password});

            //Redirect to login page
            alert(res.data.message);
            window.location.href = "/login";
        } catch (err) {
            setError(err.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="p-4 bg-white rounded shadow mx-auto"  style={{width: "100%",maxWidth: "400px"}}>
                    <form onSubmit={handleSubmit} >
                        <h2 className="text-center mb-4">Signup</h2>

                        {/* Show error message if login fails */}
                        {error && <div className="alert alert-danger">{error}</div>}

                        {/* Name input */}
                        <div className="mb-3">
                            <input type="text" placeholder="Name" className="form-control" value={name} onChange={
                                (e) => setName(e.target.value)
                            } />
                        </div>

                        {/* Email input */}
                        <div className="mb-3">
                            <input type="email" placeholder="Email" className="form-control" value={email} onChange={
                                (e) => setEmail(e.target.value)
                            } />
                        </div>

                        {/* Password input */}
                        <div className="mb-3">
                        <input type="password" placeholder="Password" className="form-control" value={password} onChange={
                            (e) => setPassword(e.target.value)
                        } />
                        </div>

                        {/* Submit button */}
                        <button type="submit" className="btn btn-primary w-100">Signup</button>
                    </form>
            </div>
        </div>
    );
}