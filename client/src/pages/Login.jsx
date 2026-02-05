import { useState } from "react";//Import react hook for state management
import axios from "axios";//Import axios for API requests

export default function Login() {

    //State variables for form inputs and error message
    const [email, setEmail] = useState("");//email input
    const [password, setPassword] = useState("");//password input
    const [error, setError] = useState("");//error message

    //Function runs when form is submitted
    const handeSubmit = async (e) => {
        e.preventDefault();//Prevent page refresh
        try {
            //Get API base URL from .env
            const API_URL = import.meta.env.VITE_API_URL;
            
            //Send login req to backend
            const res = await axios.post(`${API_URL}/auth/login`,{email,password});
            
            //Save JWT in local storage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);

            //Redirect to events page
            if (res.data.role === "organizer") {
                window.location.href = "/organizer-dashboard";
            } else {
                window.location.href = "/user-dashboard";
            }
        
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="p-4 bg-white rounded shadow mx-auto"  style={{width: "100%",maxWidth: "400px"}}>
                    <form onSubmit={handeSubmit} >
                        <h2 className="text-center mb-4">Login</h2>

                        {/* Show error message if login fails */}
                        {error && <div className="alert alert-danger">{error}</div>}

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
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
            </div>
        </div>
    );
}