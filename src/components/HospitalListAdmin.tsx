"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { getToken } from "@/lib/tokenStorage";
import { 
    Building2, 
    MapPin, 
    Phone, 
    IndianRupee, 
    Clock, 
    Trash2, 
    Edit3, 
    Loader2, 
    Star, 
    CreditCard, 
    User, 
    MoreVertical,
    ChevronDown,
    ChevronUp,
    ImageIcon,
    Stethoscope,
    Calendar,
    ExternalLink,
    Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCallback } from "react";

export default function HospitalListAdmin() {
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchHospitals = useCallback(async () => {
        try {
            const res = await api.get("/hospitals");
            setHospitals(res.data);
        } catch (err: any) {
            setError("Failed to fetch hospitals");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHospitals();
    }, [fetchHospitals]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;
        
        try {
            const token = getToken();
            await api.delete(`/hospitals/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHospitals(prev => prev.filter(h => h._id !== id));
        } catch (err) {
            alert("Failed to delete hospital");
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] italic">Accessing Facility Database...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {hospitals.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                    <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Directory Empty</h4>
                    <p className="text-slate-500 mt-2 font-medium">No medical facilities have been registered yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence>
                        {hospitals.map((hospital) => (
                            <motion.div
                                key={hospital._id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`group bg-white border rounded-[2.5rem] transition-all duration-500 overflow-hidden ${
                                    expandedId === hospital._id 
                                    ? 'border-blue-200 shadow-2xl shadow-blue-900/10' 
                                    : 'border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5'
                                }`}
                            >
                                {/* Header Section */}
                                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                            {hospital.image ? (
                                                <Image src={hospital.image} alt={hospital.name} fill className="object-cover" unoptimized />
                                            ) : (
                                                <Building2 className="w-10 h-10 text-blue-600" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-black text-slate-900 text-xl tracking-tight leading-tight">{hospital.name}</h4>
                                                {hospital.rating && (
                                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black border border-amber-100">
                                                        <Star className="w-3 h-3 fill-amber-600" /> {hospital.rating}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                                    <MapPin className="w-3.5 h-3.5 text-blue-500" /> {hospital.city}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                                    <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> ₹{hospital.consultationFee} Fee
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                                    <User className="w-3.5 h-3.5 text-indigo-500" /> {hospital.doctors?.length || 0} Doctors
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleDelete(hospital._id, hospital.name)}
                                            className="p-4 bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all group/del"
                                        >
                                            <Trash2 className="w-5 h-5 group-hover/del:rotate-12 transition-transform" />
                                        </button>
                                        <button 
                                            onClick={() => toggleExpand(hospital._id)}
                                            className={`p-4 rounded-2xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest ${
                                                expandedId === hospital._id 
                                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                                                : 'bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600'
                                            }`}
                                        >
                                            {expandedId === hospital._id ? 'Close' : 'Details'}
                                            {expandedId === hospital._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {expandedId === hospital._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: "circOut" }}
                                            className="border-t border-slate-50 bg-slate-50/30"
                                        >
                                            <div className="p-8 md:p-12 space-y-12">
                                                {/* Top Grid: Info & Description */}
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                    <div className="space-y-8">
                                                        <div>
                                                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Official Bio</h5>
                                                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm leading-relaxed text-slate-600 italic">
                                                                {hospital.description || "No description provided for this facility."}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Emergency Contact</p>
                                                                <a href={`tel:${hospital.ambulanceContact}`} className="flex items-center gap-3 text-lg font-black text-rose-600 hover:underline">
                                                                    <Phone className="w-5 h-5" /> {hospital.ambulanceContact || "N/A"}
                                                                </a>
                                                            </div>
                                                            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Management</p>
                                                                <p className="font-black text-slate-900 uppercase tracking-tighter text-lg">{hospital.management_type || "SELF"}</p>
                                                            </div>
                                                        </div>

                                                        {/* Zoho Mail Button */}
                                                        {hospital.user?.email && (
                                                            <a 
                                                                href={`https://mail.zoho.com/zm/#mail/compose?to=${hospital.user.email}&subject=Regarding Hospital: ${hospital.name}&body=Hello ${hospital.name} Team,%0D%0A%0D%0AWe are contacting you regarding your hospital's profile on Pillora...`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center justify-center gap-3 w-full py-4 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 mt-4 group"
                                                            >
                                                                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" /> Contact via Zoho Mail
                                                            </a>
                                                        )}
                                                    </div>

                                                    <div className="space-y-8">
                                                        <div>
                                                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Facility Features</h5>
                                                            <div className="flex flex-wrap gap-3">
                                                                {hospital.isOpen24Hours && (
                                                                    <div className="px-5 py-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                                                        <Clock className="w-4 h-4" /> 24/7 Operations
                                                                    </div>
                                                                )}
                                                                {hospital.isOnlinePaymentAvailable && (
                                                                    <div className="px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                                                        <CreditCard className="w-4 h-4" /> Digital Pay
                                                                    </div>
                                                                )}
                                                                {hospital.phoneNumbers?.map((ph: string, idx: number) => (
                                                                    <div key={idx} className="px-5 py-3 bg-white text-slate-700 rounded-2xl border border-slate-200 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                                                        <Phone className="w-4 h-4 text-slate-400" /> {ph}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Location Mapping</h5>
                                                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
                                                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                                                    <MapPin className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-900 leading-relaxed">{hospital.address}</p>
                                                                    <p className="text-[10px] font-black text-blue-600 uppercase mt-2 tracking-widest">{hospital.city}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Doctor Directory */}
                                                <div>
                                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Internal Medical Board</h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {hospital.doctors && hospital.doctors.length > 0 ? (
                                                            hospital.doctors.map((doc: any, i: number) => (
                                                                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group/doc hover:border-blue-200 transition-all">
                                                                    <div className="flex items-center gap-4 mb-4">
                                                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 group-hover/doc:bg-blue-600 group-hover/doc:text-white transition-all duration-300">
                                                                            <Stethoscope className="w-6 h-6" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-black text-slate-900 leading-none">{doc.name}</p>
                                                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{doc.specialization}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                                            <Clock className="w-3.5 h-3.5 text-slate-300" /> {doc.timing}
                                                                        </div>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {doc.daysAvailable?.map((day: string) => (
                                                                                <span key={day} className="px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded text-[9px] font-black uppercase">{day.slice(0, 3)}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="col-span-full py-8 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest italic">No doctor data available</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Visual Assets */}
                                                {hospital.images && hospital.images.length > 0 && (
                                                    <div>
                                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Facility Gallery</h5>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                            {hospital.images.map((img: string, i: number) => (
                                                                <div key={i} className="aspect-square relative rounded-2xl overflow-hidden border border-slate-100 hover:scale-105 transition-transform duration-500 shadow-sm">
                                                                    <Image src={img} alt={`${hospital.name} gallery ${i}`} fill className="object-cover" unoptimized />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
