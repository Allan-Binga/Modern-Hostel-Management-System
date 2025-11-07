import { useState } from "react";
import { Menu, X, Users, Bed, Shield, Clock } from "lucide-react";

function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-pink-900">Prestige Hostel</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-pink-900 transition">Features</a>
              <a href="#about" className="text-gray-700 hover:text-pink-900 transition">About</a>
              <a href="#contact" className="text-gray-700 hover:text-pink-900 transition">Contact</a>
              <a 
                href="/login" 
                className="px-6 py-2 bg-pink-900 text-white rounded-full hover:bg-pink-800 transition duration-200"
              >
                Sign In
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-pink-900"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 pt-2 pb-4 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-pink-900 py-2">Features</a>
              <a href="#about" className="block text-gray-700 hover:text-pink-900 py-2">About</a>
              <a href="#contact" className="block text-gray-700 hover:text-pink-900 py-2">Contact</a>
              <a 
                href="/login" 
                className="block text-center px-6 py-2 bg-pink-900 text-white rounded-full hover:bg-pink-800 transition duration-200"
              >
                Sign In
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Welcome to <span className="text-pink-900">Prestige Hostel</span>
              </h1>
              <p className="text-lg text-gray-600">
                Experience seamless hostel management with our modern, efficient system. Manage bookings, residents, and facilities all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/signup" 
                  className="px-8 py-3 bg-pink-900 text-white rounded-full hover:bg-pink-800 transition duration-200 text-center font-semibold"
                >
                  Get Started
                </a>
                <a 
                  href="#features" 
                  className="px-8 py-3 bg-white text-pink-900 border-2 border-pink-900 rounded-full hover:bg-pink-50 transition duration-200 text-center font-semibold"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop" 
                  alt="Modern Hostel" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Prestige Hostel?
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive features designed for modern hostel management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-pink-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <Users className="text-pink-900" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600">
                Efficiently manage residents, staff, and administrators with role-based access control.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-pink-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <Bed className="text-pink-900" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Room Allocation</h3>
              <p className="text-gray-600">
                Smart room allocation system with real-time availability tracking and automated assignments.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-pink-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-pink-900" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Industry-standard security measures to protect sensitive resident and operational data.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-pink-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="text-pink-900" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Access</h3>
              <p className="text-gray-600">
                Access the system anytime, anywhere with our cloud-based management platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
                <img 
                  src="https://media.istockphoto.com/id/1215927063/photo/studying-is-a-cruise-when-you-love-your-majors.webp?a=1&b=1&s=612x612&w=0&k=20&c=f3LsnYr5BKIRL318BWUevKDCdYRr-HAkDTdrogaZya4=" 
                  alt="Team Collaboration" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                About Prestige Hostel Management
              </h2>
              <p className="text-lg text-gray-600">
                We provide a comprehensive hostel management solution that streamlines operations, enhances resident experience, and simplifies administrative tasks.
              </p>
              <p className="text-lg text-gray-600">
                Our platform is designed with both administrators and residents in mind, offering intuitive interfaces and powerful features that make hostel management effortless.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/signup" 
                  className="px-8 py-3 bg-pink-900 text-white rounded-full hover:bg-pink-800 transition duration-200 text-center font-semibold"
                >
                  Join Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join Prestige Hostel today and experience the future of hostel management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="px-8 py-3 bg-pink-900 text-white rounded-full hover:bg-pink-800 transition duration-200 text-center font-semibold"
            >
              Create Account
            </a>
            <a 
              href="/login" 
              className="px-8 py-3 bg-white text-pink-900 border-2 border-pink-900 rounded-full hover:bg-pink-50 transition duration-200 text-center font-semibold"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Prestige Hostel</h3>
          <p className="text-gray-400 mb-4">
            Modern hostel management made simple
          </p>
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
            <a href="#about" className="text-gray-400 hover:text-white transition">About</a>
            <a href="#contact" className="text-gray-400 hover:text-white transition">Contact</a>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 Prestige Hostel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;