import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Clock, CheckCircle2, XCircle, QrCode as QrIcon, RefreshCcw, Sparkles, Trash2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const Dashboard = () => {
    const { user, getApiUrl } = useAuth();
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newPass, setNewPass] = useState({ purpose: '', type: 'standard' });
    const [copiedId, setCopiedId] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (copiedId) {
            const timer = setTimeout(() => setCopiedId(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [copiedId]);

    useEffect(() => {
        const socketUrl = getApiUrl();
        const newSocket = io(socketUrl);
        setSocket(newSocket);
        newSocket.emit('join', user.id);
        newSocket.on('passUpdate', (updatedPass) => {
            setPasses(prev => prev.map(p => p.id === updatedPass.id ? updatedPass : p));
        });
        return () => newSocket.close();
    }, [user.id]);

    useEffect(() => {
        fetchPasses();
    }, []);

    const fetchPasses = async () => {
        try {
            const res = await axios.get('/api/passes/mine');
            setPasses(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error('Error fetching passes:', err);
        } finally {
            setLoading(false);
        }
    };
    const hasPendingPass = passes.some(p => p.status === 'pending');

    const handleCreatePass = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/passes', newPass);
            setPasses([res.data, ...passes]);
            setShowModal(false);
            setNewPass({ purpose: '', type: 'standard' });
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating pass');
        }
    };

    const handleDropPass = async (passId) => {
        if (!window.confirm('Are you sure you want to drop this pass?')) return;
        try {
            await axios.delete(`/api/passes/${passId}`);
            setPasses(prev => prev.filter(p => p.id !== passId));
        } catch (err) {
            alert(err.response?.data?.message || 'Error dropping pass');
        }
    };

    return (
        <div className="pt-40 pb-20 px-6 container mx-auto relative min-h-screen">
            {/* Decorative Blurs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/50 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">My Digital Passes</h1>
                    <p className="text-gray-500 font-medium">Request and manage your secure entry tokens</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    disabled={hasPendingPass}
                    className={`btn-premium flex items-center gap-3 group ${hasPendingPass ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                >
                    <Plus size={20} className="transition-transform group-hover:rotate-90" />
                    <span>{hasPendingPass ? 'Active Pass Exists' : 'Request New Pass'}</span>
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <RefreshCcw className="animate-spin text-primary" size={32} />
                </div>
            ) : passes.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="premium-card text-center py-32 space-y-6 flex flex-col items-center"
                >
                    <div className="p-6 rounded-3xl bg-primary/5 text-primary">
                        <QrIcon size={48} strokeWidth={1.5} />
                    </div>
                    <div className="max-w-sm">
                        <h2 className="text-xl font-bold mb-2">No Active Passes</h2>
                        <p className="text-gray-500 font-medium">You haven't requested any digital passes yet. Create one to get started.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-premium py-3 px-10"
                    >
                        Create Your First Pass
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    <AnimatePresence>
                        {passes.map((pass) => (
                            <motion.div
                                key={pass.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="premium-card p-8 group overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`p-3 rounded-2xl ${pass.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                        pass.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                            'bg-rose-50 text-rose-600'
                                        }`}>
                                        {pass.status === 'completed' ? <CheckCircle2 size={24} /> :
                                            pass.status === 'pending' ? <Clock size={24} className="animate-pulse" /> :
                                                <XCircle size={24} />}
                                    </div>
                                    <span className="text-[10px] bg-black/5 px-3 py-1.5 rounded-full text-foreground/50 uppercase tracking-[0.15em] font-black">
                                        {pass.type}
                                    </span>
                                </div>

                                <div className="mb-8">
                                    <h3 className="font-black text-xl mb-1 truncate" title={pass.purpose}>{pass.purpose}</h3>
                                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                        <div className="flex items-center gap-2 group/copy cursor-pointer hover:text-primary transition-colors" onClick={() => {
                                            navigator.clipboard.writeText(pass.id);
                                            setCopiedId(pass.id);
                                        }}>
                                            <span className="transition-all">
                                                {copiedId === pass.id ? (
                                                    <span className="text-emerald-500 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-left-1">
                                                        <CheckCircle2 size={10} />
                                                        Copied!
                                                    </span>
                                                ) : pass.id}
                                            </span>
                                            {copiedId !== pass.id && <Copy size={10} className="opacity-0 group-hover/copy:opacity-100 transition-opacity" />}
                                        </div>
                                        {pass.status === 'pending' && pass.expiresAt && (
                                            <span className="text-primary/70">Expires at {new Date(pass.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-black/5 p-6 mb-8 aspect-square max-w-[200px] mx-auto transition-transform duration-500 group-hover:scale-105">
                                    <img
                                        src={pass.qrCode}
                                        alt="QR Code"
                                        className="w-full h-full object-contain opacity-100 transition-opacity duration-300 pointer-events-none"
                                    />

                                    {pass.status !== 'pending' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center backdrop-blur-sm p-6 text-center"
                                        >
                                            <div className={`mb-3 ${pass.status === 'completed' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {pass.status === 'completed' ? <CheckCircle2 size={48} strokeWidth={1.5} /> : <XCircle size={48} strokeWidth={1.5} />}
                                            </div>
                                            <span className="font-black uppercase tracking-[0.2em] text-xs mb-1">
                                                {pass.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400">
                                                {pass.status === 'expired'
                                                    ? `Expired at ${new Date(pass.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                                    : new Date(pass.completedAt || pass.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </motion.div>
                                    )}
                                </div>

                                {pass.status === 'pending' && (
                                    <button
                                        onClick={() => handleDropPass(pass.id)}
                                        className="w-full mb-6 py-3 px-4 rounded-2xl bg-rose-50 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors group/drop"
                                    >
                                        <Trash2 size={14} className="transition-transform group/drop:scale-110" />
                                        <span>Drop Pass</span>
                                    </button>
                                )}

                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 pt-6 border-t border-black/5">
                                    <span>Issued at</span>
                                    <span className="text-foreground/60">
                                        {new Date(pass.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(pass.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal Overlay */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/60 backdrop-blur-xl"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="premium-card w-full max-w-md p-10 relative z-[201]"
                        >
                            <div className="flex items-center gap-2 mb-8">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <Sparkles size={18} />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight">New Digital Pass</h2>
                            </div>

                            <form onSubmit={handleCreatePass} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Destination Category</label>
                                    <select
                                        required
                                        className="input-premium w-full bg-white appearance-none"
                                        value={newPass.purpose}
                                        onChange={(e) => setNewPass({ ...newPass, purpose: e.target.value })}
                                    >
                                        <option value="">Select Destination</option>
                                        <option value="Library">Library</option>
                                        <option value="Food Court">Food Court</option>
                                        <option value="Sports Complex">Sports Complex</option>
                                        <option value="Main Gate">Main Gate</option>
                                        <option value="Auditorium">Auditorium</option>
                                        <option value="Hostel">Hostel</option>
                                    </select>
                                    <p className="text-[10px] text-primary/60 font-medium ml-1 flex items-center gap-1">
                                        <Clock size={10} />
                                        <span>Each pass is strictly valid for 3 hours.</span>
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Pass Type</label>
                                    <select
                                        className="input-premium w-full bg-white appearance-none"
                                        value={newPass.type}
                                        onChange={(e) => setNewPass({ ...newPass, type: e.target.value })}
                                    >
                                        <option value="standard">Standard Entry</option>
                                        <option value="emergency">Emergency / Priority</option>
                                        <option value="one-time">One-Time Access</option>
                                    </select>
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="btn-premium-outline flex-1 py-4"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-premium flex-1 py-4"
                                    >
                                        Generate Pass
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default Dashboard;
