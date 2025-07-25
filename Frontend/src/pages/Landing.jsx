import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const [requestId, setRequestId] = useState('');
  const [vehicleType, setVehicleType] = useState('ambulance');

  const handleNavigation = () => {
    if (requestId.trim()) {
      navigate(`/navigation/${vehicleType}/${requestId}`);
    } else {
      alert('Please enter a valid request ID');
    }
  };

  const services = [
    {
      icon: '🚑',
      title: 'Ambulance Booking',
      description: 'Quick and reliable ambulance dispatch for medical emergencies with real-time tracking.'
    },
    {
      icon: '🚒',
      title: 'Fire Emergency Response',
      description: 'Rapid fire truck deployment with specialized equipment for fire and rescue operations.'
    },
    {
      icon: '👮',
      title: 'Police Support',
      description: 'Immediate police response for security and law enforcement emergencies.'
    },
    {
      icon: '📍',
      title: 'Real-time Tracking',
      description: 'Live GPS tracking of emergency vehicles with estimated arrival times.'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Request Help',
      description: 'Call emergency services or use our digital platform to request immediate assistance.'
    },
    {
      step: '2',
      title: 'We Dispatch',
      description: 'Our system automatically dispatches the nearest available emergency vehicle.'
    },
    {
      step: '3',
      title: 'Help Arrives',
      description: 'Emergency responders arrive at your location with professional medical care.'
    }
  ];

  const benefits = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Average response time under 5 minutes in urban areas'
    },
    {
      icon: '🛡️',
      title: 'Reliable Service',
      description: '24/7 availability with professional emergency responders'
    },
    {
      icon: '📱',
      title: 'Easy to Use',
      description: 'Simple interface for quick emergency requests and tracking'
    },
    {
      icon: '🏥',
      title: 'Professional Care',
      description: 'Certified medical professionals and emergency personnel'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Emergency Response Coordinator',
      text: 'This system has revolutionized our emergency response capabilities. The real-time tracking feature is invaluable.',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Emergency Medicine',
      text: 'The quick response times and professional service have significantly improved patient outcomes in critical situations.',
      rating: 5
    },
    {
      name: 'Officer David Rodriguez',
      role: 'Police Department',
      text: 'Seamless integration between different emergency services has made our job more efficient and effective.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 py-24 sm:py-32 lg:py-48">
        {/* Background Animation - Subtle grid/dots */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="animated-grid"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6 animate-fade-in-down">
            REACT (Rapid Emergency Action & Coordination Tool)
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-100 mb-8 animate-fade-in">
            Seamless Emergency Coordination Platform
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Harnessing cutting-edge technology to provide immediate, reliable, and integrated emergency response services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
            >
              Get Started Now
            </button>
            <button
              onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-gray-500 text-gray-100 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore Features
            </button>
          </div>
        </div>

        {/* CSS for background grid animation */}
        <style jsx>{`
          .animated-grid {
            width: 100%;
            height: 100%;
            background-size: 80px 80px;
            background-image:
              radial-gradient(circle, #3b82f6 1px, rgba(0,0,0,0) 1px),
              radial-gradient(circle, #8b5cf6 1px, rgba(0,0,0,0) 1px);
            background-position: 0 0, 40px 40px;
            animation: moveGrid 60s linear infinite;
          }

          @keyframes moveGrid {
            0% {
              background-position: 0 0, 40px 40px;
            }
            100% {
              background-position: 80px 80px, 120px 120px;
            }
          }

          /* General entrance animations */
          @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
          .animate-fade-in { animation: fade-in 0.8s ease-out forwards; animation-delay: 0.2s; }
          .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; animation-delay: 0.4s; }
        `}</style>
      </div>

      {/* About Section */}
      <div className="py-20 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
              About Our Integrated Emergency System
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Our mission is to provide immediate, reliable, and professional emergency response services to communities.
              We integrate ambulance, fire, and police services into one seamless platform, ensuring the fastest possible
              response times when lives are at stake. With real-time tracking, professional emergency personnel, and
              24/7 availability, we're committed to saving lives and protecting communities.
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-20 bg-gray-950 text-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
              Core Services
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive emergency response solutions engineered for speed, reliability, and professional care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:bg-gray-700 border border-transparent hover:border-blue-500"
              >
                <div className="text-4xl mb-4 text-blue-400">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-100 mb-3">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
              Our Process
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Simple, fast, and reliable emergency response in just three steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-md">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-100 mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gradient-to-r from-blue-900 to-purple-900 text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Why REACT?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We combine cutting-edge technology with professional emergency response to deliver unmatched service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-purple-400"
              >
                <div className="text-3xl mb-4 text-blue-300">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-300 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-950 text-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
              Insights from Emergency Professionals
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Trusted by emergency responders and healthcare professionals nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-gray-700 border border-transparent hover:border-indigo-500"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-100">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tracking Section */}
      <div className="py-20 bg-gray-900 text-gray-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
              Track Emergency Response
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Monitor real-time location and estimated arrival time of emergency vehicles.
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Emergency Request ID
                </label>
                <input
                  type="text"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  placeholder="Enter request ID"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="ambulance">Ambulance</option>
                  <option value="fire_truck">Fire Truck</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleNavigation}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
            >
              Track Emergency Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 text-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Integrate?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of communities that trust our emergency response system for their safety and peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
            >
              Access Emergency Services
            </button>
            <button
              onClick={() => navigate('/register')}
              className="border-2 border-gray-500 text-gray-100 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-1"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-100 mb-4">REACT</h3>
              <p className="text-gray-500">
                Professional emergency response services available 24/7 for your safety and peace of mind.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-100 mb-4">Services</h4>
              <ul className="space-y-2 text-gray-500">
                <li>Ambulance Services</li>
                <li>Fire Emergency</li>
                <li>Police Support</li>
                <li>Real-time Tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-100 mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-500">
                <li>Emergency: 911</li>
                <li>Support: (555) 123-4567</li>
                <li>Email: support@emergency.com</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-100 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-500">
                <li><button onClick={() => navigate('/login')} className="hover:text-blue-400 transition duration-200">Login</button></li>
                <li><button onClick={() => navigate('/register')} className="hover:text-blue-400 transition duration-200">Register</button></li>
                <li><button onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-400 transition duration-200">Services</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2024 REACT. All rights reserved. Engineering safety, protecting futures.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}