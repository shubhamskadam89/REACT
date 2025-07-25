import { useState, useEffect, useRef } from 'react'; // Added useEffect for cursor setup
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'; // Import Framer Motion hooks
import bgGif from '../assets/background.gif';

export default function Landing() {
  const navigate = useNavigate();
  const [requestId, setRequestId] = useState('');
  const [vehicleType, setVehicleType] = useState('ambulance');

  // --- Custom iOS-style pointer logic ---
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const [pointerVariant, setPointerVariant] = useState('default'); // 'default' | 'button'

  // Responsive pointer size
  const pointerSize = pointerVariant === 'button' ? 56 : 32;
  const pointerBorderRadius = pointerVariant === 'button' ? '1.5rem' : '50%';
  const pointerBg = pointerVariant === 'button' ? 'bg-blue-500/80' : 'bg-white/80';
  const pointerShadow = pointerVariant === 'button' ? 'shadow-2xl' : 'shadow-lg';

  // Smooth spring animation
  const springConfig = { damping: 18, stiffness: 180, mass: 0.5 };
  const pointerXSpring = useSpring(pointerX, springConfig);
  const pointerYSpring = useSpring(pointerY, springConfig);

  useEffect(() => {
    const move = (e) => {
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [pointerX, pointerY]);

  // --- End custom pointer logic ---

  // Button hover handlers for pointer morph
  const handlePointerEnter = () => setPointerVariant('button');
  const handlePointerLeave = () => setPointerVariant('default');

  // Define cursor variants for animation
  const variants = {
    default: {
      width: 28,
      height: 28,
      backgroundColor: "rgba(100, 100, 100, 0.5)",
      x: 0,
      y: 0,
      mixBlendMode: "normal",
      border: "1.5px solid rgba(255, 255, 255, 0.6)",
      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.18)",
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 28 }
    },
    text: {
      width: 80,
      height: 80,
      backgroundColor: "rgba(59, 130, 246, 0.4)",
      x: 0,
      y: 0,
      mixBlendMode: "difference",
      border: "2px solid rgba(59, 130, 246, 0.8)",
      boxShadow: "0 4px 16px 0 rgba(59,130,246,0.18)",
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 28 }
    },
    link: {
      width: 50,
      height: 50,
      backgroundColor: "rgba(139, 92, 246, 0.4)",
      x: 0,
      y: 0,
      mixBlendMode: "difference",
      border: "2px solid rgba(139, 92, 246, 0.8)",
      boxShadow: "0 4px 16px 0 rgba(139,92,246,0.18)",
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 28 }
    },
    cta: {
      width: 60,
      height: 60,
      backgroundColor: "rgba(16, 185, 129, 0.4)", // Emerald for CTA
      x: 0,
      y: 0,
      mixBlendMode: "difference",
      border: "2.5px solid rgba(16, 185, 129, 0.9)",
      boxShadow: "0 6px 24px 0 rgba(16,185,129,0.18)",
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 28 }
    },
    danger: {
      width: 50,
      height: 50,
      backgroundColor: "rgba(239, 68, 68, 0.3)", // Red
      x: 0,
      y: 0,
      mixBlendMode: "difference",
      border: "2.5px solid rgba(239, 68, 68, 0.9)",
      boxShadow: "0 6px 24px 0 rgba(239,68,68,0.18)",
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 28 }
    },
    success: {
      width: 50,
      height: 50,
      backgroundColor: "rgba(34, 197, 94, 0.3)", // Green
      x: 0,
      y: 0,
      mixBlendMode: "difference",
      border: "2.5px solid rgba(34, 197, 94, 0.9)",
      boxShadow: "0 6px 24px 0 rgba(34,197,94,0.18)",
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 28 }
    },
    info: {
      width: 50,
      height: 50,
      backgroundColor: "rgba(59, 130, 246, 0.3)", // Blue
      x: 0,
      y: 0,
      mixBlendMode: "difference",
      border: "2.5px solid rgba(59, 130, 246, 0.9)",
      boxShadow: "0 6px 24px 0 rgba(59,130,246,0.18)",
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 28 }
    },
  };

  const textEnter = () => {};
  const linkEnter = () => {};
  const ctaEnter = () => {};
  const dangerEnter = () => {};
  const successEnter = () => {};
  const infoEnter = () => {};
  const leave = () => {};

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

  // Add a second typewriter for REACT and its full form
  const reactPhrases = [
    "REACT",
    "Rapid Emergency Action & Coordination Technology"
  ];
  const typewriterPhrases = [
    "Emergency Response",
    "Live Tracking",
    "AI-Powered Routing"
  ];

  function useTypewriter(phrases, typingSpeed = 70, deletingSpeed = 40, pause = 1200) {
    const [index, setIndex] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [blink, setBlink] = useState(true);
    const timeoutRef = useRef();

    useEffect(() => {
      setBlink(true);
      let timeout;
      if (!isDeleting && displayed.length < phrases[index].length) {
        timeout = setTimeout(() => {
          setDisplayed(phrases[index].slice(0, displayed.length + 1));
        }, typingSpeed);
      } else if (!isDeleting && displayed.length === phrases[index].length) {
        timeout = setTimeout(() => setIsDeleting(true), pause);
      } else if (isDeleting && displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(phrases[index].slice(0, displayed.length - 1));
        }, deletingSpeed);
      } else if (isDeleting && displayed.length === 0) {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % phrases.length);
        }, 400);
      }
      timeoutRef.current = timeout;
      return () => clearTimeout(timeout);
    }, [displayed, isDeleting, index, phrases, typingSpeed, deletingSpeed, pause]);

    // Blinking cursor
    useEffect(() => {
      const blinkInterval = setInterval(() => setBlink((b) => !b), 500);
      return () => clearInterval(blinkInterval);
    }, []);

    return { text: displayed, blink };
  }

  const mainTypewriter = useTypewriter(reactPhrases, 90, 50, 1400);
  const featureTypewriter = useTypewriter(typewriterPhrases, 70, 40, 1200);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-100 font-sans relative overflow-hidden">
      {/* Background GIF */}
      <div className="fixed inset-0 w-screen h-screen -z-10 overflow-hidden">
        <img
          src={bgGif}
          alt="Background animation"
          className="w-full h-full object-cover object-center select-none pointer-events-none"
          draggable="false"
        />
      </div>
      {/* Custom iOS-style pointer */}
      <motion.div
        className={`fixed z-[9999] pointer-events-none ${pointerBg} ${pointerShadow}`}
        style={{
          left: 0,
          top: 0,
          width: pointerSize,
          height: pointerSize,
          borderRadius: pointerBorderRadius,
          x: pointerXSpring,
          y: pointerYSpring,
          translateX: '-50%',
          translateY: '-50%',
          boxShadow: pointerVariant === 'button' ? '0 8px 32px 0 rgba(59,130,246,0.25)' : '0 2px 8px 0 rgba(0,0,0,0.18)',
          border: pointerVariant === 'button' ? '2.5px solid #3b82f6' : '1.5px solid #e5e7eb',
          transition: 'border-radius 0.2s, background 0.2s, border 0.2s',
        }}
        animate={{
          scale: pointerVariant === 'button' ? 1.15 : 1,
          borderRadius: pointerBorderRadius,
        }}
      />
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 sm:py-32 lg:py-48">
        {/* Background Animation - Subtle grid/dots */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="animated-grid"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 rounded-2xl shadow-xl">
          {/* HERO SECTION */}
          <div className="w-full flex flex-col items-center justify-center py-16 select-none rounded-xl shadow-lg">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-center mb-2">
              {mainTypewriter.text}
              <motion.span
                animate={{ opacity: mainTypewriter.blink ? 1 : 0 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                className="inline-block w-4 text-blue-400"
              >|
              </motion.span>
            </h1>
            <div className="inline-block text-2xl sm:text-3xl font-mono h-12">
              <span>{featureTypewriter.text}</span>
              <motion.span
                className="inline-block w-2 h-8 align-middle ml-1 bg-gray-100 rounded"
                animate={{ opacity: featureTypewriter.blink ? 1 : 0 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
              />
            </div>
          </div>
          <motion.p
            className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
            onMouseEnter={textEnter}
            onMouseLeave={leave}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Harnessing cutting-edge technology to provide immediate, reliable, and integrated emergency response services.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => navigate('/login')}
              onMouseEnter={handlePointerEnter}
              onMouseLeave={handlePointerLeave}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Get Started Now
            </motion.button>
            <motion.button
              onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={handlePointerEnter}
              onMouseLeave={handlePointerLeave}
              className="border-2 border-gray-500 text-gray-100 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 transform"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Explore Features
            </motion.button>
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
        `}</style>
      </div>

      {/* About Section */}
      <div className="py-20 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-100 mb-6"
              onMouseEnter={textEnter}
              onMouseLeave={leave}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              About Our Integrated Emergency System
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed"
              onMouseEnter={textEnter}
              onMouseLeave={leave}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Our mission is to provide immediate, reliable, and professional emergency response services to communities.
              We integrate ambulance, fire, and police services into one seamless platform, ensuring the fastest possible
              response times when lives are at stake. With real-time tracking, professional emergency personnel, and
              24/7 availability, we're committed to saving lives and protecting communities.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-20 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-100 mb-6"
              onMouseEnter={textEnter}
              onMouseLeave={leave}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              Core Services
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400 max-w-3xl mx-auto"
              onMouseEnter={textEnter}
              onMouseLeave={leave}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Comprehensive emergency response solutions engineered for speed, reliability, and professional care.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-lg transition-all duration-300 border border-white/20"
                onMouseEnter={linkEnter}
                onMouseLeave={leave}
                whileHover={{ scale: 1.02, y: -5, backgroundColor: '#374151' }} /* Darker gray for hover */
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4 text-blue-400">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-100 mb-3">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-100 mb-6"
              onMouseEnter={textEnter}
              onMouseLeave={leave}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              Our Process
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400 max-w-3xl mx-auto"
              onMouseEnter={textEnter}
              onMouseLeave={leave}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Simple, fast, and reliable emergency response in just three steps.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                className="text-center rounded-xl p-8 shadow-lg border"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-md">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-100 mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              onMouseEnter={textEnter}
              onMouseLeave={leave}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              Why REACT?
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              onMouseEnter={textEnter}
              onMouseLeave={leave}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              We combine cutting-edge technology with professional emergency response to deliver unmatched service.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border shadow-lg"
                onMouseEnter={linkEnter}
                onMouseLeave={leave}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-3xl mb-4 text-blue-300">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-300 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-100 mb-6"
              onMouseEnter={textEnter}
              onMouseLeave={leave}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              Insights from Emergency Professionals
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400 max-w-3xl mx-auto"
              onMouseEnter={textEnter}
              onMouseLeave={leave}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Trusted by emergency responders and healthcare professionals nationwide.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-lg transition-all duration-300 border"
                onMouseEnter={linkEnter}
                onMouseLeave={leave}
                whileHover={{ scale: 1.02, y: -5, backgroundColor: '#374151' }} /* Darker gray for hover */
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tracking Section */}
      <div className="py-20 text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-100 mb-6"
              onMouseEnter={textEnter}
              onMouseLeave={leave}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              Track Emergency Response
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400 max-w-3xl mx-auto"
              onMouseEnter={textEnter}
              onMouseLeave={leave}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Monitor real-time location and estimated arrival time of emergency vehicles.
            </motion.p>
          </div>

          <motion.div
            className="rounded-2xl p-8 shadow-lg border"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Emergency Request ID
                </label>
                <input
                  type="text"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  onMouseEnter={textEnter}
                  onMouseLeave={leave}
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
                  onMouseEnter={linkEnter}
                  onMouseLeave={leave}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="ambulance">Ambulance</option>
                  <option value="fire_truck">Fire Truck</option>
                </select>
              </div>
            </div>
            <motion.button
              onClick={handleNavigation}
              onMouseEnter={linkEnter}
              onMouseLeave={leave}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg shadow-lg transform"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Track Emergency Vehicle
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20 text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            onMouseEnter={textEnter}
            onMouseLeave={leave}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            Ready to Integrate?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            onMouseEnter={textEnter}
            onMouseLeave={leave}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Join thousands of communities that trust our emergency response system for their safety and peace of mind.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => navigate('/login')}
              onMouseEnter={ctaEnter}
              onMouseLeave={leave}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transform"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Access Emergency Services
            </motion.button>
            <motion.button
              onClick={() => navigate('/register')}
              onMouseEnter={linkEnter}
              onMouseLeave={leave}
              className="border-2 border-gray-500 text-gray-100 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 transform"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Contact Support
            </motion.button>
          </div>
        </div>
      </div>

      {/* Example usage of new cursor variants */}
      <div className="flex gap-4 justify-center mt-8 rounded-xl p-6 border shadow-lg">
        <button
          onMouseEnter={dangerEnter}
          onMouseLeave={leave}
          className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition"
        >
          Danger Action
        </button>
        <button
          onMouseEnter={successEnter}
          onMouseLeave={leave}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
        >
          Success Action
        </button>
        <button
          onMouseEnter={infoEnter}
          onMouseLeave={leave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Info Action
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-purple-900 text-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}>
              <h3 className="text-xl font-semibold text-gray-100 mb-4">REACT</h3>
              <p className="text-gray-500">
                Professional emergency response services available 24/7 for your safety and peace of mind.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h4 className="font-semibold text-gray-100 mb-4">Services</h4>
              <ul className="space-y-2 text-gray-500">
                <li>Ambulance Services</li>
                <li>Fire Emergency</li>
                <li>Police Support</li>
                <li>Real-time Tracking</li>
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h4 className="font-semibold text-gray-100 mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-500">
                <li>Emergency: 911</li>
                <li>Support: (555) 123-4567</li>
                <li>Email: support@emergency.com</li>
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <h4 className="font-semibold text-gray-100 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-500">
                <li><motion.button onClick={() => navigate('/login')} onMouseEnter={linkEnter} onMouseLeave={leave} className="hover:text-blue-400 transition duration-200">Login</motion.button></li>
                <li><motion.button onClick={() => navigate('/register')} onMouseEnter={linkEnter} onMouseLeave={leave} className="hover:text-blue-400 transition duration-200">Register</motion.button></li>
                <li><motion.button onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })} onMouseEnter={linkEnter} onMouseLeave={leave} className="hover:text-blue-400 transition duration-200">Services</motion.button></li>
              </ul>
            </motion.div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2024 REACT. All rights reserved. Engineering safety, protecting futures.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}