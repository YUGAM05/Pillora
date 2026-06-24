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
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-[#F8FAFC] to-blue-50/20 pb-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-3 bg-white border border-blue-100 rounded-2xl hover:bg-blue-50/50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(37,99,235,0.03)] flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-blue-600" />
                    </Link>
                    <div>
                        <span className="text-[10px] font-black text-blue-600/70 uppercase tracking-widest bg-blue-50/50 px-2.5 py-1 rounded-full border border-blue-100/40">Pillora Secure Checkout</span>
                        <h1 className="text-3xl font-black text-slate-900 leading-none mt-2.5">Confirm & Pay</h1>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-bold shadow-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Details & Policies */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Consultation Summary */}
                        <div className="bg-white rounded-[2rem] border border-blue-50/80 p-6 md:p-8 shadow-[0_10px_35px_rgba(37,99,235,0.03)] space-y-6">
                            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2.5">
                                <Calendar className="w-5 h-5 text-blue-600" /> Appointment Details
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 font-black text-xl shadow-md shadow-blue-500/20 border border-blue-400/20">
                                        {(appointment.doctorName || "Dr").charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 text-base">{appointment.doctorName || "Consultant"}</h3>
                                        <p className="text-xs text-blue-600/90 font-extrabold uppercase tracking-widest mt-0.5">Specialist</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                    <div>
                                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Hospital / Clinic</span>
                                        <span className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                                            <Building2 className="w-4 h-4 text-blue-600/80" />
                                            {appointment.hospitalName || "Pillora Hospital"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Slot Date & Time</span>
                                        <span className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-blue-600/80" />
                                            {appointment.appointmentDate && appointment.appointmentTime ? (
                                                `${appointment.appointmentDate} at ${appointment.appointmentTime}`
                                            ) : (
                                                appointment.slotTime ? `${new Date(appointment.slotTime).toLocaleDateString([], { month: 'short', day: '2-digit' })}, ${new Date(appointment.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}` : ""
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Patient Details</span>
                                    <div className="p-4 bg-blue-50/10 border border-blue-100/30 rounded-2xl flex items-start sm:items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="font-extrabold text-slate-800 text-xs sm:text-sm">
                                                {appointment.patientName} • {appointment.patientAge} Yrs • {appointment.patientPhone}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cancellation Policy */}
                        <div className="bg-white rounded-[2rem] border border-blue-50/80 p-6 md:p-8 shadow-[0_10px_35px_rgba(37,99,235,0.03)] space-y-4">
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2.5">
                                <HelpCircle className="w-4 h-4 text-blue-500" /> Cancellation & Refund Policy
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-rose-50/30 border border-rose-100/40 rounded-2xl space-y-1">
                                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider block">User Cancellation</span>
                                    <p className="text-xs font-bold text-slate-700 leading-normal">
                                        Cancellation requested by user is <span className="text-rose-600 font-extrabold">non-refundable</span>.
                                    </p>
                                </div>
                                <div className="p-4 bg-emerald-50/30 border border-emerald-100/40 rounded-2xl space-y-1">
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider block">Hospital Cancellation</span>
                                    <p className="text-xs font-bold text-slate-700 leading-normal">
                                        If hospital cancels, you receive a <span className="text-emerald-600 font-extrabold">100% full refund</span> within 48 hours.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing & Pay CTA */}
                    <div className="lg:col-span-5">
                        <div className="bg-white/95 backdrop-blur-md rounded-[2.2rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(37,99,235,0.08)] border border-blue-100/70 space-y-6 sticky top-4">
                            <div className="flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-50 pb-4">
                                <ShieldCheck className="w-4 h-4 text-blue-500 animate-pulse" /> Guaranteed Secure Transaction
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-slate-500">Consultation Fee</span>
                                    <span className="font-extrabold text-slate-800">₹{consultationFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-slate-500">Booking Advance (20%)</span>
                                    <span className="font-extrabold text-blue-600">₹{advanceFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-200 text-sm">
                                    <span className="font-semibold text-slate-500">Payable at Clinic</span>
                                    <span className="font-extrabold text-slate-800">₹{remainingFee.toFixed(2)}</span>
                                </div>

                                <div className="pt-5 border-t border-blue-50 space-y-2">
                                    <span className="text-[10px] font-black text-blue-600/80 uppercase tracking-widest block">Total to Pay Now</span>
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50/30 border border-blue-100/50 rounded-2xl">
                                        <span className="text-3xl font-black text-blue-600 leading-none">₹{advanceFee.toFixed(2)}</span>
                                        <span className="text-[10px] text-blue-600 font-extrabold uppercase bg-blue-100/50 px-2.5 py-1 rounded-md border border-blue-200/30">Secured</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50/20 border border-blue-100/30 rounded-2xl text-[11px] font-bold text-slate-500 leading-relaxed flex items-start gap-2.5">
                                <span className="text-blue-500 text-sm shrink-0">💡</span>
                                <span>
                                    The remaining amount of <strong>₹{remainingFee.toFixed(2)}</strong> will be collected in cash or card directly at the hospital counter.
                                </span>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={paymentLoading}
                                className="w-full py-4.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                            >
                                {paymentLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing Payment...
                                    </>
                                ) : (
                                    "Proceed to Payment"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
