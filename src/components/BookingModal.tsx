"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, CheckCircle, AlertCircle, Loader2, User as UserIcon } from "lucide-react";

interface Slot {
    _id: string;
    startTime: string;
    endTime: string;
    status: 'available' | 'booked' | 'blocked';
}

export default function BookingModal({ doctor, hospital, onClose }: any) {
    const [step, setStep] = useState(1); // Step 1: Slot selection, Step 2: Patient details form
    const [selectedDate, setSelectedDate] = useState("");
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [loading, setLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Intake Form Details
    const [patientName, setPatientName] = useState("");
    const [patientPhone, setPatientPhone] = useState("");
    const [patientEmail, setPatientEmail] = useState("");
    const [patientAge, setPatientAge] = useState("");

    // Prefill profile details from token storage
    useEffect(() => {
        try {
            const { getUser } = require("@/lib/tokenStorage");
            const currentUser = getUser();
            if (currentUser) {
                setPatientName(currentUser.name || "");
                setPatientEmail(currentUser.email || "");
                setPatientPhone(currentUser.phone || "");
            }
        } catch (e) {
            console.error("Failed to load user profile in BookingModal", e);
        }
    }, []);

    const fetchSlots = useCallback(async (date: string) => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get(`/hospital/dashboard/doctors/${doctor._id}/slots?date=${date}`);
            setSlots(res.data);
        } catch (err) {
            setError("Failed to load slots for this date");
        } finally {
            setLoading(false);
        }
    }, [doctor._id]);

    useEffect(() => {
        if (selectedDate) fetchSlots(selectedDate);
    }, [selectedDate, fetchSlots]);

    // Real-time updates via Socket.io
    useEffect(() => {
        const { socket } = require("@/lib/socket");
        socket.connect();

        socket.on("slotBooked", (data: any) => {
            if (data.doctorId === doctor._id && data.date === selectedDate) {
                setSlots(prev => prev.map(s => 
                    s._id === data.slotId ? { ...s, status: 'booked' } : s
                ));
                if (selectedSlot?._id === data.slotId) {
                    setSelectedSlot(null);
                }
            }
        });

        socket.on("slotsUpdated", (data: any) => {
            if (data.doctorId === doctor._id && data.date === selectedDate) {
                fetchSlots(selectedDate);
            }
        });

        return () => {
            socket.off("slotBooked");
            socket.off("slotsUpdated");
            socket.disconnect();
        };
    }, [doctor._id, selectedDate, selectedSlot, fetchSlots]);

    const handleBook = async () => {
        if (!selectedSlot) return;
        setBookingLoading(true);
        setError("");
        try {
            await api.post("/hospital/dashboard/appointments", {
                doctorId: doctor._id,
                hospitalId: hospital._id,
                slotId: selectedSlot._id,
                slotTime: selectedSlot.startTime,
                patientName,
                patientPhone,
                patientEmail,
                patientAge: Number(patientAge)
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || "Booking failed. Please try again.");
        } finally {
            setBookingLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center p-8 animate-fade-in">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-500 font-medium mb-8">Your appointment with Dr. {doctor.name} has been scheduled successfully for {patientName}.</p>
                <button onClick={onClose} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors">Done</button>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">Patient Details</h3>
                        <p className="text-sm text-gray-500 font-medium">Dr. {doctor.name} • Time slot chosen</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-xs font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Patient Name</label>
                        <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-slate-800"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                placeholder="Phone Number"
                                value={patientPhone}
                                onChange={(e) => setPatientPhone(e.target.value)}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-slate-800"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="120"
                                placeholder="Age"
                                value={patientAge}
                                onChange={(e) => setPatientAge(e.target.value)}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-slate-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="Email Address"
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-slate-800"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-2">
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all"
                    >
                        Back
                    </button>
                    <button
                        disabled={!patientName || !patientPhone || !patientEmail || !patientAge || bookingLoading}
                        onClick={handleBook}
                        className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-gray-900/20 hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
                    >
                        {bookingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Booking"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-black text-gray-900">Book Appointment</h3>
                    <p className="text-sm text-gray-500 font-medium">Dr. {doctor.name} • {doctor.specialization}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                </div>

                {selectedDate && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Time Slot</label>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Free</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Booked</span>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <motion.div 
                                    animate={{ rotate: 360 }} 
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-8 h-8 border-3 border-blue-50 border-t-blue-600 rounded-full" 
                                />
                            </div>
                        ) : slots.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="text-center py-12 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-100"
                            >
                                <p className="text-slate-400 font-bold italic text-sm">No slots generated for this date yet.</p>
                                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">Please check another date</p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {slots.map((slot) => {
                                    const isSelected = selectedSlot?._id === slot._id;
                                    const isBooked = slot.status !== 'available';
                                    
                                    return (
                                        <button
                                            key={slot._id}
                                            disabled={isBooked}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`
                                                relative py-3 rounded-xl text-[11px] font-black transition-all duration-300
                                                flex items-center justify-center border-2
                                                ${isSelected 
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-400/30 scale-110 z-10' 
                                                    : !isBooked
                                                        ? 'bg-white border-emerald-100 text-emerald-600 hover:border-emerald-500 hover:bg-emerald-50 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/5' 
                                                        : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-60'
                                                }
                                            `}
                                        >
                                            <span className={`flex flex-col items-center leading-none ${isBooked ? 'line-through decoration-slate-300/50' : ''}`}>
                                                <span className="font-extrabold">{new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                                <span className="text-[8px] opacity-60 mt-0.5">{new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                            </span>
                                            {isSelected && (
                                                <motion.div 
                                                    layoutId="selection-ring"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="absolute -inset-1.5 border-2 border-blue-600/30 rounded-2xl pointer-events-none"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <button
                disabled={!selectedSlot || bookingLoading}
                onClick={() => setStep(2)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-gray-900/20 hover:bg-gray-800 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
            >
                Continue
            </button>
        </div>
    );
}
