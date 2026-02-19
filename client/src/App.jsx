import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import UserDashboard from "./pages/UserDashboard";
import EventDetails from "./pages/EventDetails";


function App() {
  return(
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/events" element={<Events/>} />
        <Route path="/organizer-dashboard" element={<OrganizerDashboard/>} />
        <Route path="/user-dashboard" element={<UserDashboard/>} />
        <Route path="/events/:id" element={<EventDetails/>} />

      </Routes>
    </Router>
  );
}

export default App;
