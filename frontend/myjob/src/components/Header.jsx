import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Menu, X, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Header = () => {
    const {user, isAuthenticated, logout}=useAuth()
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.6}}
    className='fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-50/50 shadow-sm'>
        <div className='container mx-auto px-4'>
            <div className='flex items-center justify-between h-16 md:h-20'>
                {/* Logo Section */}
                <div 
                    onClick={() => navigate("/")} 
                    className='flex items-center space-x-3 cursor-pointer group'>
                    <img src="/logo.png" className="w-10 h-10" />
                    <span className='text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                        My Job
                    </span>
                </div>

                {/* Desktop Navigation */}
                <nav className='hidden lg:flex items-center space-x-10'>
                    <a onClick={() => navigate("/login")} className='text-gray-600 hover:text-blue-600 transition-colors font-semibold cursor-pointer text-sm uppercase tracking-wider'>Find Jobs</a>
                    <a onClick={() => navigate(isAuthenticated && user?.role === "employer" ? "/employer-dashboard" : "/login")} className='text-gray-600 hover:text-blue-600 transition-colors font-semibold cursor-pointer text-sm uppercase tracking-wider'>For Employers</a>
                </nav>

                {/* Desktop Auth Section */}
                <div className='hidden md:flex items-center space-x-4'>
                    {isAuthenticated ? (
                        <div className='flex items-center space-x-4'>
                            <div className='hidden xl:flex flex-col items-end'>
                                <span className='text-xs text-gray-500 font-medium uppercase'>Welcome back</span>
                                <span className='text-sm font-bold text-gray-900'>{user?.name || user?.fullName}</span>
                            </div>
                            <button 
                                onClick={() => navigate(user?.role === "employer" ? "/employer-dashboard" : "/find-jobs")}
                                className='flex items-center space-x-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 transform hover:-translate-y-0.5'>
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Dashboard</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <button onClick={() => navigate("/login")}
                                className='flex items-center space-x-2 text-gray-700 bg-gray-50 hover:bg-gray-100 px-6 py-2.5 rounded-xl font-bold transition-all duration-300'>
                                <LogIn className="w-4 h-4" />
                                <span>Login</span>
                            </button>
                            <button onClick={() => navigate("/signup")}
                                className='flex items-center space-x-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-7 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 transform hover:-translate-y-0.5'>
                                <UserPlus className="w-4 h-4" />
                                <span>Sign Up</span>
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className='lg:hidden flex items-center space-x-4'>
                    {!isAuthenticated && (
                        <button onClick={() => navigate("/login")}
                            className='md:hidden text-blue-600 font-bold text-sm'>
                            Login
                        </button>
                    )}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className='p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300'>
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
            {isMenuOpen && (
                <motion.div
                    initial={{opacity: 0, height: 0}}
                    animate={{opacity: 1, height: 'auto'}}
                    exit={{opacity: 0, height: 0}}
                    transition={{duration: 0.3, ease: "easeInOut"}}
                    className='lg:hidden bg-white border-t border-gray-100 overflow-hidden'>
                    <div className='container mx-auto px-4 py-6 space-y-4'>
                        <a onClick={() => { navigate("/find-jobs"); setIsMenuOpen(false); }} className='block px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-bold transition-all cursor-pointer'>
                            Find Jobs
                        </a>
                        <a onClick={() => { navigate(isAuthenticated && user?.role === "employer" ? "/employer-dashboard" : "/login"); setIsMenuOpen(false); }} className='block px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-bold transition-all cursor-pointer'>
                            For Employers
                        </a>
                        <div className='pt-4 border-t border-gray-50 space-y-3'>
                            {isAuthenticated ? (
                                <>
                                    <div className='px-4 py-2'>
                                        <p className='text-xs text-gray-400 uppercase font-bold tracking-widest mb-1'>Account</p>
                                        <p className='font-bold text-gray-900'>{user?.name || user?.fullName}</p>
                                    </div>
                                    <button 
                                        onClick={() => { navigate(user?.role === "employer" ? "/employer-dashboard" : "/find-jobs"); setIsMenuOpen(false); }}
                                        className='w-full flex items-center justify-center space-x-2 bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg'>
                                        <LayoutDashboard className="w-5 h-5" />
                                        <span>Go to Dashboard</span>
                                    </button>
                                    <button 
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className='w-full py-4 text-red-500 font-bold'>
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <div className='grid grid-cols-2 gap-3'>
                                    <button 
                                        onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
                                        className='flex items-center justify-center space-x-2 bg-gray-50 text-gray-700 py-4 rounded-xl font-bold'>
                                        <LogIn className="w-5 h-5" />
                                        <span>Login</span>
                                    </button>
                                    <button 
                                        onClick={() => { navigate("/signup"); setIsMenuOpen(false); }}
                                        className='flex items-center justify-center space-x-2 bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold'>
                                        <UserPlus className="w-5 h-5" />
                                        <span>Sign Up</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.header>
  )
}

export default Header;
