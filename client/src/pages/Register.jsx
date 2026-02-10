import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user && user.role === 'user') {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        const res = await register(formData);
        if (res.success) {
            navigate('/login');
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
            {/* Decorative Blur Backgrounds */}
            <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-blue-50 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-50 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="premium-card w-full max-w-xl p-10 md:p-14 relative z-10"
            >
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-foreground transition-colors mb-8">
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                </Link>

                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-4xl font-black mb-3 tracking-tight">Create Account</h1>
                    <p className="text-gray-500 font-medium">Join the next generation of access management</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 ml-1">Full Name</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    required
                                    autoComplete="name"
                                    className="input-premium w-full px-5"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 ml-1">Email Address</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="input-premium w-full px-5"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 ml-1">Password</label>
                        <div className="relative group">
                            <input
                                type="password"
                                required
                                autoComplete="new-password"
                                className="input-premium w-full px-5"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium w-full flex items-center justify-center gap-3 mt-4 h-16"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Create Account</span>
                                <UserPlus size={22} className="opacity-70" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-10 text-gray-400 font-medium text-sm">
                    Already a member?{' '}
                    <Link to="/login" className="text-foreground hover:underline font-black underline-offset-4">Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
