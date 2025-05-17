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
import TenantHome from "./pages/Tenant/Home";
import TenantSignup from "./pages/Tenant/Signup";
import TenantLogin from "./pages/Tenant/Login";
import PasswordReset from "./pages/PasswordReset/PasswordReset";

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
      </Routes>

      {/* Global ToastContainer */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </Router>
  );
}

export default App;
