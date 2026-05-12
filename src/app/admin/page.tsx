"use client";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { getToken } from "@/lib/tokenStorage";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Heart, Package, Activity, Lock, Droplets, Shield, ChevronRight, BarChart3, CheckCircle2, XCircle } from "lucide-react";
import BloodBankAdmin from "@/components/BloodBankAdmin";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showBloodBank, setShowBloodBank] = useState(false);

    const fetchPendingUsers = useCallback(async () => {
        const token = getToken();
        try {
            const res = await api.get("/admin/users?status=pending", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingUsers(res.data);
        } catch (err: any) {
            console.error("Failed to fetch pending users", err);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const token = getToken();
            if (!token) {
                router.push("/login");
                return;
            }

            const res = await api.get("/admin/stats", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 403 || err.response?.status === 401) {
                setError("Access Denied. Admin privileges required.");
            } else {
                setError("Failed to load dashboard data.");
            }
        }
    }, [router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([fetchStats(), fetchPendingUsers()]);
            } catch (error) {
                console.error("Error fetching admin data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [fetchStats, fetchPendingUsers]);

    const handleStatusUpdate = async (userId: string, status: 'approved' | 'rejected') => {
        const token = getToken();
        if (!confirm(`Are you sure you want to ${status} this user?`)) return;

        try {
            await api.put(`/api/admin/users/${userId}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Remove from list locally
            setPendingUsers(prev => prev.filter(u => u._id !== userId));
            // Refresh stats
            fetchStats();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full relative z-10"
                />
                <p className="mt-6 font-medium text-slate-400 tracking-widest uppercase text-sm relative z-10">Initializing Command Center...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]" />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 text-center bg-white/5 border border-red-500/20 p-12 rounded-[3rem] backdrop-blur-xl">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Access Restricted</h1>
                    <p className="text-slate-400 mt-4 max-w-sm mx-auto leading-relaxed">{error}</p>
                    <button onClick={() => router.push('/')} className="mt-10 px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">Return to Surface</button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative font-sans selection:bg-primary/30">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />
            
            <div className="relative z-10 p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
                                Command Center
                            </h1>
                        </div>
                        <p className="text-slate-400 font-medium ml-12">System Overview & Analytics Dashboard</p>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl shadow-xl">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </div>
                            <span className="text-sm font-bold tracking-wide text-emerald-400 uppercase">System Online</span>
                        </div>
                    </motion.div>
                </header>

                <motion.main 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            icon={<Users className="w-7 h-7 text-blue-400" />}
                            label="Total Users"
                            value={stats?.counts?.users || 0}
                            trend="+12%"
                            glowColor="group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]"
                            iconBg="bg-blue-500/20"
                            borderColor="border-blue-500/20 group-hover:border-blue-500/40"
                        />
                        <StatCard
                            icon={<Heart className="w-7 h-7 text-rose-400" />}
                            label="Registered Donors"
                            value={stats?.counts?.donors || 0}
                            trend="+5%"
                            glowColor="group-hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]"
                            iconBg="bg-rose-500/20"
                            borderColor="border-rose-500/20 group-hover:border-rose-500/40"
                        />
                        <StatCard
                            icon={<Activity className="w-7 h-7 text-emerald-400" />}
                            label="Platform Activity"
                            value={stats?.counts?.activity || 0}
                            trend="+28%"
                            glowColor="group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]"
                            iconBg="bg-emerald-500/20"
                            borderColor="border-emerald-500/20 group-hover:border-emerald-500/40"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Pending Approvals */}
                        <motion.section variants={itemVariants} className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-amber-500/10 transition-colors duration-700" />
                            
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold flex items-center gap-3 text-white">
                                        <Lock className="w-6 h-6 text-amber-400" /> Pending Approvals
                                    </h3>
                                    <p className="text-slate-400 mt-1 text-sm">Users waiting for administrative review</p>
                                </div>
                                <div className="px-4 py-1.5 bg-amber-500/10 text-amber-400 rounded-full text-sm font-bold border border-amber-500/20">
                                    {pendingUsers.length} Pending
                                </div>
                            </div>

                            {pendingUsers.length === 0 ? (
                                <div className="text-center py-16 bg-white/[0.02] rounded-3xl border border-white/5 border-dashed">
                                    <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                    <p className="text-slate-400 font-medium">All caught up! No pending applications.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {pendingUsers.map((user: any) => (
                                            <motion.div 
                                                key={user._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 gap-4"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/20 shrink-0">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-lg">{user.name}</p>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                            <span className="px-2 py-0.5 bg-white/10 text-slate-300 rounded text-xs uppercase tracking-wider font-semibold">{user.role}</span>
                                                            <span className="text-slate-500 text-sm">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
                                                    >
                                                        <XCircle className="w-4 h-4" /> Reject
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.section>

                        {/* Recent Activity Mini */}
                        <motion.section variants={itemVariants} className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-purple-500/10 transition-colors duration-700" />
                            
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                                <Activity className="w-5 h-5 text-purple-400" /> Recent Signups
                            </h3>
                            <div className="space-y-4">
                                {stats?.recentUsers?.map((user: any) => (
                                    <div key={user._id} className="flex items-center gap-4 p-4 bg-white/[0.02] hover:bg-white/[0.05] rounded-2xl transition-colors border border-transparent hover:border-white/5">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-white font-bold shadow-inner shrink-0">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-200 truncate">{user.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </div>

                    {/* Blood Connect Management Section */}
                    <motion.section variants={itemVariants} className="bg-gradient-to-br from-[#120808] to-[#0A0000] border border-rose-500/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-rose-500/5 blur-[100px] pointer-events-none -z-10 group-hover:bg-rose-500/10 transition-colors duration-700" />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                            <div>
                                <h3 className="text-2xl font-bold flex items-center gap-3 text-white">
                                    <Droplets className="w-7 h-7 text-rose-500" /> Blood Connect Console
                                </h3>
                                <p className="text-rose-200/50 mt-1 text-sm">Manage blood bank requests and donor tracking</p>
                            </div>
                            <button
                                onClick={() => setShowBloodBank(!showBloodBank)}
                                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-lg ${
                                    showBloodBank 
                                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' 
                                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-0.5'
                                }`}
                            >
                                <BarChart3 className="w-4 h-4" />
                                {showBloodBank ? 'Close Console' : 'Launch Console'}
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {showBloodBank ? (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 p-2 sm:p-4">
                                        <BloodBankAdmin />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center py-16 bg-black/20 rounded-3xl border border-rose-500/10 border-dashed"
                                >
                                    <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Droplets className="w-10 h-10 text-rose-500" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-300 mb-2">Console Offline</h4>
                                    <p className="text-slate-500 max-w-md mx-auto">Launch the Blood Connect Console to view detailed analytics, manage requests, and export data.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.section>
                </motion.main>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, trend, glowColor, iconBg, borderColor }: any) {
    return (
        <motion.div
            variants={itemVariants}
            className={`group p-8 rounded-[2rem] bg-[#0A0A0A] border ${borderColor} transition-all duration-500 hover:-translate-y-1 ${glowColor} relative overflow-hidden`}
        >
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/[0.04] transition-colors" />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className={`p-4 ${iconBg} rounded-2xl ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                    {trend}
                </div>
            </div>
            
            <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                    {value}
                </h3>
                <p className="text-slate-400 font-medium tracking-wide uppercase text-xs">{label}</p>
            </div>
        </motion.div>
    )
}
