import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, ArrowLeft, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user && user.role === 'user') {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const res = await login(email, password, role);
        if (res.success) {
            // Redirect based on role
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Decorative Blur Backgrounds */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-100 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="premium-card w-full max-w-md p-10 relative z-10"
            >
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-foreground transition-colors mb-10">
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                </Link>

                <div className="mb-10">
                    <h1 className="text-4xl font-black mb-3 tracking-tight">Sign In</h1>
                    <p className="text-gray-500 font-medium">Continue to your QueueFlow dashboard</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold"
                    >
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 ml-1">Email Address</label>
                        <div className="relative group">
                            <input
                                type="email"
                                required
                                autoComplete="email"
                                className="input-premium w-full px-5"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 ml-1">Password</label>
                        <div className="relative group">
                            <input
                                type="password"
                                required
                                autoComplete="current-password"
                                className="input-premium w-full px-5"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium w-full flex items-center justify-center gap-3 mt-4 h-14"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <LogIn size={22} className="opacity-70" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-10 text-gray-400 font-medium text-sm">
                    New here?{' '}
                    <Link to="/register" className="text-foreground hover:underline font-black underline-offset-4">Create Account</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
