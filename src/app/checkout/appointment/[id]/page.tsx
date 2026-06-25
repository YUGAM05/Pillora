"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, ShieldCheck, HelpCircle, Calendar, Clock, User as UserIcon, Building2 } from "lucide-react";
import Link from "next/link";

export default function AppointmentCheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const [appointmentId, setAppointmentId] = useState<string>("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const searchParamId = new URLSearchParams(window.location.search).get("appointmentId");
            const routeParamId = params?.id as string;
            setAppointmentId(searchParamId || routeParamId || "");
        }
    }, [params]);

    const [appointment, setAppointment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const consultationFee = Number(appointment?.consultationFee || 0);
    const advanceFee = consultationFee * 0.20;
    const remainingFee = consultationFee - advanceFee;

    // Fetch appointment details
    const fetchAppointment = useCallback(async () => {
        if (!appointmentId) return;
        try {
            setLoading(true);
            setError("");
            const res = await api.get(`/appointments/${appointmentId}`);
            const data = res.data;
            if (!data || data.consultationFee <= 0) {
                setError("Invalid appointment fee");
            } else {
                setAppointment(data);
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError("Appointment not found");
            } else {
                setError("Unable to load appointment details");
            }
        } finally {
            setLoading(false);
        }
    }, [appointmentId]);

    useEffect(() => {
        if (appointmentId) {
            fetchAppointment();
        }
    }, [appointmentId, fetchAppointment]);

    // Load Razorpay SDK Script
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if ((window as any).Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!appointment) return;
        setPaymentLoading(true);
        setError("");

        try {
            // 1. Load Razorpay script
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                setError("Failed to load payment gateway SDK. Please check your internet connection.");
                setPaymentLoading(false);
                return;
            }

            // 2. Initiate Payment Order on Backend
            const response = await api.post("/payments/initiate", {
                appointmentId: appointment.appointmentId || appointmentId,
                userId: localStorage.getItem("userId"),
                doctorId: appointment.doctorId,
                hospitalId: appointment.hospitalId,
                consultationFee: appointment.consultationFee
            });

            if (!response.data.razorpayOrderId) {
                setError("Payment gateway error. Try again.");
                return;
            }

            const { razorpayOrderId, advanceFee, keyId } = response.data;

            // 3. Open Razorpay Checkout Widget
            const options = {
                key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_51Mz2wYSHB3q5Xn",
                amount: Math.round(advanceFee * 100), // paise
                currency: "INR",
                name: "Pillora Healthcare",
                description: `20% Advance Booking Fee for Dr. ${appointment.doctorName || "Consultant"}`,
                order_id: razorpayOrderId,
                prefill: {
                    name: appointment.patientName || "",
                    email: appointment.patientEmail || "",
                    contact: appointment.patientPhone || ""
                },
                notes: {
                    appointmentId: appointment.appointmentId || appointmentId,
                    hospitalId: appointment.hospitalId
                },
                theme: {
                    color: "#2563eb" // Pillora Blue
                },
                handler: async function (response: any) {
                    setPaymentLoading(true);
                    try {
                        // 4. Verify Payment on Backend
                        const verifyRes = await api.post("/payments/verify", {
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            setSuccess(true);
                            setTimeout(() => {
                                router.push("/dashboard");
                            }, 3000);
                        } else {
                            setError("Payment verification failed. Please contact support.");
                        }
                    } catch (err: any) {
                        setError(err.response?.data?.message || "Failed to verify transaction signature.");
                    } finally {
                        setPaymentLoading(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setPaymentLoading(false);
                        setError("Payment was cancelled by the user.");
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err: any) {
            // Handle different error types
            if (err.response?.status === 401) {
                setError("Please login first");
            } else if (err.response?.status === 404) {
                setError("Appointment not found");
            } else if (err.response?.status === 400) {
                setError(err.response.data.error || err.response.data.message);
            } else {
                setError("Payment failed. Try again.");
            }
            console.error("Payment error:", err.response?.data);
        } finally {
            setPaymentLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="mt-4 font-bold text-slate-500">Retrieving consultation fee details...</p>
            </div>
        );
    }

    if (error && !appointment) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center max-w-md w-full">
                    <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-bounce" />
                    <h1 className="text-2xl font-black text-slate-950 mb-2">Checkout Error</h1>
                    <p className="text-slate-500 font-semibold mb-6">{error}</p>
                    <Link href="/dashboard" className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition block">
                        Back to Bookings
                    </Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-emerald-100 text-center max-w-md w-full animate-fade-in">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-14 h-14 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-950 mb-2">Booking Confirmed!</h1>
                    <p className="text-emerald-600 font-bold text-sm mb-4">₹{advanceFee.toFixed(2)} Paid Successfully</p>
                    <p className="text-slate-400 font-medium mb-6">Your appointment is now confirmed. We have sent a confirmation email to you. Redirecting to dashboard...</p>
                    <Link href="/dashboard" className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition block">
                        View Dashboard Now
                    </Link>
                </div>
            </div>
        );
    }    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full sm:w-[800px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 animate-fade-in">
                    <Link href="/dashboard" className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50/50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-blue-600" />
                    </Link>
                    <div>
                        <span className="text-[9px] font-black text-blue-600/80 uppercase tracking-[0.2em] bg-blue-50/80 px-3 py-1 rounded-full border border-blue-100/40">Secure Transaction</span>
                        <h1 className="text-3xl font-black text-slate-900 leading-none mt-2.5">Confirm & Pay</h1>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-bold shadow-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Details & Policies */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Consultation Summary */}
                        <div className="bg-white rounded-[2rem] border border-slate-100/80 p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                            <h2 className="text-base font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-2.5">
                                <Calendar className="w-5 h-5 text-blue-600" /> Appointment Details
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 font-black text-xl shadow-md shadow-blue-500/20 border border-blue-400/20">
                                        {(appointment.doctorName || "Dr").charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 text-base">{appointment.doctorName || "Consultant"}</h3>
                                        <p className="text-xs text-blue-650 font-extrabold uppercase tracking-widest mt-1">Specialist Physician</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 border-t border-slate-50">
                                    <div>
                                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Hospital / Clinic</span>
                                        <span className="font-extrabold text-slate-800 text-xs flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                                            {appointment.hospitalName || "Pillora Hospital"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Slot Date & Time</span>
                                        <span className="font-extrabold text-slate-800 text-xs flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                                            {appointment.appointmentDate && appointment.appointmentTime ? (
                                                `${appointment.appointmentDate} at ${appointment.appointmentTime}`
                                            ) : (
                                                appointment.slotTime ? `${new Date(appointment.slotTime).toLocaleDateString([], { month: 'short', day: '2-digit' })}, ${new Date(appointment.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}` : ""
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-slate-50">
                                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Patient Details</span>
                                    <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/50 shadow-sm">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="font-black text-slate-800 text-xs sm:text-sm block">
                                                {appointment.patientName}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                                                {appointment.patientAge} Years Old • {appointment.patientPhone}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cancellation Policy */}
                        <div className="bg-white rounded-[2rem] border border-slate-100/80 p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-4">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2.5">
                                <HelpCircle className="w-4 h-4 text-slate-400" /> Cancellation & Refund Policy
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4.5 bg-rose-500/5 border border-rose-500/10 rounded-2xl space-y-1.5">
                                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block">User Cancellation</span>
                                    <p className="text-xs font-bold text-slate-600 leading-normal">
                                        Cancellation requested by user is <span className="text-rose-600 font-black">non-refundable</span>.
                                    </p>
                                </div>
                                <div className="p-4.5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-1.5">
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block">Hospital Cancellation</span>
                                    <p className="text-xs font-bold text-slate-600 leading-normal">
                                        If hospital cancels, you receive a <span className="text-emerald-600 font-black">100% full refund</span> within 48 hours.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing & Pay CTA */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_15px_40px_rgba(59,130,246,0.04)] border border-slate-100/80 space-y-6 sticky top-4">
                            <div className="flex items-center gap-2 text-[9px] font-black text-blue-650 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">
                                <ShieldCheck className="w-4 h-4 text-blue-500" /> Guaranteed Secure Checkout
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                    <span>Consultation Fee</span>
                                    <span className="text-slate-800">₹{consultationFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-slate-500 pb-3 border-b border-slate-50">
                                    <span>Advance Booking Fee (20%)</span>
                                    <span className="text-blue-600 font-black">₹{advanceFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1 text-sm font-bold text-slate-500">
                                    <span>Payable at Clinic</span>
                                    <span className="text-slate-800">₹{remainingFee.toFixed(2)}</span>
                                </div>

                                <div className="pt-4 space-y-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Total to Pay Now</span>
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-md shadow-blue-500/10">
                                        <span className="text-3xl font-black leading-none">₹{advanceFee.toFixed(2)}</span>
                                        <span className="text-[8px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">Secured</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50/50 border border-blue-100/40 rounded-2xl text-[11px] font-bold text-slate-500 leading-relaxed flex items-start gap-2.5 shadow-sm">
                                <span className="text-blue-500 text-sm shrink-0">💡</span>
                                <span>
                                    The remaining amount of <strong>₹{remainingFee.toFixed(2)}</strong> will be collected in cash or card directly at the hospital counter.
                                </span>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={paymentLoading}
                                className="w-full py-4.5 px-5 bg-blue-650 hover:bg-blue-700 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                            >
                                {paymentLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        PROCESSING PAYMENT...
                                    </>
                                ) : (
                                    "PROCEED TO PAYMENT"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
