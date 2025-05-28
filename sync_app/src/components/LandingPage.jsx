import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaChalkboardTeacher, FaUserGraduate, FaChartLine, FaMobileAlt, FaCloud, FaBars, FaTimes } from 'react-icons/fa';
import { IoMdSchool } from 'react-icons/io';
import { MdAdminPanelSettings, MdAttachMoney } from 'react-icons/md';
import { RiParentFill } from 'react-icons/ri';
import { FiArrowRight } from 'react-icons/fi';

const EduSyncLanding = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    school: '',
    phone: '',
    message: ''
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Demo requested:', demoForm);
    setShowDemoModal(false);
    // Reset form
    setDemoForm({
      name: '',
      email: '',
      school: '',
      phone: '',
      message: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDemoForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <IoMdSchool className="text-3xl text-white" />
            <span className="text-2xl font-bold">EduSync</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#features" className="hover:text-indigo-200 transition duration-300">Features</a>
            <a href="#benefits" className="hover:text-indigo-200 transition duration-300">Benefits</a>
            <a href="#testimonials" className="hover:text-indigo-200 transition duration-300">Testimonials</a>
            <a href="#pricing" className="hover:text-indigo-200 transition duration-300">Pricing</a>
            <Link to="/auth/school-registration">
              <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-100 transition duration-300 shadow-md">
                Get Started
              </button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-indigo-700 mt-4 rounded-lg p-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="hover:text-indigo-200 transition duration-300" onClick={toggleMenu}>Features</a>
              <a href="#benefits" className="hover:text-indigo-200 transition duration-300" onClick={toggleMenu}>Benefits</a>
              <a href="#testimonials" className="hover:text-indigo-200 transition duration-300" onClick={toggleMenu}>Testimonials</a>
              <a href="#pricing" className="hover:text-indigo-200 transition duration-300" onClick={toggleMenu}>Pricing</a>
              <Link to="/auth/school-registration">
                <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-100 transition duration-300 shadow-md mt-2">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Transform Your School <span className="text-yellow-300">Management</span> with EduSync
            </h1>
            <p className="text-xl mb-8 text-indigo-100 max-w-lg">
              Comprehensive, cloud-based solution designed to streamline all aspects of school administration, teaching, and learning.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => setShowDemoModal(true)}
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-indigo-100 transition duration-300 flex items-center justify-center shadow-lg transform hover:-translate-y-1"
              >
                Request Demo <FiArrowRight className="ml-2 animate-pulse" />
              </button>
              <button 
                onClick={() => setShowLearnMoreModal(true)}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-500 transition duration-300 shadow-lg transform hover:-translate-y-1"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Students using EduSync" 
                className="rounded-lg shadow-2xl max-w-md w-full relative z-10 border-4 border-white"
              />
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-indigo-400 rounded-lg z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 relative">
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-indigo-600 to-transparent opacity-10"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm font-semibold mb-3">
              Powerful Features
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need in One Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your school operations with our comprehensive suite of tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaChalkboardTeacher className="text-indigo-600 text-2xl" />,
                title: "Teacher Portal",
                description: "Lesson planning, gradebook, attendance tracking, and communication tools all in one place."
              },
              {
                icon: <FaUserGraduate className="text-indigo-600 text-2xl" />,
                title: "Student Management",
                description: "Comprehensive student profiles, performance tracking, and behavior management tools."
              },
              {
                icon: <MdAdminPanelSettings className="text-indigo-600 text-2xl" />,
                title: "Administration Tools",
                description: "Streamline admissions, staff management, timetable creation, and resource allocation."
              },
              {
                icon: <RiParentFill className="text-indigo-600 text-2xl" />,
                title: "Parent Portal",
                description: "Real-time access to student progress, attendance, fees, and school communications."
              },
              {
                icon: <MdAttachMoney className="text-indigo-600 text-2xl" />,
                title: "Financial Management",
                description: "Fee collection, expense tracking, payroll, and comprehensive financial reporting."
              },
              {
                icon: <FaChartLine className="text-indigo-600 text-2xl" />,
                title: "Analytics Dashboard",
                description: "Powerful data visualization tools to track performance metrics and make data-driven decisions."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-indigo-500"
              >
                <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">2</div>
              <div className="text-indigo-100">Schools</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">2000+</div>
              <div className="text-indigo-100">Students</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-indigo-100">Satisfaction</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-indigo-100">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm font-semibold mb-3">
              Why Choose Us
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The EduSync Advantage</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how EduSync can transform your educational institution
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaMobileAlt className="text-3xl text-white" />,
                title: "Mobile Friendly",
                description: "Access all features from any device, anywhere, anytime with our responsive design."
              },
              {
                icon: <FaCloud className="text-3xl text-white" />,
                title: "Cloud-Based",
                description: "No installation required. Automatic updates and backups keep your data secure."
              },
              {
                icon: <IoMdSchool className="text-3xl text-white" />,
                title: "Customizable",
                description: "Tailor the system to your school's unique needs and workflows."
              }
            ].map((benefit, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-gray-800">{benefit.title}</h3>
                <p className="text-gray-600 text-center">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm font-semibold mb-3">
              Testimonials
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from educators who have transformed their schools with EduSync
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                initials: "JM",
                name: "James Mwangi",
                role: "Principal, Nairobi School",
                quote: "EduSync has revolutionized how we manage our school. The attendance tracking and reporting features alone have saved us countless hours.",
                rating: 5
              },
              
              {
                initials: "NN",
                name: "Peter Kariuki",
                role: "Principal",
                quote: " I appreciate how intuitive the gradebook is. It's cut my administrative work in half.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold mr-4">
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "{testimonial.quote}"
                </p>
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm font-semibold mb-3">
              Pricing
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your educational institution
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Basic",
                price: "KSh 15,000",
                period: "/month",
                description: "Perfect for small schools just getting started",
                features: [
                  "Up to 200 students",
                  "Core features",
                  "Email support",
                  "Basic reporting"
                ],
                cta: "Get Started",
                featured: false
              },
              {
                name: "Standard",
                price: "KSh 30,000",
                period: "/month",
                description: "Ideal for growing schools with more needs",
                features: [
                  "Up to 500 students",
                  "All Basic features",
                  "Priority support",
                  "Advanced analytics",
                  "Parent portal"
                ],
                cta: "Get Started",
                featured: true
              },
              {
                name: "Premium",
                price: "KSh 60,000",
                period: "/month",
                description: "For large institutions with complex needs",
                features: [
                  "Unlimited students",
                  "All Standard features",
                  "24/7 dedicated support",
                  "Custom reporting",
                  "API access",
                  "Custom onboarding"
                ],
                cta: "Get Started",
                featured: false
              }
            ].map((plan, index) => (
              <div 
                key={index}
                className={`relative rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden ${plan.featured ? "border-2 border-indigo-500 transform md:-translate-y-4" : "border border-gray-200"}`}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-end mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  <Link to="/auth/school-registration">
                    <button className={`w-full py-3 px-4 rounded-lg font-bold transition duration-300 ${plan.featured ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"}`}>
                      {plan.cta}
                    </button>
                  </Link>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your School?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of schools already benefiting from EduSync's comprehensive management solution.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/auth/school-registration">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-indigo-100 transition duration-300 shadow-lg transform hover:-translate-y-1">
                Get Started Today
              </button>
            </Link>
            <button 
              onClick={() => setShowDemoModal(true)}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-500 transition duration-300 shadow-lg transform hover:-translate-y-1"
            >
              Request a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <IoMdSchool className="text-3xl text-indigo-400" />
                <span className="text-2xl font-bold">EduSync</span>
              </div>
              <p className="text-gray-400">
                Comprehensive school management software designed to streamline administration and enhance learning.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition duration-300">Features</a></li>
                <li><a href="#benefits" className="text-gray-400 hover:text-white transition duration-300">Benefits</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition duration-300">Testimonials</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition duration-300">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  info@edusync.com
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  +254 98971625
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Nairobi, Kenya
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition duration-300 text-gray-300 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition duration-300 text-gray-300 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition duration-300 text-gray-300 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EduSync. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Demo Request Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Request a Demo</h3>
                <button 
                  onClick={() => setShowDemoModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <form onSubmit={handleDemoSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={demoForm.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={demoForm.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">School/Institution</label>
                    <input
                      type="text"
                      id="school"
                      name="school"
                      value={demoForm.school}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={demoForm.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                    <textarea
                      id="message"
                      name="message"
                      value={demoForm.message}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-indigo-700 transition duration-300 shadow-md"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Learn More Modal */}
      {showLearnMoreModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">About EduSync</h3>
                <button 
                  onClick={() => setShowLearnMoreModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">Our Mission</h4>
                  <p className="text-gray-700">
                    EduSync was founded with the mission to revolutionize school management systems by providing an all-in-one, intuitive platform that empowers educators, administrators, students, and parents to work together seamlessly.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">Key Features</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Comprehensive student information system with performance tracking</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Automated attendance management with real-time notifications</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Integrated financial management including fee collection and expense tracking</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Customizable reporting and analytics dashboard</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Secure cloud-based platform accessible from any device</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">Our Team</h4>
                  <p className="text-gray-700">
                    Our team consists of experienced educators, software engineers, and business professionals who are passionate about improving education through technology. We understand the unique challenges schools face and have designed EduSync specifically to address these needs.
                  </p>
                </div>
                <div className="pt-4">
                  <Link to="/auth/school-registration">
                    <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-indigo-700 transition duration-300 shadow-md">
                      Get Started Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EduSyncLanding;
