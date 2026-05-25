"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Phone, LogOut, LayoutDashboard, ShoppingBag, Heart, Calendar, Clock, MapPin, Stethoscope, Loader2, FileText } from "lucide-react";
import { getUser, clearAuth } from "@/lib/tokenStorage";
import api from "@/lib/api";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [fetchingPrescriptionId, setFetchingPrescriptionId] = useState<string | null>(null);

    const handleViewPrescription = async (appointmentId: string) => {
        setFetchingPrescriptionId(appointmentId);
        try {
            // Note: Use hospital route, since the backend getAppointmentPrescription checks patient matching
            const res = await api.get(`/hospital/dashboard/appointments/${appointmentId}/prescription`);
            if (res.data.url) {
                window.open(res.data.url, "_blank");
            } else {
                alert("No prescription found.");
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to fetch prescription");
        } finally {
            setFetchingPrescriptionId(null);
        }
    };

    useEffect(() => {
        const storedUser = getUser();
        if (!storedUser) {
            router.push("/login");
        } else {
            setUser(storedUser);
        }
    }, [router]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get("/hospital/dashboard/appointments/my-bookings");
                setBookings(res.data);
            } catch (err) {
                console.error("Failed to fetch bookings", err);
            } finally {
                setBookingsLoading(false);
            }
        };
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const handleLogout = () => {
        clearAuth();
        router.push("/login");
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <LayoutDashboard className="w-10 h-10 text-primary" />
                        Welcome, {user.name}
                    </h1>
                    <p className="text-gray-500">Manage your orders and blood connect profile from here.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Stats / Quick Info */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Account Status</p>
                            <p className="text-xl font-bold text-gray-900">Verified</p>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
                            <Phone className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Mobile Number</p>
                            <p className="text-xl font-bold text-gray-900">{user.phoneNumber || "N/A"}</p>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                            <Heart className="w-8 h-8 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Blood Connect</p>
                            <p className="text-xl font-bold text-gray-900">Active</p>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <Stethoscope className="w-6 h-6 text-primary" />
                            My Doctor Bookings
                        </h2>
                        
                        <div className="space-y-4 flex-1 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
                            {bookingsLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                    <p className="text-slate-400 font-bold text-sm italic">No bookings found.</p>
                                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">Book an appointment at any hospital</p>
                                </div>
                            ) : (
                                bookings.map((booking) => {
                                    const bookingDate = new Date(booking.slotTime);
                                    const isPending = booking.status === "pending";
                                    const isApproved = booking.status === "approved" || booking.status === "confirmed";
                                    const isCancelled = booking.status === "cancelled";

                                    return (
                                        <div key={booking._id} className="p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="font-extrabold text-slate-800 text-sm sm:text-base">Dr. {booking.doctor?.name || "Expert Doctor"}</p>
                                                    <p className="text-xs font-bold text-primary mt-0.5">{booking.doctor?.specialty || booking.doctor?.specialization || "General Medicine"}</p>
                                                </div>
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full shrink-0 ${
                                                    isApproved 
                                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                                                        : isCancelled 
                                                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                                                            : "bg-amber-100 text-amber-800 border border-amber-200"
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="h-px bg-slate-100 my-1" />

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-500 font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                                                    <span>{bookingDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                                                    <span>{bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                                </div>
                                                <div className="flex items-start gap-2 sm:col-span-2">
                                                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                                    <span className="leading-snug">{booking.hospital?.name} • <span className="text-[11px] font-medium text-slate-400">{booking.hospital?.address}, {booking.hospital?.city}</span></span>
                                                </div>
                                            </div>

                                            {booking.prescriptionUploadedAt && (
                                                <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end">
                                                    <button 
                                                        onClick={() => handleViewPrescription(booking._id)}
                                                        disabled={fetchingPrescriptionId === booking._id}
                                                        className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50"
                                                    >
                                                        {fetchingPrescriptionId === booking._id ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : (
                                                            <FileText className="w-3 h-3" />
                                                        )}
                                                        {fetchingPrescriptionId === booking._id ? "Opening..." : "View Prescription"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <User className="w-6 h-6 text-primary" />
                            Profile Details
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                                <p className="font-medium text-gray-800">{user.name || "—"}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                                <p className="font-medium text-gray-800">{user.email || "—"}</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="mt-4 flex items-center gap-2 text-red-600 font-bold hover:text-red-700 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out from all devices
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
