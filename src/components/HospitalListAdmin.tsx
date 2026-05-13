"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { getToken } from "@/lib/tokenStorage";
import { Building2, MapPin, Phone, DollarSign, Clock, Trash2, Edit3, Loader2, Star, CreditCard, User, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCallback } from "react";

export default function HospitalListAdmin() {
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;
        
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

    if (loading) {
        return (
            <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Scanning Facilities...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {hospitals.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No hospitals registered yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                        {hospitals.map((hospital) => (
                            <motion.div
                                key={hospital._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group bg-white border border-gray-100 p-5 rounded-2xl hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -z-10 transition-colors group-hover:bg-blue-100/50" />
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                                            {hospital.image ? (
                                                <Image src={hospital.image} alt={hospital.name} fill className="object-cover rounded-2xl" unoptimized />
                                            ) : (
                                                <Building2 className="w-7 h-7 text-primary" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-lg leading-tight">{hospital.name}</h4>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                <span className="text-xs font-black text-gray-700">{hospital.rating || 'N/A'}</span>
                                                <span className="text-gray-300 mx-1">•</span>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{hospital.city}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(hospital._id, hospital.name)}
                                        className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="truncate">{hospital.address}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                            <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> ₹{hospital.consultationFee}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                            <User className="w-3.5 h-3.5 text-blue-500" /> {hospital.doctors?.length || 0} Doctors
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                                    {hospital.isOpen24Hours && (
                                        <span className="px-2 py-0.5 bg-blue-50 text-primary text-[10px] font-black uppercase rounded">24/7 Open</span>
                                    )}
                                    {hospital.isOnlinePaymentAvailable && (
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded">Digital Pay</span>
                                    )}
                                    {hospital.ambulanceContact && (
                                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-black uppercase rounded flex items-center gap-1">
                                            <Phone className="w-2.5 h-2.5" /> Ambulance
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
