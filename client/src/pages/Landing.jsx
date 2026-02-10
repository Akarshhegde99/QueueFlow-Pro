import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, QrCode, Shield, Zap, Sparkles } from 'lucide-react';

const Landing = () => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background 3D-like Elements */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        y: [0, -40, 0],
                        rotate: [0, 10, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-purple-100/50 rounded-full blur-3xl opacity-30"
                />
                <motion.div
                    animate={{
                        y: [0, 30, 0],
                        rotate: [0, -5, 0],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-3xl opacity-20"
                />

                {/* Animated 3D Track Element (Abstract representation of the user image) */}
                <div className="absolute top-[15%] right-[5%] w-[400px] h-[400px] hidden lg:block opacity-40">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-200">
                        <motion.path
                            d="M 50 10 Q 90 10 90 50 Q 90 90 50 90 Q 10 90 10 50 Q 10 10 50 10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.circle
                            r="3"
                            fill="#6b46c1"
                            animate={{
                                offsetDistance: ["0%", "100%"]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            style={{ offsetPath: "path('M 50 10 Q 90 10 90 50 Q 90 90 50 90 Q 10 90 10 50 Q 10 10 50 10')" }}
                        />
                    </svg>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative z-10 container mx-auto px-6 pt-48 pb-20">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center gap-2 mb-6"
                    >
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <Sparkles size={18} />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest text-primary/80">QueueFlow Pro AI</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-8xl font-black text-foreground leading-[1.1] mb-4 tracking-tight"
                    >
                        Smart College <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">Digital Entry</span> <br />
                        System.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl text-gray-500 mb-12 max-w-xl leading-relaxed"
                    >
                        Secure your campus with time-limited digital passes. Generate 3-hour access tokens for
                        Library, Food Court, and Sports Complex in one seamless platform.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap gap-4"
                    >
                        <Link to="/register" className="btn-premium flex items-center gap-3 group">
                            <span>Get started</span>
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link to="/login" className="btn-premium-outline">
                            Sign in to dashboard
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="relative z-10 container mx-auto px-6 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-black/5 pt-20">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="space-y-4"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <QrCode size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Instant QR Tokens</h3>
                        <p className="text-gray-500">Generate secure, time-sensitive entry passes instantly from your mobile device.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="space-y-4"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Secure Verification</h3>
                        <p className="text-gray-500">Dual-factor admin approval with mandatory 4-digit session codes for maximum security.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="space-y-4"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Real-time Status</h3>
                        <p className="text-gray-500">Experience lighting-fast updates via Socket.IO. No more manual page refreshing.</p>
                    </motion.div>
                </div>
            </div>

            {/* Footer with Privacy Details */}
            <footer className="relative z-10 border-t border-black/5 py-12 bg-white/30 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">Q</div>
                            <span className="font-bold text-gray-400">© 2026 QueueFlow. All rights reserved.</span>
                        </div>
                        <div className="flex items-center gap-8">
                            <Link to="/admin/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                                <Shield size={12} />
                                <span>Staff Portal</span>
                            </Link>
                            <Link to="/privacy" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-foreground">Privacy Policy</Link>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Landing;
