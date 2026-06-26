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
    const [patientDetailsExpanded, setPatientDetailsExpanded] = useState(true);

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
        <div className="min-h-screen bg-[#F8FAFC] pb-24 relative overflow-hidden">
            <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
            <style dangerouslySetInnerHTML={{ __html: `
                .bg-surface-container-lowest { background-color: #ffffff; }
                .bg-surface-container-low { background-color: #eff4ff; }
                .bg-surface-container { background-color: #e6eeff; }
                .bg-primary-container { background-color: #1e40af; }
                .border-outline-variant { border-color: #c4c5d5; }
                .text-outline { color: #757684; }
                .text-on-surface-variant { color: #444653; }
                .text-primary { color: #00288e; }
                .text-secondary { color: #0058be; }
                .text-on-surface { color: #121c2a; }
                .text-on-primary-container { color: #a8b8ff; }
                .text-on-primary { color: #ffffff; }
                .text-error { color: #ba1a1a; }
                .bg-tertiary-container { background-color: #00563a; }
                .hover\\:bg-on-primary-fixed-variant:hover { background-color: #173bab; }
                .hover\\:bg-surface-container-low:hover { background-color: #eff4ff; }

                /* Spacing & Layout */
                .px-margin-desktop { padding-left: 32px; padding-right: 32px; }
                .gap-gap-section { gap: 24px; }
                .p-padding-card { padding: 16px; }
                .pb-padding-card { padding-bottom: 16px; }
                .px-padding-card { padding-left: 16px; padding-right: 16px; }
                .gap-gutter { gap: 16px; }
                .mb-stack-md { margin-bottom: 8px; }
                .gap-stack-md { gap: 8px; }

                /* Typography */
                .font-headline-md { font-family: 'Manrope', sans-serif; }
                .text-headline-md { font-size: 18px; line-height: 1.6; letter-spacing: -0.01em; font-weight: 600; }
                .font-label-md { font-family: 'Inter', sans-serif; }
                .text-label-md { font-size: 12px; line-height: 1.6; letter-spacing: 0.02em; font-weight: 500; }
                .font-value-main { font-family: 'Inter', sans-serif; }
                .text-value-main { font-size: 16px; line-height: 1.6; font-weight: 400; }
                .font-button-text { font-family: 'Inter', sans-serif; }
                .text-button-text { font-size: 14px; line-height: 1.2; font-weight: 700; }
                .font-caption-sm { font-family: 'Inter', sans-serif; }
                .text-caption-sm { font-size: 12px; line-height: 1.6; font-weight: 400; }
            `}} />

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

                <main className="max-w-[1280px] mx-auto py-2">
                    {/* Main Layout Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-gap-section items-start">
                        {/* LEFT COLUMN (70%) */}
                        <div className="flex flex-col gap-gap-section">
                            {/* Appointment Details Card */}
                            <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-padding-card">
                                <h2 className="font-headline-md text-headline-md text-primary mb-6">Appointment Details</h2>
                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    {/* Doctor Profile Info */}
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-xl font-bold">
                                            {(appointment.doctorName || "Dr").substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-headline-md text-headline-md text-primary-container">Dr. {appointment.doctorName || "Consultant"}</h3>
                                            <p className="font-label-md text-label-md text-outline">{appointment.specialty || "Specialist Physician"}</p>
                                        </div>
                                    </div>
                                    {/* Divider for Mobile */}
                                    <div className="h-px w-full bg-outline-variant md:hidden"></div>
                                    {/* Location & Time Info */}
                                    <div className="flex flex-col gap-stack-md flex-1">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-primary shrink-0" />
                                            <div>
                                                <p className="font-label-md text-label-md text-outline uppercase">Clinic</p>
                                                <p className="font-value-main text-on-surface">{appointment.hospitalName || "Pillora Hospital"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-primary shrink-0" />
                                            <div>
                                                <p className="font-label-md text-label-md text-outline uppercase">Schedule</p>
                                                <p className="font-value-main text-on-surface">
                                                    {appointment.appointmentDate && appointment.appointmentTime ? (
                                                        `${appointment.appointmentDate} at ${appointment.appointmentTime}`
                                                    ) : (
                                                        appointment.slotTime ? `${new Date(appointment.slotTime).toLocaleDateString([], { month: 'short', day: '2-digit' })}, ${new Date(appointment.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}` : ""
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Patient Details (Expandable) */}
                            <section className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
                                <button className="w-full flex justify-between items-center p-padding-card hover:bg-surface-container-low transition-colors text-left" onClick={() => setPatientDetailsExpanded(!patientDetailsExpanded)}>
                                    <div className="flex items-center gap-3">
                                        <UserIcon className="w-5 h-5 text-primary" />
                                        <h2 className="font-headline-md text-headline-md text-primary">Patient Details</h2>
                                    </div>
                                    <span className={`material-symbols-outlined transition-transform duration-300 ${patientDetailsExpanded ? 'rotate-180' : 'rotate-0'}`} id="expand-icon">expand_more</span>
                                </button>
                                <div className={`px-padding-card pb-padding-card transition-all duration-300 overflow-hidden ${patientDetailsExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`} id="patient-content">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter pt-4 border-t border-outline-variant">
                                        <div>
                                            <label className="font-label-md text-label-md text-outline block mb-stack-md">PATIENT NAME</label>
                                            <input readOnly className="w-full border border-outline-variant rounded p-2 text-on-surface bg-slate-50 outline-none" type="text" value={appointment.patientName || ""} />
                                        </div>
                                        <div>
                                            <label className="font-label-md text-label-md text-outline block mb-stack-md">AGE</label>
                                            <input readOnly className="w-full border border-outline-variant rounded p-2 text-on-surface bg-slate-50 outline-none" type="text" value={appointment.patientAge ? `${appointment.patientAge} Years Old` : ""} />
                                        </div>
                                        <div>
                                            <label className="font-label-md text-label-md text-outline block mb-stack-md">CONTACT EMAIL</label>
                                            <input readOnly className="w-full border border-outline-variant rounded p-2 text-on-surface bg-slate-50 outline-none" type="email" value={appointment.patientEmail || appointment.email || ""} />
                                        </div>
                                        <div>
                                            <label className="font-label-md text-label-md text-outline block mb-stack-md">PHONE NUMBER</label>
                                            <input readOnly className="w-full border border-outline-variant rounded p-2 text-on-surface bg-slate-50 outline-none" type="tel" value={appointment.patientPhone || ""} />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* RIGHT COLUMN (30%) */}
                        <div className="flex flex-col gap-gap-section">
                            {/* Payment Summary Card */}
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-padding-card shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />
                                    <span className="font-label-md text-label-md text-secondary tracking-widest font-bold">GUARANTEED SECURE CHECKOUT</span>
                                </div>
                                <div className="flex flex-col gap-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="font-value-main text-on-surface">Consultation Fee</span>
                                        <span className="font-value-main text-on-surface">₹{consultationFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-value-main text-on-surface">Advance Booking Fee (20%)</span>
                                        <span className="font-value-main text-secondary font-bold">₹{advanceFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-label-md text-label-md text-outline">Payable at Clinic</span>
                                        <span className="font-label-md text-label-md text-outline">₹{remainingFee.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="border-t border-outline-variant pt-6 mb-6">
                                    <div className="flex justify-between items-end">
                                        <span className="font-label-md text-label-md text-on-surface-variant">TOTAL TO PAY NOW</span>
                                        <span className="text-[24px] font-bold text-primary-container leading-none">₹{advanceFee.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-lg p-3 flex gap-3 mb-6">
                                    <AlertCircle className="w-5 h-5 text-[#D97706] shrink-0" />
                                    <p className="text-[12px] text-[#92400E] leading-snug">₹{remainingFee.toFixed(2)} will be collected at clinic during your visit.</p>
                                </div>
                            </div>

                            {/* Cancellation & Refund Policy */}
                            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-padding-card">
                                <div className="flex items-center gap-2 mb-4">
                                    <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                                    <h3 className="font-label-md text-label-md text-primary font-bold uppercase">Cancellation &amp; Refund Policy</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="font-label-md text-label-md text-outline uppercase text-[10px]">Patient Side</p>
                                        <p className="text-error font-bold text-[14px]">Non-refundable</p>
                                        <p className="text-[11px] text-on-surface-variant leading-tight">If cancelled by the user after booking.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-label-md text-label-md text-outline uppercase text-[10px]">Hospital Side</p>
                                        <p className="text-tertiary-container font-bold text-[14px]">100% Refund</p>
                                        <p className="text-[11px] text-on-surface-variant leading-tight">If appointment is cancelled by clinic.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Action Button */}
                            <div className="flex justify-start pt-2">
                                <button
                                    onClick={handlePayment}
                                    disabled={paymentLoading}
                                    className="w-[180px] py-3.5 px-4 bg-blue-650 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-none shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between gap-2"
                                >
                                    {paymentLoading ? (
                                        <div className="flex items-center gap-2 mx-auto">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>PROCESSING...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span>PROCEED TO PAYMENT</span>
                                            <span className="text-[8px] font-black bg-white/20 px-1.5 py-0.5 rounded border border-white/10 shrink-0">SECURED</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
