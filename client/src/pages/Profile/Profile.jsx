import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function Profile() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <p>My Profile</p>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
