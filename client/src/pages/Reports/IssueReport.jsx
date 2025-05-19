import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function IssueReport() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <p>Reports</p>
      </main>
      <Footer />
    </div>
  );
}

export default IssueReport;
