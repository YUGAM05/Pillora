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
    Settings,
    ArrowUpRight
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
            staggerChildren: 0.08
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } }
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
            <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute w-[600px] h-[600px] bg-blue-100 rounded-full blur-[140px] animate-pulse" />
                <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full relative z-10 shadow-xl"
                />
                <p className="mt-8 font-black text-blue-900 tracking-[0.4em] uppercase text-[10px] relative z-10 italic">Initializing Command Center</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute w-[600px] h-[600px] bg-red-100 rounded-full blur-[140px]" />
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 text-center bg-white border border-red-100 p-16 rounded-[4rem] shadow-2xl shadow-red-900/10">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Lock className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Access Restricted</h1>
                    <p className="text-slate-500 mt-4 max-w-sm mx-auto leading-relaxed font-medium italic">{error}</p>
                    <button onClick={() => router.push('/')} className="mt-12 px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-red-600 hover:-translate-y-1 transition-all shadow-xl shadow-slate-900/20 active:scale-95 uppercase tracking-widest text-xs">Return to Surface</button>
                </motion.div>
            </div>
        )
    }

    const navigation = [
        { id: 'overview', label: 'Overview', icon: BarChart3, color: 'text-blue-600' },
        { id: 'approvals', label: 'User Approvals', icon: Lock, color: 'text-amber-500', badge: pendingUsers.length },
        { id: 'bloodbank', label: 'Blood Connect', icon: Droplets, color: 'text-rose-500' },
        { id: 'hospitals', label: 'Hospitals', icon: IndigoIcon, color: 'text-indigo-600' },
        { id: 'partners', label: 'Partnerships', icon: Handshake, color: 'text-emerald-600' },
    ];

    function IndigoIcon(props: any) {
        return <Building2 {...props} />;
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600/20 flex overflow-hidden">
            {/* Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarOpen ? '300px' : '90px' }}
                className="bg-white border-r border-slate-200 flex flex-col relative z-50 shadow-2xl shadow-blue-900/5"
            >
                {/* Logo Section */}
                <div className="h-24 flex items-center px-7 gap-4 border-b border-slate-50">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-blue-600/30">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    {isSidebarOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-black text-2xl tracking-tighter text-slate-900">
                            PILLORA <span className="text-blue-600 font-black">PRO</span>
                        </motion.div>
                    )}
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-10 px-5 space-y-2 overflow-y-auto custom-scrollbar">
                    {navigation.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as TabId)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-500 relative group ${
                                activeTab === item.id 
                                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' 
                                : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                        >
                            <item.icon className={`w-6 h-6 shrink-0 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : item.color}`} />
                            {isSidebarOpen && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-black text-sm tracking-tight">
                                    {item.label}
                                </motion.span>
                            )}
                            {item.badge && item.badge > 0 && (
                                <span className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shadow-md ${
                                    activeTab === item.id ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                                }`}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Bottom Profile */}
                <div className="p-6 border-t border-slate-50">
                    <button 
                        onClick={() => {
                            if(confirm("Logout from Command Center?")) {
                                router.push('/');
                            }
                        }}
                        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all group font-black text-sm uppercase tracking-widest"
                    >
                        <LogOut className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" />
                        {isSidebarOpen && <span>Sign Out</span>}
                    </button>
                </div>

                {/* Collapse Toggle */}
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 shadow-xl hover:scale-110 transition-all hover:text-blue-600"
                >
                    {isSidebarOpen ? <ChevronRight className="w-5 h-5 rotate-180" /> : <ChevronRight className="w-5 h-5" />}
                </button>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-white">
                {/* Background Blobs */}
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-50/50 blur-[140px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px] pointer-events-none" />

                {/* Top Header */}
                <header className="h-24 px-12 flex items-center justify-between border-b border-slate-100 relative z-10 bg-white/70 backdrop-blur-xl">
                    <div className="flex items-center gap-8">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                                {navigation.find(n => n.id === activeTab)?.label}
                            </h2>
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
                                <LayoutDashboard className="w-3 h-3" />
                                <span>Root Console</span>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-blue-600">{navigation.find(n => n.id === activeTab)?.label}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Quick system search..." className="bg-transparent border-none outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400 w-64" />
                        </div>
                        <button className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-all relative">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
                        </button>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-black text-sm shadow-2xl ring-4 ring-blue-50">
                            SA
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-12 relative z-10 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.99, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.99, y: -10 }}
                            transition={{ duration: 0.4 }}
                        >
                            {activeTab === 'overview' && (
                                <div className="space-y-12">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <StatCard
                                            icon={<Users className="w-8 h-8" />}
                                            label="Network Residents"
                                            value={stats?.counts?.users || 0}
                                            trend="+12%"
                                            color="blue"
                                        />
                                        <StatCard
                                            icon={<Heart className="w-8 h-8" />}
                                            label="Live Donors"
                                            value={stats?.counts?.donors || 0}
                                            trend="+5%"
                                            color="rose"
                                        />
                                        <StatCard
                                            icon={<Activity className="w-8 h-8" />}
                                            label="Core Activity"
                                            value={stats?.counts?.activity || 0}
                                            trend="+28%"
                                            color="emerald"
                                        />
                                    </div>

                                    {/* System Insights */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2 bg-white border border-slate-100 p-10 rounded-[3rem] shadow-2xl shadow-blue-900/5 hover:border-blue-100 transition-colors">
                                            <div className="flex items-center justify-between mb-10">
                                                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                                    <Activity className="w-7 h-7 text-blue-600" /> Platform Pulse
                                                </h3>
                                                <button className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                                                    Full Audit <ArrowUpRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="space-y-5">
                                                {[
                                                    { title: "Hospital Module v4.2.0", time: "2 hours ago", status: "Active", type: "Deployment" },
                                                    { title: "Database Indexing", time: "5 hours ago", status: "Success", type: "System" },
                                                    { title: "Aadhaar API Integration", time: "Yesterday", status: "Active", type: "Security" }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 hover:bg-blue-50/50 rounded-3xl border border-slate-100 transition-all group">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                                                <Package className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-slate-900 text-lg leading-tight">{item.title}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.type}</span>
                                                                    <span className="text-slate-300">•</span>
                                                                    <span className="text-xs text-slate-400 font-bold italic">{item.time}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="px-5 py-2 bg-white text-emerald-600 text-[10px] font-black uppercase rounded-2xl border border-emerald-100 shadow-sm">
                                                            {item.status}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -z-0" />
                                            <h3 className="text-2xl font-black mb-8 flex items-center gap-3 relative z-10">
                                                <Bell className="w-7 h-7 text-amber-500" /> Notifications
                                            </h3>
                                            <div className="space-y-6 relative z-10">
                                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                                                    <p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" /> High Priority
                                                    </p>
                                                    <p className="text-sm font-bold text-white leading-relaxed">NGO Partner &quot;Red Cross&quot; has submitted a new enterprise proposal. Review pending.</p>
                                                    <p className="text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-tighter">Received 12m ago</p>
                                                </div>
                                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                                                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">System Update</p>
                                                    <p className="text-sm font-bold text-slate-300 leading-relaxed">Optimization complete for Indian Region blood matching indices.</p>
                                                    <p className="text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-tighter">Received 4h ago</p>
                                                </div>
                                            </div>
                                            <button className="w-full mt-8 py-4 bg-white text-slate-900 font-black rounded-2xl text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl">
                                                Clear All Alerts
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'approvals' && (
                                <div className="space-y-10">
                                    <div className="bg-white border border-slate-100 p-12 rounded-[4rem] shadow-2xl shadow-blue-900/5">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                                            <div>
                                                <h3 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tighter uppercase">
                                                    <Lock className="w-9 h-9 text-blue-600" /> Pending Authorizations
                                                </h3>
                                                <p className="text-slate-500 font-medium mt-1 italic">Verify new medical practitioners and administrative staff</p>
                                            </div>
                                            <div className="px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-blue-100 shadow-sm">
                                                {pendingUsers.length} Applications Waiting
                                            </div>
                                        </div>

                                        {pendingUsers.length === 0 ? (
                                            <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                                                <CheckCircle2 className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                                                <h4 className="text-2xl font-black text-slate-400 uppercase tracking-[0.2em]">All Systems Clear</h4>
                                                <p className="text-slate-500 mt-3 font-medium italic">There are no pending user approvals at this moment.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                                <AnimatePresence>
                                                    {pendingUsers.map((user: any) => (
                                                        <motion.div 
                                                            key={user._id}
                                                            initial={{ opacity: 0, y: 15 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.98 }}
                                                            className="group flex flex-col p-8 bg-white hover:bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 transition-all duration-500 shadow-lg shadow-blue-900/5"
                                                        >
                                                            <div className="flex items-center gap-6 mb-8">
                                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:scale-110 transition-transform duration-500">
                                                                    {user.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-slate-900 text-xl tracking-tight leading-none">{user.name}</p>
                                                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                                                                        <span className="text-slate-400 text-sm font-bold">{user.email}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-3">
                                                                <button
                                                                    onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                                    className="flex-1 py-4 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                                    className="flex-1 py-4 bg-white text-rose-500 hover:bg-rose-500 hover:text-white border-2 border-rose-100 hover:border-rose-500 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                                                                >
                                                                    Reject
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
                                <div className="space-y-10">
                                    <div className="bg-white border border-slate-100 p-12 rounded-[4rem] shadow-2xl shadow-blue-900/5">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                                            <div>
                                                <h3 className="text-3xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tighter">
                                                    <Droplets className="w-10 h-10 text-rose-600" /> Blood Connect Network
                                                </h3>
                                                <p className="text-slate-500 font-medium mt-1 italic">Real-time matching console for life-critical operations</p>
                                            </div>
                                            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 text-xs font-black shadow-sm uppercase tracking-widest italic">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-emerald-500/50" /> System Live
                                            </div>
                                        </div>
                                        <div className="bg-slate-50/50 rounded-[3rem] border border-slate-100 p-8 shadow-inner">
                                            <BloodBankAdmin />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'hospitals' && (
                                <div className="space-y-12">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                                        <div>
                                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Medical Facilities</h3>
                                            <p className="text-slate-500 font-medium mt-2 italic">Curate and expand India&apos;s most reliable hospital network</p>
                                        </div>
                                        <button
                                            onClick={() => setShowAddHospital(!showAddHospital)}
                                            className={`px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-3 shadow-2xl ${
                                                showAddHospital 
                                                ? 'bg-slate-900 text-white hover:bg-slate-800' 
                                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 hover:-translate-y-2 active:scale-95'
                                            }`}
                                        >
                                            {showAddHospital ? <XCircle className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                            {showAddHospital ? 'Close Form' : 'Register Hospital'}
                                        </button>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {showAddHospital ? (
                                            <motion.div
                                                key="hospital-form"
                                                initial={{ opacity: 0, scale: 0.99, y: 20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.99, y: -20 }}
                                                className="bg-white rounded-[4rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden"
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
                                                className="bg-white p-12 rounded-[4rem] shadow-2xl shadow-blue-900/5 border border-slate-50"
                                            >
                                                <HospitalListAdmin key={refreshTrigger} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {activeTab === 'partners' && (
                                <div className="space-y-10">
                                    <div className="bg-white border border-slate-100 p-12 rounded-[4rem] shadow-2xl shadow-blue-900/5">
                                        <div className="flex items-center justify-between mb-12">
                                            <div>
                                                <h3 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tighter uppercase leading-none">
                                                    <Handshake className="w-10 h-10 text-blue-600" /> Collaboration Hub
                                                </h3>
                                                <p className="text-slate-500 font-medium mt-2 italic">Strategic proposals from Hospitals & NGOs</p>
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
        blue: {
            bg: 'bg-blue-50',
            icon: 'text-blue-600',
            light: 'bg-blue-100/50',
            shadow: 'shadow-blue-900/5'
        },
        rose: {
            bg: 'bg-rose-50',
            icon: 'text-rose-600',
            light: 'bg-rose-100/50',
            shadow: 'shadow-rose-900/5'
        },
        emerald: {
            bg: 'bg-emerald-50',
            icon: 'text-emerald-600',
            light: 'bg-emerald-100/50',
            shadow: 'shadow-emerald-900/5'
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            className={`group p-10 rounded-[3.5rem] bg-white border border-slate-50 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl ${colors[color].shadow} hover:border-blue-100 relative overflow-hidden`}
        >
            <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full ${colors[color].bg} blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-700`} />
            
            <div className="flex items-start justify-between mb-10 relative z-10">
                <div className={`p-5 ${colors[color].bg} rounded-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-transparent group-hover:border-white`}>
                    <div className={colors[color].icon}>{icon}</div>
                </div>
                <div className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-slate-100">
                    Live
                </div>
            </div>
            
            <div className="relative z-10">
                <h3 className="text-6xl font-black text-slate-900 mb-2 tracking-tighter">
                    {value}
                </h3>
                <p className="text-slate-400 font-black tracking-[0.2em] uppercase text-[10px] italic">{label}</p>
            </div>

            <div className="mt-8 flex items-center gap-3">
                <div className={`flex items-center gap-1.5 px-3 py-1 ${colors[color].light} ${colors[color].icon} text-xs font-black rounded-xl`}>
                    <Activity className="w-3.5 h-3.5" /> {trend}
                </div>
                <span className="text-slate-300 text-[10px] font-black uppercase tracking-tighter">vs prev phase</span>
            </div>
        </motion.div>
    )
}
