"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    MapPin, Phone, Clock, CreditCard, Ambulance, ShieldCheck,
    Star, ChevronLeft, ChevronRight, User, CheckCircle, XCircle,
    Building, ArrowLeft, ExternalLink, Share2, AlertCircle, Calendar
} from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Doctor {
    name: string;
    specialization?: string;
    daysAvailable?: string[];
    timing?: string;
}

interface Hospital {
    _id: string;
    slug: string;
    name: string;
    address: string;
    mapLink?: string;
    city: string;
    image: string;
    images?: string[];
    isOpen24Hours: boolean;
    consultationFee: number;
    governmentSchemes: string[];
    isOnlinePaymentAvailable: boolean;
    ambulanceContact: string;
    contactNumber?: string;
    phoneNumbers?: string[];
    description: string;
    rating: number;
    doctors?: Doctor[];
}

// ─── Slideshow ─────────────────────────────────────────────────────────────────
function ImageSlideshow({ images, alt }: { images: string[]; alt: string }) {
    const [idx, setIdx] = useState(0);
    const fallback = '/premium-hospital.png';

    const resolveSrc = (s?: string) => {
        if (!s) return fallback;
        if (s.startsWith('/uploads/')) return `http://localhost:5000${s}`;
        if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:')) return s;
        return fallback;
    };

    const prev = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }, [images.length]);
    const next = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }, [images.length]);

    useEffect(() => {
        if (images.length <= 1) return;
        const t = setInterval(() => setIdx(i => (i + 1) % images.length), 4000);
        return () => clearInterval(t);
    }, [images.length]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-gray-100">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={resolveSrc(images[idx])}
                        alt={`${alt} – image ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                        priority
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallback; }}
                    />
                </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
                <>
                    <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-colors z-10">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-colors z-10">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {images.map((_, i) => (
                            <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                                className={`h-2 rounded-full transition-all ${i === idx ? 'bg-white w-5' : 'bg-white/50 w-2'}`} />
                        ))}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full z-10 shadow-sm font-medium">
                        {idx + 1}/{images.length}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, valueClass = 'font-semibold text-gray-900 text-base' }: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    valueClass?: string;
}) {
    return (
        <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shrink-0">{icon}</div>
            <div className="min-w-0">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                <div className={`mt-1 ${valueClass}`}>{value}</div>
            </div>
        </div>
    );
}

interface Slot {
    _id: string;
    startTime: string;
    endTime: string;
    status: 'available' | 'booked' | 'blocked';
}

function DoctorBookingInline({ doctor, hospital }: { doctor: any; hospital: any }) {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
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

    // Real-time updates via Socket.io
    useEffect(() => {
        const { socket } = require("@/lib/socket");
        socket.connect();

        const onSlotBooked = (data: any) => {
            if (data.doctorId === doctor._id && data.date === selectedDate) {
                setSlots(prev => prev.map(s => 
                    s._id === data.slotId ? { ...s, status: 'booked' } : s
                ));
                if (selectedSlot?._id === data.slotId) {
                    setSelectedSlot(null);
                }
            }
        };

        const onSlotsUpdated = (data: any) => {
            if (data.doctorId === doctor._id && data.date === selectedDate) {
                fetchSlots(selectedDate);
            }
        };

        socket.on("slotBooked", onSlotBooked);
        socket.on("slotsUpdated", onSlotsUpdated);

        return () => {
            socket.off("slotBooked", onSlotBooked);
            socket.off("slotsUpdated", onSlotsUpdated);
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
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center"
            >
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="text-base font-extrabold text-slate-800">Booking Confirmed!</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">Your appointment with Dr. {doctor.name} has been scheduled successfully.</p>
                <button 
                    onClick={() => {
                        setSuccess(false);
                        setSelectedSlot(null);
                        fetchSlots(selectedDate);
                    }} 
                    className="mt-4 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                    Book Another Slot
                </button>
            </motion.div>
        );
    }

    return (
        <div className="mt-5 pt-5 border-t border-slate-100 space-y-4">
            {error && (
                <div className="p-3.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 text-[11px] font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-0.5">Choose Appointment Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="date"
                            min={today}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>
                
                <div className="flex gap-4 pb-2 sm:justify-end">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[8px] font-black text-slate-400 uppercase">Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <span className="text-[8px] font-black text-slate-400 uppercase">Booked</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Select Time Slot</label>

                {loading ? (
                    <div className="flex items-center justify-center py-6">
                        <motion.div 
                            animate={{ rotate: 360 }} 
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-2 border-blue-50 border-t-blue-600 rounded-full" 
                        />
                    </div>
                ) : slots.length === 0 ? (
                    <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold italic text-xs">No slots generated for this date yet.</p>
                        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Please try another date</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        {slots.map((slot) => {
                            const isSelected = selectedSlot?._id === slot._id;
                            const isBooked = slot.status !== 'available';
                            
                            return (
                                <button
                                    key={slot._id}
                                    disabled={isBooked}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`
                                        relative py-2.5 rounded-xl text-[10px] font-black transition-all duration-300
                                        flex items-center justify-center border
                                        ${isSelected 
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-400/20 scale-105 z-10' 
                                            : !isBooked
                                                ? 'bg-white border-emerald-100 text-emerald-600 hover:border-emerald-500 hover:bg-emerald-50' 
                                                : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-60'
                                        }
                                    `}
                                >
                                    <span className={`flex flex-col items-center leading-none ${isBooked ? 'line-through decoration-slate-300/50' : ''}`}>
                                        <span className="font-extrabold">{new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                        <span className="text-[7.5px] opacity-60 mt-0.5">{new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <button
                disabled={!selectedSlot || bookingLoading}
                onClick={handleBook}
                className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-gray-900/10 hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
            >
                {bookingLoading ? (
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full mx-auto" 
                    />
                ) : "Confirm Booking"}
            </button>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function HospitalDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [hospital, setHospital] = useState<Hospital | null>(null);
    const [loading, setLoading] = useState(true);

    const fallbackImage = '/premium-hospital.png';

    const resolveSrc = (s?: string) => {
        if (!s) return fallbackImage;
        if (s.startsWith('/uploads/')) return `http://localhost:5000${s}`;
        if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:')) return s;
        return fallbackImage;
    };

    const getImages = (h: Hospital): string[] => {
        if (h.images && h.images.length > 0) return h.images.map(resolveSrc);
        if (h.image) return [resolveSrc(h.image)];
        return [fallbackImage];
    };

    const phoneList = (h: Hospital) =>
        (h.phoneNumbers && h.phoneNumbers.length > 0 ? h.phoneNumbers : h.contactNumber ? [h.contactNumber] : []).filter(Boolean);

    const getMapUrl = (h: Hospital) =>
        h.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${h.address}, ${h.city}`)}`;

    useEffect(() => {
        const fetchHospital = async () => {
            try {
                const res = await api.get(`/hospitals/${params.slug}`);
                setHospital(res.data);
            } catch (err) {
                console.error('Failed to fetch hospital', err);
            } finally {
                setLoading(false);
            }
        };
        if (params.slug) fetchHospital();
    }, [params.slug]);

    // Loading skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 animate-pulse">
                <div className="h-64 sm:h-80 bg-gray-200" />
                <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-200 rounded-xl" />)}
                    </div>
                </div>
            </div>
        );
    }

    if (!hospital) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
                <Building className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Hospital not found</h2>
                <p className="text-gray-500 mb-6 text-sm">This hospital may have been removed or doesn&apos;t exist.</p>
                <button onClick={() => router.push('/hospitals')} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
                    Back to Hospitals
                </button>
            </div>
        );
    }

    const imgs = getImages(hospital);
    const phones = phoneList(hospital);

    const processedDesc = hospital.description
        ? hospital.description
            // Normalise tags
            .replace(/<strong>/gi, '<b>').replace(/<\/strong>/gi, '</b>')
            .replace(/<em>/gi, '<i>').replace(/<\/em>/gi, '</i>')
            // Strip inline styles so our CSS controls appearance
            .replace(/ style="[^"]*"/gi, '')
            .replace(/ style='[^']*'/gi, '')
            // Ensure proper spacing between bold segments
            .replace(/<\/b>(\s*:)/gi, '</b>$1<br/>')
            .replace(/([^>])\s*<b>/gi, '$1<br/><b>')
            // Remove consecutive empty <br> spam
            .replace(/(<br\s*\/?>(\s*)){3,}/gi, '<br/><br/>')
        : '';

    return (
        <div className="min-h-screen bg-gray-50 pb-16">

            {/* ── Hero Image — fixed height, no text overlay ── */}
            <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 bg-gray-200 overflow-hidden">
                <ImageSlideshow images={imgs} alt={hospital.name} />

                {/* Back button */}
                <button
                    onClick={() => router.push('/hospitals')}
                    className="absolute top-4 left-4 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-xl flex items-center gap-2 transition-all text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                </button>

                {/* Rating + 24/7 badges */}
                <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                    <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-xl text-sm font-bold shadow flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {hospital.rating}
                    </span>
                    {hospital.isOpen24Hours && (
                        <span className="bg-green-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow">
                            <Clock className="w-3.5 h-3.5" /> Open 24/7
                        </span>
                    )}
                </div>
            </div>

            {/* ── Hospital Name + Address — clearly below image, white background ── */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                            {hospital.name}
                        </h1>
                        <button
                            onClick={() => {
                                const url = `https://www.pillora.in/hospitals/${hospital.slug}`;
                                if (navigator.share) {
                                    navigator.share({ title: hospital.name, url });
                                } else {
                                    navigator.clipboard.writeText(url);
                                    alert('Link copied to clipboard!');
                                }
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors shrink-0 outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-xs sm:text-sm"
                        >
                            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Share</span>
                        </button>
                    </div>
                    <a
                        href={getMapUrl(hospital)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 transition-colors group"
                        title="Open in Google Maps"
                    >
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                        <span>{hospital.address}, {hospital.city}</span>
                        <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* ──── Left: Main Info ──── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <StatCard
                                icon={<CreditCard className="w-5 h-5" />}
                                label="Consultation Fee"
                                value={`₹${hospital.consultationFee}`}
                                valueClass="font-bold text-gray-900 text-lg"
                            />
                            <StatCard
                                icon={<Ambulance className="w-5 h-5" />}
                                label="Ambulance"
                                value={hospital.ambulanceContact || '—'}
                                valueClass="font-semibold text-red-600 text-base"
                            />
                            <StatCard
                                icon={<Clock className="w-5 h-5" />}
                                label="Open 24/7"
                                value={
                                    hospital.isOpen24Hours
                                        ? <span className="flex items-center gap-1.5 text-green-600 font-semibold"><CheckCircle className="w-4 h-4" /> Yes</span>
                                        : <span className="flex items-center gap-1.5 text-red-500 font-semibold"><XCircle className="w-4 h-4" /> No</span>
                                }
                            />
                            <StatCard
                                icon={<CreditCard className="w-5 h-5" />}
                                label="Online Payment"
                                value={
                                    hospital.isOnlinePaymentAvailable
                                        ? <span className="flex items-center gap-1.5 text-green-600 font-semibold"><CheckCircle className="w-4 h-4" /> Available</span>
                                        : <span className="flex items-center gap-1.5 text-red-500 font-semibold"><XCircle className="w-4 h-4" /> Not Available</span>
                                }
                            />
                        </div>

                        {/* Contact Card */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Phone className="w-4 h-4" /></span>
                                Contact Details
                            </h3>
                            {phones.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {phones.map((ph, i) => (
                                        <a href={`tel:${ph}`} key={i}
                                            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-colors group">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors shrink-0">
                                                    <Phone className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                                                </div>
                                                <span className="font-semibold text-gray-800 group-hover:text-blue-700 text-sm">{ph}</span>
                                            </div>
                                            {i === 0 && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">Primary</span>}
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">No contact numbers listed.</p>
                            )}
                        </div>

                        {/* Doctors */}
                        {hospital.doctors && hospital.doctors.length > 0 && (
                            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><User className="w-4 h-4 sm:w-5 sm:h-5" /></span>
                                        Available Doctors
                                    </h3>
                                    <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold">
                                        {hospital.doctors.length} Doctor{hospital.doctors.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {hospital.doctors.map((doc, i) => (
                                        <div key={i} className="bg-gradient-to-br from-blue-50/35 to-indigo-50/35 border border-blue-100/60 rounded-[2rem] p-6 shadow-sm">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                                    <User className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-900 text-sm sm:text-base">{doc.name}</p>
                                                    {doc.specialization && (
                                                        <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full inline-block mt-0.5">
                                                            {doc.specialization}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
                                                {doc.timing && (
                                                    <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-gray-200 font-semibold shadow-sm">
                                                        <Clock className="w-3.5 h-3.5 text-blue-500" /> {doc.timing}
                                                    </span>
                                                )}
                                                {doc.daysAvailable && doc.daysAvailable.length > 0 && doc.daysAvailable.map(d => (
                                                    <span key={d} className="bg-green-100 text-green-800 border border-green-200 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wide">
                                                        {d.slice(0, 3)}
                                                    </span>
                                                ))}
                                            </div>
                                            <DoctorBookingInline doctor={doc} hospital={hospital} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {processedDesc && (
                            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
                                {/* Section header */}
                                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                                    <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
                                        <Building className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">About the Hospital</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">Details provided by the hospital</p>
                                    </div>
                                </div>

                                {/* Description body */}
                                <style>{`
                                    .hosp-desc { font-size: 14px; line-height: 1.8; color: #374151; }
                                    @media (min-width: 640px) { .hosp-desc { font-size: 15px; } }
                                    .hosp-desc b, .hosp-desc strong {
                                        font-weight: 700;
                                        color: #1d4ed8;
                                        display: block;
                                        margin-top: 12px;
                                        margin-bottom: 2px;
                                        font-size: 13px;
                                        text-transform: uppercase;
                                        letter-spacing: 0.04em;
                                    }
                                    .hosp-desc b:first-child, .hosp-desc strong:first-child { margin-top: 0; }
                                    .hosp-desc i, .hosp-desc em { font-style: italic; color: #6b7280; }
                                    .hosp-desc u { text-decoration: underline; text-underline-offset: 3px; }
                                    .hosp-desc p { margin-bottom: 10px; }
                                    .hosp-desc p:last-child { margin-bottom: 0; }
                                    .hosp-desc br { display: block; margin-bottom: 4px; content: ''; }
                                    .hosp-desc ul { list-style: disc; padding-left: 20px; margin-bottom: 12px; }
                                    .hosp-desc ol { list-style: decimal; padding-left: 20px; margin-bottom: 12px; }
                                    .hosp-desc li { margin-bottom: 4px; color: #4b5563; }
                                    .hosp-desc h1, .hosp-desc h2 { font-weight: 700; color: #111827; margin: 12px 0 6px; }
                                    .hosp-desc h1 { font-size: 16px; } 
                                    .hosp-desc h2 { font-size: 14px; }
                                `}</style>
                                <div
                                    className="hosp-desc"
                                    dangerouslySetInnerHTML={{ __html: processedDesc }}
                                />
                            </div>
                        )}
                    </div>

                    {/* ──── Right: Sidebar ──── */}
                    <div className="space-y-4 lg:sticky lg:top-24 self-start">

                        {/* Clickable Map Link */}
                        <a
                            href={getMapUrl(hospital)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-colors shadow group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm">View on Maps</p>
                                <p className="text-blue-100 text-xs truncate">{hospital.address}, {hospital.city}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 opacity-70 shrink-0" />
                        </a>

                        {/* Government Schemes */}
                        {hospital.governmentSchemes?.length > 0 && (
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4" /> Accepted Schemes
                                </p>
                                <div className="flex flex-col gap-2">
                                    {hospital.governmentSchemes.map((s, i) => (
                                        <div key={i} className="flex items-center gap-2.5 p-2.5 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                                            <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                                            <span className="text-xs sm:text-sm font-semibold leading-snug">{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
