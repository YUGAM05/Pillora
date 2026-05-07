"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToken } from '@/lib/tokenStorage';
import {
    ShieldCheck,
    AlertCircle,
    Clock,
    CreditCard,
    CheckCircle2,
    XCircle,
    Package,
    ArrowRight,
    Info,
    History,
    ShieldAlert
} from 'lucide-react';

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ReturnPolicyPage() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-24 px-6 overflow-hidden bg-slate-50 border-b border-gray-100">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-40" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={fadeIn}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-blue-600 uppercase bg-blue-100 rounded-full">
                            Customer Protection
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                            Pillora <span className="text-blue-600">Return & Refund</span> Policy
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed font-medium">
                            Transparent guidelines to ensure your medical safety and satisfaction with every order.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="space-y-16"
                    >
                        {/* 1. The Safety First Rule */}
                        <motion.div variants={fadeIn} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-12 hover:shadow-xl transition-all">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
                                    <ShieldCheck className="w-9 h-9" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 mb-6 uppercase tracking-tight">1. The &quot;Safety First&quot; Rule</h2>
                                    <p className="text-gray-500 text-lg font-medium mb-8 leading-relaxed">
                                        To maintain the highest medical standards, Pillora only accepts returns for items that are:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { title: "Damaged Transit", desc: "Broken bottle or tampered seal upon arrival.", icon: <ShieldAlert className="w-5 h-5" /> },
                                            { title: "Incorrect Delivery", desc: "Medicine doesn't match prescription or order.", icon: <AlertCircle className="w-5 h-5" /> },
                                            { title: "Expired Item", desc: "Medicine passed its expiry date upon delivery.", icon: <History className="w-5 h-5" /> }
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors">
                                                <div className="text-blue-600 mb-3">{item.icon}</div>
                                                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4 items-start">
                                        <Info className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                                        <p className="text-sm text-amber-800 font-bold leading-relaxed">
                                            Note: We cannot accept returns for medicines that were correctly delivered but are no longer needed (e.g., if a doctor changes a prescription after the order is fulfilled).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. Non-Returnable Categories */}
                        <motion.div variants={fadeIn} className="bg-rose-50 rounded-[2.5rem] p-8 md:p-12 text-gray-900 relative overflow-hidden border border-rose-100 shadow-sm">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row gap-8 mb-12">
                                    <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-200">
                                        <XCircle className="w-9 h-9" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black mb-4 uppercase tracking-tight text-gray-900">2. Non-Returnable Categories</h2>
                                        <p className="text-gray-600 text-lg font-medium leading-relaxed">
                                            Due to health and hygiene regulations, the following categories are strictly Non-Returnable:
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { title: "Temperature-Sensitive", desc: "Insulin, injections, vaccines, and Cold Chain specialized medicines." },
                                        { title: "Opened/Used Items", desc: "Partially consumed strips, opened syrups, or tampered vials." },
                                        { title: "Personal Care & Hygiene", desc: "Wellness products, baby care (diapers), and sexual wellness products." },
                                        { title: "Surgicals & Monitors", desc: "Glucometers, BP monitors, and thermometers (unless manufacturing defect)." }
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-3xl border border-rose-100 hover:border-rose-300 transition-colors shadow-sm">
                                            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> {item.title}
                                            </h4>
                                            <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* 3. The 48-Hour Window */}
                        <motion.div variants={fadeIn} className="bg-amber-50 rounded-[2.5rem] border border-amber-100 shadow-sm p-8 md:p-12 hover:shadow-xl transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                            <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-200">
                                    <Clock className="w-9 h-9" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-black text-gray-900 mb-6 uppercase tracking-tight">3. The 48-Hour Window</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm hover:border-amber-300 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 font-black mb-4 shadow-sm">1</div>
                                            <p className="font-black text-gray-900 uppercase tracking-widest text-xs mb-2">Timeline</p>
                                            <p className="text-gray-600 text-sm leading-relaxed font-bold">All return requests must be raised within 48 hours of delivery.</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm hover:border-amber-300 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 font-black mb-4 shadow-sm">2</div>
                                            <p className="font-black text-gray-900 uppercase tracking-widest text-xs mb-2">Evidence</p>
                                            <p className="text-gray-600 text-sm leading-relaxed font-bold">Upload a photo or &quot;unboxing video&quot; through the app to initiate the process.</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm hover:border-amber-300 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 font-black mb-4 shadow-sm">3</div>
                                            <p className="font-black text-gray-900 uppercase tracking-widest text-xs mb-2">Condition</p>
                                            <p className="text-gray-600 text-sm leading-relaxed font-bold">Items must be in original packaging with all labels and barcodes intact.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 4. Refund Process */}
                        <motion.div variants={fadeIn} className="bg-blue-50 rounded-[2.5rem] p-8 md:p-12 text-gray-900 shadow-sm border border-blue-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                            <div className="flex flex-col md:flex-row gap-8 items-center mb-10 relative z-10">
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
                                    <CreditCard className="w-9 h-9" />
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900">4. Refund Process</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                <div className="relative group p-6 bg-white rounded-3xl border border-blue-100 shadow-sm">
                                    <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3">01. Verification</p>
                                    <p className="text-gray-900 font-bold text-lg mb-2">Internal Check</p>
                                    <p className="text-gray-500 text-sm leading-relaxed font-medium">Takes 24–72 hours after the item reaches our facility for quality check.</p>
                                </div>
                                <div className="relative group p-6 bg-white rounded-3xl border border-blue-100 shadow-sm">
                                    <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3">02. Issuance</p>
                                    <p className="text-gray-900 font-bold text-lg mb-2">Original Method</p>
                                    <p className="text-gray-500 text-sm leading-relaxed font-medium">Refunds are processed back to the original payment method (UPI, Bank, or Card).</p>
                                </div>
                                <div className="relative group p-6 bg-white rounded-3xl border border-blue-100 shadow-sm">
                                    <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3">03. Reflection</p>
                                    <p className="text-gray-900 font-bold text-lg mb-2">Bank Timeframe</p>
                                    <p className="text-gray-500 text-sm leading-relaxed font-medium">Expect the amount to reflect in your account within 5–7 business days.</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-20 text-center"
                    >
                        <p className="text-gray-500 font-medium mb-6">Have questions about your specific return?</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-10 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-blue-600 hover:scale-105 transition-all shadow-xl text-sm uppercase tracking-widest"
                        >
                            Contact Support Center <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            </section>
            <SupportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </main>
    );
}

function SupportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [subject, setSubject] = React.useState('Return Inquiry');
    const [message, setMessage] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = getToken();
            const response = await fetch('http://localhost:5000/api/support', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    subject,
                    message,
                    type: 'Return Inquiry'
                })
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    setMessage('');
                }, 2000);
            }
        } catch (error) {
            console.error('Support submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 md:p-12">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Contact Support</h3>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
                                    <XCircle className="w-8 h-8" />
                                </button>
                            </div>

                            {success ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900 mb-2">Request Received!</h4>
                                    <p className="text-gray-500 font-medium">Our support team will review your inquiry shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Subject</label>
                                        <input
                                            type="text"
                                            value={subject}
                                            readOnly
                                            className="w-full bg-slate-50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 font-bold focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">How can we help?</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Please describe your return issue or question..."
                                            className="w-full bg-slate-50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all resize-none"
                                        />
                                    </div>
                                    <button
                                        disabled={isSubmitting}
                                        className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Sending Request...' : 'Send Inquiry'} <ArrowRight className="w-5 h-5" />
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
