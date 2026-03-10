import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Administrator/Home";
import Signup from "./pages/Administrator/Signup";
import Login from "./pages/Administrator/Login";
import Bookings from "./pages/Bookings/AdminBookings";
import Reports from "./pages/Reports/AdminReports";
import Advertisements from "./pages/Advertisements/AdminAdvertisements";
import Visitors from "./pages/Visitors/AdminVisitors";
import Tenants from "./pages/Tenants/Tenants";

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/prestige-admin/signup" element={<Signup />} />
        <Route path="/prestige-admin/login" element={<Login />} />
        <Route path="/prestige-admin/home" element={<Home />} />
        <Route path="/prestige-admin/bookings" element={<Bookings />} />
        <Route path="/prestige-admin/issue-reports" element={<Reports />} />
        <Route path="/prestige-admin/tenants" element={<Tenants />} />
        <Route path="/prestige-admin/advertisements" element={<Advertisements />} />
        <Route path="/prestige-admin/visitors" element={<Visitors />} />
      </Routes>

      {/* Global ToastContainer */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Slide}
      />
    </Router>
  )
}

export default App
