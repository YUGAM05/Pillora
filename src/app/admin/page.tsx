"use client";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { getToken } from "@/lib/tokenStorage";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Heart, Package, Activity, Lock, Droplets } from "lucide-react";
import BloodBankAdmin from "@/components/BloodBankAdmin";

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
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-teal-500">Loading Dashboard...</div>
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
                <Lock className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-3xl font-bold text-red-500">Access Restricted</h1>
                <p className="text-slate-400 mt-2">{error}</p>
                <button onClick={() => router.push('/')} className="mt-8 px-6 py-2 bg-slate-800 rounded-full hover:bg-slate-700">Go Home</button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <header className="mb-12 flex justify-between items-center max-w-7xl mx-auto">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-500">
                        Admin Command Center
                    </h1>
                    <p className="text-slate-400 mt-2">System Overview & Analytics</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-white/10 px-4 py-2 rounded-full">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-mono text-green-400">System Online</span>
                </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        icon={<Users className="w-8 h-8 text-blue-400" />}
                        label="Total Users"
                        value={stats?.counts?.users || 0}
                        color="bg-blue-500/10 border-blue-500/20"
                    />
                    <StatCard
                        icon={<Heart className="w-8 h-8 text-rose-400" />}
                        label="Registered Donors"
                        value={stats?.counts?.donors || 0}
                        color="bg-rose-500/10 border-rose-500/20"
                    />
                    <StatCard
                        icon={<Activity className="w-8 h-8 text-emerald-400" />}
                        label="Platform Activity"
                        value={stats?.counts?.activity || 0}
                        color="bg-emerald-500/10 border-emerald-500/20"
                    />
                </div>

                {/* Pending Approvals Section */}
                <section className="bg-slate-900/50 backdrop-blur border border-white/5 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-amber-400">
                        <Lock className="w-5 h-5" /> Pending Approvals
                    </h3>

                    {pendingUsers.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <p>No pending applications.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingUsers.map((user: any) => (
                                <div key={user._id} className="flex items-center justify-between p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-500 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-200">{user.name}</p>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-amber-400 capitalize">{user.role}</span>
                                                <span className="text-slate-600">•</span>
                                                <span className="text-slate-500">{user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleStatusUpdate(user._id, 'approved')}
                                            className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                            className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Blood Connect Management Section */}
                <section className="bg-slate-900/50 backdrop-blur border border-white/5 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-red-400">
                            <Droplets className="w-5 h-5" /> Blood Connect Management
                        </h3>
                        <button
                            onClick={() => setShowBloodBank(!showBloodBank)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
                        >
                            {showBloodBank ? 'Hide Details' : 'View Details'}
                        </button>
                    </div>

                    {showBloodBank ? (
                        <BloodBankAdmin />
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            <Droplets className="w-16 h-16 mx-auto mb-4 text-red-500/30" />
                            <p>Click &quot;View Details&quot; to access blood connect data and export options</p>
                        </div>
                    )}
                </section>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section className="bg-slate-900/50 backdrop-blur border border-white/5 rounded-3xl p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-purple-400" /> Recent Signups
                        </h3>
                        {/* Existing Recent Signups Code */}
                        <div className="space-y-4">
                            {stats?.recentUsers?.map((user: any) => (
                                <div key={user._id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-300 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-200">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase ${user.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700/50 text-slate-400'}`}>
                                        {user.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Placeholder for Revenue/Other Stats */}
                    <section className="bg-slate-900/50 backdrop-blur border border-white/5 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                        <div className="text-center relative z-10">
                            <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <Package className="w-8 h-8 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-500">Inventory Analytics</h3>
                            <p className="text-slate-600 mt-2">Coming Soon</p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border ${color} backdrop-blur-sm`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
                {/* <span className="text-xs text-green-400 font-mono">+12%</span> */}
            </div>
            <h3 className="text-4xl font-bold text-white mb-1">{value}</h3>
            <p className="text-slate-400 text-sm font-medium">{label}</p>
        </motion.div>
    )
}
