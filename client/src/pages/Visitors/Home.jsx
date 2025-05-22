import VisitorNavbar from "./Navbar";
import Footer from "../../components/Footer";
import PrestigeLogo from "../../assets/prestigeLogo.png";

function VisitorHome() {
  return (
    <div>
      <VisitorNavbar />
      <div>
        <img src={PrestigeLogo} alt="Your Home" />
      </div>
      <Footer />
    </div>
  );
}

export default VisitorHome;
