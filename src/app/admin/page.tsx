"use client";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { getToken } from "@/lib/tokenStorage";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Heart, Package, Activity, Lock, Droplets, Shield, ChevronRight, BarChart3, CheckCircle2, XCircle, Building2, Plus } from "lucide-react";
import BloodBankAdmin from "@/components/BloodBankAdmin";
import AddHospitalForm from "@/components/AddHospitalForm";

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
    const [showAddHospital, setShowAddHospital] = useState(false);

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
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full relative z-10"
                />
                <p className="mt-6 font-bold text-primary tracking-widest uppercase text-sm relative z-10">Initializing Command Center...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]" />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 text-center bg-white border border-red-100 p-12 rounded-[3rem] shadow-2xl shadow-red-900/5">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Access Restricted</h1>
                    <p className="text-gray-500 mt-4 max-w-sm mx-auto leading-relaxed font-medium">{error}</p>
                    <button onClick={() => router.push('/')} className="mt-10 px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 hover:-translate-y-0.5 transition-all shadow-xl shadow-gray-900/20 active:scale-95">Return to Surface</button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 text-gray-800 overflow-hidden relative font-sans selection:bg-primary/30">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
            
            <div className="relative z-10 p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <Shield className="w-8 h-8 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
                                Command Center
                            </h1>
                        </div>
                        <p className="text-gray-500 font-medium ml-[4.5rem]">System Overview & Analytics Dashboard</p>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                        <div className="flex items-center gap-3 bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-sm">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </div>
                            <span className="text-sm font-bold tracking-wide text-emerald-600 uppercase">System Online</span>
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
                            icon={<Users className="w-7 h-7 text-primary" />}
                            label="Total Users"
                            value={stats?.counts?.users || 0}
                            trend="+12%"
                            iconBg="bg-blue-50"
                        />
                        <StatCard
                            icon={<Heart className="w-7 h-7 text-rose-500" />}
                            label="Registered Donors"
                            value={stats?.counts?.donors || 0}
                            trend="+5%"
                            iconBg="bg-rose-50"
                        />
                        <StatCard
                            icon={<Activity className="w-7 h-7 text-emerald-500" />}
                            label="Platform Activity"
                            value={stats?.counts?.activity || 0}
                            trend="+28%"
                            iconBg="bg-emerald-50"
                        />
                    </div>

                    {/* Pending Approvals */}
                    <motion.section variants={itemVariants} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl shadow-blue-900/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-[80px] -z-10 group-hover:bg-amber-100 transition-colors duration-700" />
                        
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black flex items-center gap-3 text-gray-900">
                                    <Lock className="w-6 h-6 text-amber-500" /> Pending Approvals
                                </h3>
                                <p className="text-gray-500 mt-1 text-sm font-medium">Users waiting for administrative review</p>
                            </div>
                            <div className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-sm font-bold border border-amber-200">
                                {pendingUsers.length} Pending
                            </div>
                        </div>

                        {pendingUsers.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200 border-dashed">
                                <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 font-bold">All caught up! No pending applications.</p>
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
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 hover:bg-blue-50/50 rounded-2xl border border-gray-100 hover:border-blue-100 transition-all duration-300 gap-4"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20 shrink-0">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-lg">{user.name}</p>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs uppercase tracking-wider font-bold">{user.role}</span>
                                                        <span className="text-gray-500 text-sm font-medium">{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-white text-emerald-600 hover:text-emerald-700 border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl text-sm font-bold transition-all shadow-sm"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-white text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 hover:bg-rose-50 rounded-xl text-sm font-bold transition-all shadow-sm"
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Blood Connect Management Section */}
                        <motion.section variants={itemVariants} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl shadow-blue-900/5 relative overflow-hidden group">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-rose-50 blur-[100px] pointer-events-none -z-10 group-hover:bg-rose-100/50 transition-colors duration-700" />
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h3 className="text-2xl font-black flex items-center gap-3 text-gray-900">
                                        <Droplets className="w-7 h-7 text-rose-500" /> Blood Connect
                                    </h3>
                                    <p className="text-gray-500 font-medium mt-1 text-sm">Manage blood bank requests</p>
                                </div>
                                <button
                                    onClick={() => setShowBloodBank(!showBloodBank)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-lg shrink-0 ${
                                        showBloodBank 
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 shadow-none' 
                                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/30 hover:shadow-rose-500/40 hover:-translate-y-0.5'
                                    }`}
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    {showBloodBank ? 'Close' : 'Launch'}
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
                                        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-2 sm:p-4">
                                            <BloodBankAdmin />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="placeholder"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center py-12 bg-gray-50/50 rounded-3xl border border-gray-200 border-dashed"
                                    >
                                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Droplets className="w-8 h-8 text-rose-500" />
                                        </div>
                                        <h4 className="text-lg font-black text-gray-800 mb-2">Console Offline</h4>
                                        <p className="text-gray-500 font-medium text-sm">Launch to view detailed analytics.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.section>

                        {/* Hospital Directory Management Section */}
                        <motion.section variants={itemVariants} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl shadow-blue-900/5 relative overflow-hidden group">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-50 blur-[100px] pointer-events-none -z-10 group-hover:bg-blue-100/50 transition-colors duration-700" />
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h3 className="text-2xl font-black flex items-center gap-3 text-gray-900">
                                        <Building2 className="w-7 h-7 text-primary" /> Hospital Directory
                                    </h3>
                                    <p className="text-gray-500 font-medium mt-1 text-sm">Add and manage network hospitals</p>
                                </div>
                                <button
                                    onClick={() => setShowAddHospital(!showAddHospital)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-lg shrink-0 ${
                                        showAddHospital 
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 shadow-none' 
                                        : 'bg-primary hover:bg-primary/90 text-white shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5'
                                    }`}
                                >
                                    <Plus className="w-4 h-4" />
                                    {showAddHospital ? 'Close Form' : 'Add Hospital'}
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {showAddHospital ? (
                                    <motion.div
                                        key="hospital-form"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-2">
                                            <AddHospitalForm onClose={() => setShowAddHospital(false)} />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="placeholder"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center py-12 bg-gray-50/50 rounded-3xl border border-gray-200 border-dashed"
                                    >
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Building2 className="w-8 h-8 text-primary" />
                                        </div>
                                        <h4 className="text-lg font-black text-gray-800 mb-2">Expand Directory</h4>
                                        <p className="text-gray-500 font-medium text-sm">Click Add Hospital to register a new facility.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.section>
                    </div>
                </motion.main>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, trend, iconBg }: any) {
    return (
        <motion.div
            variants={itemVariants}
            className={`group p-8 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-blue-900/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 relative overflow-hidden`}
        >
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className={`p-4 ${iconBg} rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                    {trend}
                </div>
            </div>
            
            <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight group-hover:text-primary transition-colors">
                    {value}
                </h3>
                <p className="text-gray-500 font-bold tracking-wide uppercase text-xs">{label}</p>
            </div>
        </motion.div>
    )
}
