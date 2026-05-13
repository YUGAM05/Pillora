"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, CheckCircle, AlertCircle, Loader2, User } from "lucide-react";

interface Slot {
    _id: string;
    startTime: string;
    status: 'available' | 'booked' | 'blocked';
}

export default function BookingModal({ doctor, hospital, onClose }: any) {
    const [selectedDate, setSelectedDate] = useState("");
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [loading, setLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

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

    const handleBook = async () => {
        if (!selectedSlot) return;
        setBookingLoading(true);
        setError("");
        try {
            await api.post("/hospital/dashboard/appointments", {
                doctorId: doctor._id,
                hospitalId: hospital._id,
                slotId: selectedSlot._id,
                slotTime: selectedSlot.startTime
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
            <div className="text-center p-8">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-500 font-medium mb-8">Your appointment with Dr. {doctor.name} has been scheduled successfully.</p>
                <button onClick={onClose} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold">Done</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
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
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Available Slots</label>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : slots.length === 0 ? (
                            <p className="text-center py-8 text-gray-400 font-bold italic text-sm">No slots available for this date.</p>
                        ) : (
                            <div className="grid grid-cols-3 gap-3">
                                {slots.map((slot) => (
                                    <button
                                        key={slot._id}
                                        disabled={slot.status !== 'available'}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                                            selectedSlot?._id === slot._id 
                                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' 
                                            : slot.status === 'available' 
                                                ? 'bg-white border-gray-100 text-gray-700 hover:border-primary/30' 
                                                : 'bg-gray-50 border-transparent text-gray-300 cursor-not-allowed'
                                        }`}
                                    >
                                        {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <button
                disabled={!selectedSlot || bookingLoading}
                onClick={handleBook}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-gray-900/20 hover:bg-gray-800 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
            >
                {bookingLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Confirm Booking"}
            </button>
        </div>
    );
}
