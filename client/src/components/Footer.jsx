import PrestigeLogo from "../assets/prestigeLogo.png";

function Footer() {
  return (
    <footer className="bg-gray-200 text-pink-950">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-center md:text-left mb-4 md:mb-0">
          © 2025 Prestige Girls Hostel. All rights reserved.
        </div>
        <div>
          <img
            src={PrestigeLogo}
            alt="PST"
            className="w-24 h-24 object-contain md:w-32 md:h-32"
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
