import VisitorNavbar from "./Navbar";
import Footer from "../../components/Footer";
import PrestigeLogo from "../../assets/prestigeLogo.png";

function VisitorHome() {
  return (
    <div className="flex flex-col min-h-screen">
      <VisitorNavbar />
      <div className="flex-grow flex items-center justify-center">
        <img src={PrestigeLogo} alt="Your Home" className="max-w-full h-auto" />
      </div>
      <Footer />
    </div>
  );
}

export default VisitorHome;
