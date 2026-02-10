import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, ShieldCheck, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const isLanding = location.pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navClasses = isScrolled
        ? 'bg-white/60 backdrop-blur-xl border-b border-black/5 py-4'
        : 'bg-transparent py-8';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] px-6 transition-all duration-500 ease-in-out flex justify-between items-center ${navClasses}`}>
            <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light rotate-12 flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-0">
                    <div className="w-5 h-5 bg-white rounded-full opacity-60" />
                </div>
                <span className="text-2xl font-black text-foreground">QueueFlow</span>
            </Link>

            <div className="flex items-center gap-8">
                {!user ? (
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-foreground transition-colors">Sign in</Link>
                        <Link to="/register" className="btn-premium py-2 px-6">Get started</Link>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:flex items-center gap-6">
                            {user.role === 'user' && (
                                <Link
                                    to="/dashboard"
                                    className={`text-sm font-bold flex items-center gap-2 transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : 'text-gray-500 hover:text-foreground'}`}
                                >
                                    <LayoutDashboard size={18} />
                                    <span>Dashboard</span>
                                </Link>
                            )}
                            {user.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className={`text-sm font-bold flex items-center gap-2 transition-colors ${location.pathname === '/admin' ? 'text-primary' : 'text-gray-500 hover:text-foreground'}`}
                                >
                                    <ShieldCheck size={18} />
                                    <span>Admin Panel</span>
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center gap-4 pl-6 border-l border-black/5">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-xs font-black text-foreground">{user.name}</span>
                                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{user.role}</span>
                            </div>
                            <button
                                onClick={() => logout()}
                                className="p-2.5 rounded-xl bg-black/5 hover:bg-black/10 text-gray-500 hover:text-foreground transition-all active:scale-95"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
