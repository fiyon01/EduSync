import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import QuickOverview from "./QuickOverview";
import Students from "./Students";
import FeePaymentSystem from "./FeePaymentSystem";
import TeachersManagement from "./TeachersManagement";
import SmartAnalyticsDashboard from "./SmartAnalyticsDashboard";
import SchoolSettings from "./SchoolSettings";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Simulate content loading delay
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        when: "beforeChildren"
      }
    },
    closed: { 
      x: "-100%",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        when: "afterChildren"
      } 
    }
  };

  const overlayVariants = {
    open: { opacity: 0.5 },
    closed: { opacity: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const loaderVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeInOut" }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Animated Sidebar */}
      <motion.div
        initial="closed"
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed z-50 md:relative md:translate-x-0"
      >
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </motion.div>

      {/* Animated Overlay for Small Screens */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        className="flex-1 flex flex-col overflow-hidden md:ml-64"
      >
        {/* Navbar with subtle animation */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Navbar toggleSidebar={toggleSidebar} />
        </motion.div>

        {/* Dynamic Content with Loader */}
        <div className="flex-1 overflow-y-auto p-6 mt-16">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={loaderVariants}
                className="flex justify-center items-center h-full"
              >
                <motion.div
                  variants={loaderVariants}
                  animate="spin"
                  className="border-t-4 border-blue-500 border-opacity-75 rounded-full w-12 h-12"
                />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={
                      <motion.div {...pageTransition}>
                        <QuickOverview />
                      </motion.div>
                    } />
                    <Route path="students" element={
                      <motion.div {...pageTransition}>
                        <Students />
                      </motion.div>
                    } />
                    <Route path="fee" element={
                      <motion.div {...pageTransition}>
                        <FeePaymentSystem />
                      </motion.div>
                    } />
                    <Route path="teachers" element={
                      <motion.div {...pageTransition}>
                        <TeachersManagement />
                      </motion.div>
                    } />
                    <Route path="analytics" element={
                      <motion.div {...pageTransition}>
                        <SmartAnalyticsDashboard />
                      </motion.div>
                    } />
                    <Route path="school-settings" element={
                      <motion.div {...pageTransition}>
                        <SchoolSettings />
                      </motion.div>
                    } />
                  </Routes>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;