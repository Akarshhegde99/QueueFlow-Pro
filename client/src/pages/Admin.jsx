import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { ScanLine, CheckCircle2, AlertCircle, Hash, ArrowLeft, RefreshCw, Smartphone, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Admin = () => {
    const [scanning, setScanning] = useState(false);
    const [passDetails, setPassDetails] = useState(null);
    const [approvalCode, setApprovalCode] = useState('');
    const [userInputCode, setUserInputCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [recentVerifications, setRecentVerifications] = useState([]);
    const [html5QrCode, setHtml5QrCode] = useState(null);

    useEffect(() => {
        fetchRecentVerifications();
        const scanner = new Html5Qrcode("reader");
        setHtml5QrCode(scanner);
        return () => {
            if (scanner && scanner.isScanning) {
                scanner.stop().catch(e => console.log(e));
            }
        };
    }, []);

    const startCamera = async () => {
        if (!html5QrCode) return;
        setScanning(true);
        setError('');
        try {
            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                onScanSuccess
            );
        } catch (err) {
            console.error(err);
            setError("Camera access denied or device not found. Please check permissions.");
            setScanning(false);
        }
    };

    const stopCamera = async () => {
        if (html5QrCode && html5QrCode.isScanning) {
            await html5QrCode.stop();
        }
        setScanning(false);
    };

    const fetchRecentVerifications = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/passes`);
            const completed = res.data
                .filter(p => p.status === 'completed')
                .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                .slice(0, 5);
            setRecentVerifications(completed);
        } catch (err) {
            console.error('Error fetching history', err);
        }
    };

    const onScanSuccess = async (decodedText) => {
        await stopCamera();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/passes/verify`, { qrToken: decodedText });
            setPassDetails(res.data);
            setApprovalCode(res.data.approvalCode);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid QR Code');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileScanner = new Html5Qrcode("reader-hidden");
        try {
            setLoading(true);
            setError('');
            const decodedText = await fileScanner.scanFile(file, true);
            await onScanSuccess(decodedText);
        } catch (err) {
            setError('Could not find a valid QR Code in this image.');
        } finally {
            setLoading(false);
            fileScanner.clear();
        }
    };

    const onScanError = (err) => { /* Continuous scanning */ };

    const handleApprove = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/passes/approve`, {
                passId: passDetails.passId,
                code: userInputCode
            });
            setSuccess(true);
            fetchRecentVerifications(); // Update the history list
            setTimeout(() => {
                setPassDetails(null);
                setSuccess(false);
                setUserInputCode('');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid Code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-40 pb-20 px-6 container mx-auto max-w-5xl relative min-h-screen">
            {/* Decorative Blurs */}
            <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 text-foreground">Admin Portal</h1>
                    <p className="text-gray-500 font-medium">Verified security gateway for digital tokens</p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="btn-premium-outline cursor-pointer flex items-center gap-3">
                        <Smartphone size={20} />
                        <span>Upload QR</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                    <button
                        onClick={() => {
                            if (scanning) {
                                stopCamera();
                            } else {
                                startCamera();
                                setPassDetails(null);
                            }
                        }}
                        className={`btn-premium flex items-center gap-3 ${scanning ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' : ''}`}
                    >
                        {scanning ? <ArrowLeft size={20} /> : <ScanLine size={20} />}
                        <span>{scanning ? 'Stop Scanning' : 'Open Camera'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                {/* Hidden reader for file scanning */}
                <div id="reader-hidden" className="hidden"></div>

                {/* Left Side: Scanner or Details or Placeholder */}
                <div className="space-y-8">
                    {/* The reader MUST be always in the DOM for Html5Qrcode to work reliably */}
                    <motion.div
                        initial={false}
                        animate={{ height: scanning ? 'auto' : 0, opacity: scanning ? 1 : 0 }}
                        className={`premium-card overflow-hidden bg-white border-2 border-primary/20 transition-all duration-500 ${scanning ? 'p-6 mb-8' : 'p-0 h-0 border-0 opacity-0'}`}
                    >
                        <div id="reader" className="w-full rounded-[2.5rem] overflow-hidden border border-black/5 mx-auto"></div>
                        <div className="pt-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
                                    Active Scanning Mode
                                </p>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400">
                                Position the student's QR code within the frame to verify
                            </p>
                        </div>
                    </motion.div>

                    {!scanning && !passDetails && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="premium-card h-[450px] flex flex-col items-center justify-center space-y-6 border-dashed bg-white/40 group"
                        >
                            <div className="p-8 rounded-[2.5rem] bg-black/5 text-gray-300 transition-transform group-hover:scale-110 duration-500">
                                <ShieldCheck size={80} strokeWidth={1} />
                            </div>
                            <div className="text-center max-w-xs">
                                <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-3">Gateway Locked</p>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    Use the camera scanner or upload a ticket image to authenticate the student's entry pass.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {!scanning && passDetails && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="premium-card p-10"
                        >
                            <div className="flex items-center gap-3 mb-10 pb-6 border-b border-black/5">
                                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">Access Verified</h2>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Security Authenticated</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="p-6 rounded-[2rem] bg-stone-50 border border-black/5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Student Identity</p>
                                            <p className="font-black text-xl text-foreground">{passDetails.userName}</p>
                                            <p className="text-xs font-bold text-gray-500">{passDetails.userEmail}</p>
                                        </div>
                                        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-tighter">
                                            {passDetails.userRole}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-[1.5rem] bg-stone-50 border border-black/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Destination</p>
                                    <p className="font-bold text-sm">{passDetails.purpose}</p>
                                </div>

                                <div className="pt-4">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Internal ID</div>
                                    <code className="text-[10px] font-mono bg-black/5 px-2 py-1 rounded text-gray-500">{passDetails.passId}</code>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-[2rem] flex items-center gap-4 text-sm font-bold shadow-lg shadow-rose-500/5 transition-all"
                        >
                            <AlertCircle size={24} />
                            <div className="flex flex-col">
                                <span className="uppercase tracking-widest text-[9px] font-black opacity-60">Authentication Error</span>
                                <span>{error}</span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right Side: Approval Logic or Welcome Message */}
                <div className="space-y-8">
                    {passDetails ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="premium-card p-10 h-full flex flex-col justify-between"
                        >
                            <div>
                                <div className="mb-10">
                                    <h2 className="text-2xl font-black tracking-tight mb-2">Final Authorization</h2>
                                    <p className="text-sm font-medium text-gray-400">Review the secure session code below</p>
                                </div>

                                <div className="bg-stone-50 rounded-[2.5rem] p-12 mb-10 text-center border border-black/5 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-3 relative z-10">Approval Code</span>
                                    <span className="text-7xl font-black tracking-[0.15em] text-foreground relative z-10">{approvalCode}</span>
                                </div>

                                <form onSubmit={handleApprove} className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Confirm Identity Code</label>
                                        <div className="relative">
                                            <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                                            <input
                                                type="text"
                                                required
                                                maxLength={4}
                                                placeholder="0 0 0 0"
                                                className="input-premium w-full pl-14 text-3xl font-black tracking-[0.5em] text-center h-20"
                                                value={userInputCode}
                                                onChange={(e) => setUserInputCode(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={loading || success}
                                        className={`btn-premium w-full h-16 text-lg flex items-center justify-center gap-3 transition-all duration-500 shadow-xl shadow-primary/10 ${success ? 'bg-emerald-500 hover:bg-emerald-500 shadow-emerald-500/20' : ''}`}
                                    >
                                        {loading ? <RefreshCw className="animate-spin" /> :
                                            success ? <CheckCircle2 size={24} /> : (
                                                <>
                                                    <span>Authorize Access</span>
                                                    <ShieldCheck size={24} className="opacity-70" />
                                                </>
                                            )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="premium-card p-10 bg-gradient-to-br from-primary/5 to-transparent border-primary/10"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                    <RefreshCw size={20} />
                                </div>
                                <h3 className="text-xl font-black tracking-tight">Security History</h3>
                            </div>

                            <div className="space-y-4">
                                {recentVerifications.length > 0 ? (
                                    recentVerifications.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-black/5 hover:border-primary/20 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-primary font-black text-xs">
                                                    {item.userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-foreground">{item.userName}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.purpose}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Approved</p>
                                                <p className="text-[9px] font-bold text-gray-400">
                                                    {new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No recent records</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
