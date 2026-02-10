import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        // Strictly force 'admin' role
        const res = await login(email, password, 'admin');
        if (res.success) {
            navigate('/admin');
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-100 rounded-full blur-[100px] opacity-40" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-slate-200 rounded-full blur-[100px] opacity-40" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="premium-card w-full max-w-md p-10 relative z-10 border-2 border-primary/10"
            >
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-foreground transition-colors mb-10">
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                </Link>

                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                        <ShieldCheck size={12} />
                        <span>Security Gateway</span>
                    </div>
                    <h1 className="text-4xl font-black mb-3 tracking-tight">Admin login</h1>
                    <p className="text-gray-500 font-medium">Internal access for verified authorities</p>
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
                        <label className="text-sm font-bold text-gray-600 ml-1">Admin Email</label>
                        <div className="relative group">
                            <input
                                type="email"
                                required
                                className="input-premium w-full px-5"
                                placeholder="admin@queueflow.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 ml-1">Secure Password</label>
                        <div className="relative group">
                            <input
                                type="password"
                                required
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
                        className="btn-premium w-full flex items-center justify-center gap-3 mt-4 h-14 bg-slate-900 hover:bg-black"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Authorize Login</span>
                                <LogIn size={22} className="opacity-70" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-10 text-gray-400 font-medium text-[10px] uppercase tracking-widest">
                    This is a protected system. All access attempts are logged.
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
