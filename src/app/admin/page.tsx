"use client";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { getToken } from "@/lib/tokenStorage";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, 
    Heart, 
    Package, 
    Activity, 
    Lock, 
    Droplets, 
    Shield, 
    ChevronRight, 
    BarChart3, 
    CheckCircle2, 
    XCircle, 
    Building2, 
    Plus,
    Handshake,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    Search,
    Bell,
    Settings
} from "lucide-react";
import BloodBankAdmin from "@/components/BloodBankAdmin";
import AddHospitalForm from "@/components/AddHospitalForm";
import HospitalListAdmin from "@/components/HospitalListAdmin";
import PartnerInquiriesAdmin from "@/components/PartnerInquiriesAdmin";

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

type TabId = 'overview' | 'approvals' | 'bloodbank' | 'hospitals' | 'partners';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [stats, setStats] = useState<any>(null);
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showAddHospital, setShowAddHospital] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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
            await api.put(`/admin/users/${userId}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingUsers(prev => prev.filter(u => u._id !== userId));
            fetchStats();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-white/10 border-t-blue-500 rounded-full relative z-10"
                />
                <p className="mt-6 font-black text-white tracking-[0.3em] uppercase text-xs relative z-10">Initializing Command Center</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-white">
                <div className="absolute w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]" />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 text-center bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem] shadow-2xl">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight">Access Restricted</h1>
                    <p className="text-slate-400 mt-4 max-w-sm mx-auto leading-relaxed font-medium">{error}</p>
                    <button onClick={() => router.push('/')} className="mt-10 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 hover:-translate-y-0.5 transition-all shadow-xl shadow-blue-600/20 active:scale-95">Return to Surface</button>
                </motion.div>
            </div>
        )
    }

    const navigation = [
        { id: 'overview', label: 'Overview', icon: BarChart3, color: 'text-blue-500' },
        { id: 'approvals', label: 'User Approvals', icon: Lock, color: 'text-amber-500', badge: pendingUsers.length },
        { id: 'bloodbank', label: 'Blood Connect', icon: Droplets, color: 'text-rose-500' },
        { id: 'hospitals', label: 'Hospitals', icon: Building2, color: 'text-indigo-500' },
        { id: 'partners', label: 'Partnerships', icon: Handshake, color: 'text-emerald-500' },
    ];

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-blue-500/30 flex overflow-hidden">
            {/* Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarOpen ? '280px' : '80px' }}
                className="bg-[#1E293B] border-r border-white/5 flex flex-col relative z-50"
            >
                {/* Logo Section */}
                <div className="h-24 flex items-center px-6 gap-4 border-b border-white/5">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    {isSidebarOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-black text-xl tracking-tighter text-white">
                            COMMAND <span className="text-blue-500">CENTER</span>
                        </motion.div>
                    )}
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {navigation.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as TabId)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group ${
                                activeTab === item.id 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-white' : item.color}`} />
                            {isSidebarOpen && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-sm tracking-wide">
                                    {item.label}
                                </motion.span>
                            )}
                            {item.badge && item.badge > 0 && (
                                <span className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                                    activeTab === item.id ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                                }`}>
                                    {item.badge}
                                </span>
                            )}
                            {activeTab === item.id && (
                                <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Bottom Profile */}
                <div className="p-4 border-t border-white/5">
                    <button 
                        onClick={() => {
                            if(confirm("Logout from Command Center?")) {
                                router.push('/');
                            }
                        }}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all group"
                    >
                        <LogOut className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" />
                        {isSidebarOpen && <span className="font-bold text-sm">Terminate Session</span>}
                    </button>
                </div>

                {/* Collapse Toggle */}
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-4 top-32 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform"
                >
                    {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0F172A]">
                {/* Background Blobs */}
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

                {/* Top Header */}
                <header className="h-24 px-10 flex items-center justify-between border-b border-white/5 relative z-10 backdrop-blur-md bg-[#0F172A]/50">
                    <div className="flex items-center gap-6">
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                            {navigation.find(n => n.id === activeTab)?.label}
                        </h2>
                        <div className="h-6 w-[1px] bg-white/10" />
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-blue-500 font-bold">{navigation.find(n => n.id === activeTab)?.label}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-sm font-medium text-slate-200 placeholder:text-slate-500 w-48" />
                        </div>
                        <button className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all relative">
                            <Bell className="w-5 h-5 text-slate-400" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0F172A]" />
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/20 ring-2 ring-white/10">
                            A
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-10 relative z-10 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {activeTab === 'overview' && (
                                <div className="space-y-10">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <StatCard
                                            icon={<Users className="w-7 h-7 text-blue-500" />}
                                            label="Total Network Users"
                                            value={stats?.counts?.users || 0}
                                            trend="+12%"
                                            color="blue"
                                        />
                                        <StatCard
                                            icon={<Heart className="w-7 h-7 text-rose-500" />}
                                            label="Verified Blood Donors"
                                            value={stats?.counts?.donors || 0}
                                            trend="+5%"
                                            color="rose"
                                        />
                                        <StatCard
                                            icon={<Activity className="w-7 h-7 text-emerald-500" />}
                                            label="Platform Activity"
                                            value={stats?.counts?.activity || 0}
                                            trend="+28%"
                                            color="emerald"
                                        />
                                    </div>

                                    {/* Recent Activity Table (Placeholder/Integration) */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="bg-[#1E293B] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl shadow-black/20">
                                            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                                                <Activity className="w-6 h-6 text-blue-500" /> Recent Deployments
                                            </h3>
                                            <div className="space-y-4">
                                                {[1,2,3].map(i => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                                                                <Package className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-white text-sm italic">New Hospital Module</p>
                                                                <p className="text-xs text-slate-500">System v4.2.0 • 2 hours ago</p>
                                                            </div>
                                                        </div>
                                                        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-full border border-emerald-500/20">
                                                            Success
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-[#1E293B] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl shadow-black/20">
                                            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                                                <Bell className="w-6 h-6 text-amber-500" /> System Alerts
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex items-start gap-4">
                                                    <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                                                    <div>
                                                        <p className="text-sm font-bold text-amber-500">New High Priority Request</p>
                                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">NGO Partner "Red Cross" has submitted a new enterprise proposal. Administrative review is pending.</p>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-start gap-4">
                                                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500" />
                                                    <div>
                                                        <p className="text-sm font-bold text-blue-500">Database Optimization Complete</p>
                                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">All blood request indices have been updated for faster search performance.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'approvals' && (
                                <div className="space-y-8">
                                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                                    <Lock className="w-7 h-7 text-amber-500" /> User Verification
                                                </h3>
                                                <p className="text-slate-400 font-medium mt-1">Review and authorize new system participants</p>
                                            </div>
                                            <div className="px-4 py-2 bg-amber-500/10 text-amber-500 rounded-2xl text-xs font-black uppercase tracking-widest border border-amber-500/20">
                                                {pendingUsers.length} Requests Pending
                                            </div>
                                        </div>

                                        {pendingUsers.length === 0 ? (
                                            <div className="text-center py-24 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                                                <CheckCircle2 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                                                <h4 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Queue Empty</h4>
                                                <p className="text-slate-500 mt-2 font-medium">All pending applications have been processed.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <AnimatePresence>
                                                    {pendingUsers.map((user: any) => (
                                                        <motion.div 
                                                            key={user._id}
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            className="flex flex-col p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/5 transition-all duration-300 gap-6"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-600/20">
                                                                    {user.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-white text-lg">{user.name}</p>
                                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                                                                        <span className="text-slate-400 text-sm font-medium">{user.email}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white hover:bg-blue-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4" /> Authorize
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                                                                >
                                                                    <XCircle className="w-4 h-4" /> Reject
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'bloodbank' && (
                                <div className="space-y-8">
                                    <div className="bg-[#1E293B] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                                            <div>
                                                <h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                                                    <Droplets className="w-8 h-8 text-rose-500" /> Blood Connect Network
                                                </h3>
                                                <p className="text-slate-400 font-medium mt-1">Manage emergency requests and donor matches</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20 text-xs font-black">
                                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> Live Console
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-black/20 rounded-[2rem] border border-white/5 p-6">
                                            <BloodBankAdmin />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'hospitals' && (
                                <div className="space-y-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div>
                                            <h3 className="text-3xl font-black text-white tracking-tight uppercase">Hospital Directory</h3>
                                            <p className="text-slate-400 font-medium mt-1">Add and curate Pillora network healthcare facilities</p>
                                        </div>
                                        <button
                                            onClick={() => setShowAddHospital(!showAddHospital)}
                                            className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3 shadow-2xl ${
                                                showAddHospital 
                                                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' 
                                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:-translate-y-1 active:scale-95'
                                            }`}
                                        >
                                            {showAddHospital ? <XCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                            {showAddHospital ? 'Cancel Registration' : 'Register New Hospital'}
                                        </button>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {showAddHospital ? (
                                            <motion.div
                                                key="hospital-form"
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                className="bg-[#1E293B] rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden"
                                            >
                                                <AddHospitalForm onClose={() => {
                                                    setShowAddHospital(false);
                                                    setRefreshTrigger(prev => prev + 1);
                                                }} />
                                            </motion.div>
                                        ) : (
                                            <motion.div 
                                                key="hospital-list"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="bg-[#1E293B] p-8 rounded-[3rem] shadow-2xl border border-white/5"
                                            >
                                                <HospitalListAdmin key={refreshTrigger} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {activeTab === 'partners' && (
                                <div className="space-y-8">
                                    <div className="bg-[#1E293B] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
                                        <div className="flex items-center justify-between mb-10">
                                            <div>
                                                <h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                                                    <Handshake className="w-8 h-8 text-emerald-500" /> Partnership Inquiries
                                                </h3>
                                                <p className="text-slate-400 font-medium mt-1 italic">Review hospital and NGO collaboration proposals</p>
                                            </div>
                                        </div>
                                        <PartnerInquiriesAdmin />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

function StatCard({ icon, label, value, trend, color }: any) {
    const colors: any = {
        blue: 'from-blue-600/20 to-indigo-600/10 text-blue-500 border-blue-500/20 shadow-blue-500/10',
        rose: 'from-rose-600/20 to-pink-600/10 text-rose-500 border-rose-500/20 shadow-rose-500/10',
        emerald: 'from-emerald-600/20 to-teal-600/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10'
    };

    return (
        <motion.div
            variants={itemVariants}
            className={`group p-8 rounded-[3rem] bg-[#1E293B] border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:border-white/10 relative overflow-hidden`}
        >
            <div className={`absolute -right-8 -top-8 w-40 h-40 rounded-full bg-gradient-to-br ${colors[color]} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
            
            <div className="flex items-start justify-between mb-8 relative z-10">
                <div className={`p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                    {icon}
                </div>
                <div className="px-3 py-1 bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">
                    Realtime
                </div>
            </div>
            
            <div className="relative z-10">
                <h3 className="text-5xl font-black text-white mb-2 tracking-tighter">
                    {value}
                </h3>
                <p className="text-slate-500 font-black tracking-widest uppercase text-[10px] italic">{label}</p>
            </div>

            <div className="mt-6 flex items-center gap-2">
                <div className="flex items-center gap-1 text-emerald-500 text-xs font-black">
                    <Activity className="w-3 h-3" /> {trend}
                </div>
                <span className="text-slate-600 text-[10px] font-bold uppercase tracking-tighter">vs last month</span>
            </div>
        </motion.div>
    )
}
