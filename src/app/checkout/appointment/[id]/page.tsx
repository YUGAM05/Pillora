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
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-3 bg-white border border-slate-200/60 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pillora Secure Checkout</span>
                        <h1 className="text-3xl font-black text-slate-950 leading-none mt-1">Confirm & Pay</h1>
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
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
                            <h2 className="text-lg font-black text-slate-950 border-b pb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" /> Appointment Summary
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 font-black text-lg">
                                        {(appointment.doctorName || "Dr").charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-slate-900 text-base">{appointment.doctorName || "Consultant"}</h3>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Specialist</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                    <div>
                                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Hospital / Clinic</span>
                                        <span className="font-extrabold text-slate-800 text-xs flex items-center gap-1">
                                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                            {appointment.hospitalName || "Pillora Hospital"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Slot Date & Time</span>
                                        <span className="font-extrabold text-slate-800 text-xs flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            {appointment.appointmentDate && appointment.appointmentTime ? (
                                                `${appointment.appointmentDate} at ${appointment.appointmentTime}`
                                            ) : (
                                                appointment.slotTime ? `${new Date(appointment.slotTime).toLocaleDateString([], { month: 'short', day: '2-digit' })}, ${new Date(appointment.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}` : ""
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient Details</span>
                                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                                        {appointment.patientName} ({appointment.patientAge} Yrs) • {appointment.patientPhone}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Cancellation Policy */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-4">
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-slate-500" /> Cancellation Policy
                            </h2>
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3.5">
                                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                                    User cancellation = <span className="text-rose-600 font-extrabold">no refund</span>.
                                </p>
                                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                                    Hospital cancellation = <span className="text-emerald-600 font-extrabold">full refund within 48 hours</span>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing & Pay CTA */}
                    <div className="lg:col-span-5">
                        <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-950/10 space-y-8 sticky top-4">
                            <div className="flex items-center gap-2 text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] border-b border-white/5 pb-4">
                                <ShieldCheck className="w-4 h-4 text-blue-400 animate-pulse" /> Guaranteed Secure Transaction
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-slate-400">
                                    <span className="text-sm font-bold">Consultation Fee</span>
                                    <span className="font-bold text-white">₹{consultationFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span className="text-sm font-bold">Upfront Booking Fee (20%)</span>
                                    <span className="font-bold text-white">₹{advanceFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400 pt-3 border-t border-white/5">
                                    <span className="text-sm font-bold">Payable at Clinic</span>
                                    <span className="font-bold text-white">₹{remainingFee.toFixed(2)}</span>
                                </div>

                                <div className="pt-4 border-t border-white/5 space-y-1">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total to Pay Now</span>
                                    <div className="flex justify-between items-end">
                                        <span className="text-3xl font-black text-blue-400 leading-none">₹{advanceFee.toFixed(2)}</span>
                                        <span className="text-[10px] text-slate-400 font-bold">INR</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-slate-300 leading-relaxed">
                                💡 <strong>20% advance booking fee.</strong> The remaining amount (₹{remainingFee.toFixed(2)}) is payable in cash or card at the clinic/hospital during your check-in.
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={paymentLoading}
                                className="w-full py-4.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
