"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { getToken, getUser } from "@/lib/tokenStorage";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, Activity, Calendar, Clock, Plus, Settings, 
    LogOut, User, Stethoscope, ChevronRight, CheckCircle2, 
    XCircle, AlertCircle, Info, RefreshCcw, LayoutDashboard
} from "lucide-react";

export default function HospitalDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState<any>(null);
    const [showAddDoctor, setShowAddDoctor] = useState(false);
    const [showSlotGen, setShowSlotGen] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const token = getToken();
            if (!token) {
                router.push("/login");
                return;
            }

            const [statsRes, doctorsRes, appointmentsRes] = await Promise.all([
                api.get("/hospital/dashboard/stats"),
                api.get("/hospital/dashboard/doctors"),
                api.get("/hospital/dashboard/appointments")
            ]);

            setStats(statsRes.data);
            setDoctors(doctorsRes.data);
            setAppointments(appointmentsRes.data);
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 403) {
                setError("Access Denied. Hospital account required.");
            } else {
                setError("Failed to load dashboard data.");
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        const u = getUser();
        if (u && u.role !== 'hospital') {
            router.push("/");
            return;
        }
        setUser(u);
        fetchData();
    }, [fetchData, router]);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await api.put(`/hospital/dashboard/appointments/${id}/status`, { status });
            fetchData();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full" />
                <p className="mt-4 font-bold text-primary animate-pulse">Loading Hospital Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Access Error</h1>
                    <p className="text-gray-500 font-medium">{error}</p>
                    <button onClick={() => router.push('/')} className="mt-6 px-8 py-3 bg-gray-900 text-white font-bold rounded-xl">Back to Safety</button>
                </div>
            </div>
        );
    }

    const isSelfManaged = stats?.management_type === 'SELF';

    return (
        <div className="min-h-screen bg-[#f8fafc] text-gray-900">
            {/* Sidebar / Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-primary rounded-xl">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">Hospital Dashboard</h1>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{user?.name}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            isSelfManaged ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-blue-50 text-blue-600 border-blue-200'
                        }`}>
                            {stats?.management_type} Managed
                        </div>
                        <button onClick={() => {
                            localStorage.clear();
                            router.push("/login");
                        }} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
                {/* Mode Warning */}
                {!isSelfManaged && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-600 text-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                                <Info className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-black text-lg">Pillora-Managed Mode Active</h3>
                                <p className="text-blue-100 text-sm font-medium">Only Pillora Super-Admins can modify your slots and doctor profiles.</p>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-white text-blue-600 font-black rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 text-sm whitespace-nowrap">
                            <RefreshCcw className="w-4 h-4" /> Request Switch
                        </button>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Total Doctors" value={stats?.stats?.doctors} icon={<Stethoscope className="text-blue-500" />} />
                    <StatCard label="Total Bookings" value={stats?.stats?.appointments} icon={<Calendar className="text-emerald-500" />} />
                    <StatCard label="Pending Review" value={stats?.stats?.pending} icon={<Clock className="text-amber-500" />} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Doctors List */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black flex items-center gap-2">
                                <Users className="w-6 h-6 text-primary" /> Our Doctors
                            </h2>
                            {isSelfManaged && (
                                <button onClick={() => setShowAddDoctor(true)} className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                                    <Plus className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        
                        <div className="space-y-4">
                            {doctors.map((doc: any) => (
                                <div key={doc._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-primary/30 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center font-black text-primary text-xl group-hover:bg-primary group-hover:text-white transition-colors">
                                            {doc.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900">{doc.name}</p>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{doc.specialty}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <span className="text-xs font-black text-emerald-600">₹{doc.fee} / Visit</span>
                                        {isSelfManaged && (
                                            <button onClick={() => setShowSlotGen(doc)} className="text-[10px] font-black uppercase text-primary hover:underline">
                                                Manage Slots
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Appointments List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-black flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-primary" /> Recent Appointments
                        </h2>
                        
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Doctor</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Time</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {appointments.map((app: any) => (
                                            <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-900">{app.patient?.name}</p>
                                                    <p className="text-xs text-gray-500">{app.patient?.phone}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-700">{app.doctor?.name}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-900">{new Date(app.slotTime).toLocaleDateString()}</p>
                                                    <p className="text-xs text-gray-500">{new Date(app.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {app.status === 'pending' ? (
                                                            <>
                                                                <button onClick={() => handleStatusUpdate(app._id, 'confirmed')} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"><CheckCircle2 className="w-4 h-4" /></button>
                                                                <button onClick={() => handleStatusUpdate(app._id, 'cancelled')} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"><XCircle className="w-4 h-4" /></button>
                                                            </>
                                                        ) : (
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                                app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                                                            }`}>{app.status}</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modals for Add Doctor and Slot Gen would go here */}
            {showSlotGen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black">Generate Slots</h3>
                            <button onClick={() => setShowSlotGen(false)}><XCircle className="w-6 h-6 text-gray-400" /></button>
                        </div>
                        <SlotGenTool doctor={showSlotGen} onClose={() => { setShowSlotGen(false); fetchData(); }} />
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-lg shadow-blue-900/5 flex items-center gap-5">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl">
                {icon}
            </div>
            <div>
                <h4 className="text-3xl font-black text-gray-900">{value || 0}</h4>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</p>
            </div>
        </div>
    );
}

function SlotGenTool({ doctor, onClose }: any) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: "",
        startTime: "09:00",
        endTime: "17:00",
        duration: "15"
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/hospital/dashboard/slots/generate", {
                doctorId: doctor._id,
                ...formData
            });
            alert("Slots generated successfully!");
            onClose();
        } catch (err) {
            alert("Failed to generate slots");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Date</label>
                <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Start Time</label>
                    <input required type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End Time</label>
                    <input required type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Slot Duration (min)</label>
                <select value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold">
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">1 Hour</option>
                </select>
            </div>
            <button disabled={loading} className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all disabled:opacity-50">
                {loading ? "Generating..." : `Generate Slots for Dr. ${doctor.name.split(' ')[1] || doctor.name}`}
            </button>
        </form>
    );
}
