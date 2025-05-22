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
import Failure from "./pages/PaymentFailure/Failure"
import PasswordChange from "./pages/PasswordReset/PasswordChange";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/prestige-hostels" />} />
        <Route path="/administrator/signup" element={<AdministratorSignup />} />
        <Route path="/administrator/login" element={<AdministratorLogin />} />
        <Route path="/administrator/home" element={<AdministratorHome />} />
        <Route path="/prestige-hostels" element={<LandingPage />} />
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
        <Route path="/messages" element={<Messages/>}/>
        <Route path="/payments/success" element={<Success/>}/>
        <Route path="/payments/failure" element={<Failure/>}/>
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
