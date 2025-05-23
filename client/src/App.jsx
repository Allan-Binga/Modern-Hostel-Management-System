import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./pages/landingPage/LandingPage";
import AdministratorHome from "./pages/Administrator/Home";
import AdministratorSignup from "./pages/Administrator/Signup";
import AdministratorLogin from "./pages/Administrator/Login";
import TenantHome from "./pages/Homes/TenantHome";
import TenantSignup from "./pages/Tenant/Signup";
import TenantLogin from "./pages/Tenant/Login";
import PasswordReset from "./pages/PasswordReset/PasswordReset";
import Verification from "./pages/AccountVerification/Verification";
import IssueReport from "./pages/Reports/IssueReport";
import Bookings from "./pages/Bookings/Bookings";
import Advertisements from "./pages/Advertisements/Advertisements";
import Contact from "./pages/Contact/Contact";
import Profile from "./pages/Profile/Profile";
import AccountSettings from "./pages/AccountSettings/AccountSettings";
import Messages from "./pages/Messages/Messages";
import Success from "./pages/PaymentSuccess/Success";
import Failure from "./pages/PaymentFailure/Failure";
import PasswordChange from "./pages/PasswordReset/PasswordChange";
import VisitorsLogin from "./pages/Visitors/Login";
import VisitorHomes from "./pages/Visitors/Home";
import AdminBookings from "./pages/Bookings/AdminBookings";
import AdminReports from "./pages/Reports/AdminReports";
import AdminAdvertisements from "./pages/Advertisements/AdminAdvertisements";
import Tenants from "./pages/Tenants/Tenants";
import TenantVisitors from "./pages/Visitors/TenantVisitors";
import AdminVisitors from "./pages/Visitors/AdminVisitors";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/administrator/signup" element={<AdministratorSignup />} />
        <Route path="/administrator/login" element={<AdministratorLogin />} />
        <Route path="/administrator/home" element={<AdministratorHome />} />
        <Route path="/visitors/login" element={<VisitorsLogin />} />
        <Route path="/prestige-hostels" element={<LandingPage />} />
        <Route path="/visitors/home" element={<VisitorHomes />} />
        <Route path="/home" element={<TenantHome />} />
        <Route path="/signup" element={<TenantSignup />} />
        <Route path="/login" element={<TenantLogin />} />
        <Route path="/forgot-password" element={<PasswordReset />} />
        <Route path="/account-verification" element={<Verification />} />
        <Route path="/issue-reports" element={<IssueReport />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/advertisements" element={<Advertisements />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/password/reset" element={<PasswordChange />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/payments/success" element={<Success />} />
        <Route path="/payments/failure" element={<Failure />} />
        <Route path="/administrator/bookings" element={<AdminBookings />} />
        <Route path="/administrator/issue-reports" element={<AdminReports />} />
        <Route
          path="/administrator/advertisements"
          element={<AdminAdvertisements />}
        />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/administrator/visitors" element={<AdminVisitors />} />
        <Route path="/visitors" element={<TenantVisitors />} />
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
  );
}

export default App;
