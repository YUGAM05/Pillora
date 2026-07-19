"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import Image from "next/image";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/auth/forgot-password", {
                email: email.trim(),
                portal: "patient"
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-primary/5 rounded-3xl relative w-16 h-16">
                            <Image src="/pillora-logo-v2.svg" alt="Pillora" fill className="object-contain" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Forgot Password</h2>
                    <p className="text-gray-500 mt-2 text-sm font-medium">
                        {!success 
                            ? "Enter your email to receive a password reset link" 
                            : "Check your email for the reset instructions"}
                    </p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center border border-red-100"
                    >
                        {error}
                    </motion.div>
                )}

                {success ? (
                    <div className="space-y-6 text-center">
                        <div className="flex justify-center mb-2">
                            <CheckCircle className="w-16 h-16 text-green-500" />
                        </div>
                        <p className="text-sm font-bold text-slate-700 bg-slate-50 border border-slate-100 p-5 rounded-2xl leading-relaxed">
                            If an account exists with this email address, we&apos;ve sent a password reset link.
                        </p>
                        <Link
                            href="/login"
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-gray-900/20 hover:bg-gray-800 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-gray-900 transition-all"
                                    placeholder="name@pillora.in"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-gray-900/20 hover:bg-gray-800 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                        </button>

                        <div className="text-center mt-6">
                            <Link href="/login" className="text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1">
                                <ArrowLeft className="w-3 h-3" /> Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
