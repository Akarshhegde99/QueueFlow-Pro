import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Lock, Eye, Save, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-slate-50/50 pt-32 pb-20">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-foreground transition-colors mb-10">
                        <ArrowLeft size={16} />
                        <span>Back to Home</span>
                    </Link>

                    <div className="premium-card p-10 md:p-16 mb-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                <Shield size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight">Privacy Details</h1>
                                <p className="text-gray-500 font-medium">Last updated: February 2026</p>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                        <Lock size={18} />
                                    </div>
                                    <h2 className="text-xl font-bold">Data Collection</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed pl-1">
                                    QueueFlow collects minimal personal information necessary to provide secure campus access. This includes your <strong>Full Name</strong>, <strong>Institutional Email</strong>, and <strong>encrypted password</strong>. We do not collect private phone numbers or personal home addresses.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                                        <Eye size={18} />
                                    </div>
                                    <h2 className="text-xl font-bold">Security & QR Tokens</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed pl-1">
                                    Every digital pass you generate is unique to your session. QR codes are generated using <strong>AES-256 equivalent encryption</strong> principles. To ensure campus safety, tokens are set to automatically expire after <strong>3 hours</strong>, after which they are rendered invalid and archived in our secure logs.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                        <Save size={18} />
                                    </div>
                                    <h2 className="text-xl font-bold">Data Retention</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed pl-1">
                                    Activity logs (pass history) are retained for a period of 30 days to assist in campus security audits. After this period, data is either anonymized or permanently deleted from our primary servers.
                                </p>
                            </section>

                            <section className="bg-slate-50 p-8 rounded-3xl border border-black/5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                                        <Trash2 size={18} />
                                    </div>
                                    <h2 className="text-xl font-bold">Your Rights</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    As a user of QueueFlow, you have the right to request access to your data or its deletion at any time, subject to institutional security policies.
                                </p>
                            </section>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Privacy;
