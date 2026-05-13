"use client";
import React, { useState } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Hospital,
    Heart,
    ChevronRight,
    CheckCircle2,
    ShieldCheck,
    Search,
    Stethoscope,
    Database,
    Zap,
    Mail,
    ArrowRight,
    Lock,
    Shield,
    Globe,
    X,
    Building2,
    UserCircle,
    Activity,
    Plus,
    Handshake,
    Layout
} from 'lucide-react';

type FormType = 'hospital' | 'ngo' | null;

export default function PartnersPage() {
    const [activeForm, setActiveForm] = useState<FormType>(null);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const hospitalList = [
        "Doctor profiles — names, specializations, qualifications, and experience",
        "Doctor availability schedules — date and time slots for consultations",
        "Transparent pricing — consultation fees, surgery charges, and treatment costs",
        "Government scheme coverage — Ayushman Bharat and state schemes",
        "Facilities & departments — ICU, OT, emergency services, and specialized units"
    ];

    const hospitalBenefits = [
        { title: "Visibility", description: "Appear in patient searches filtered by specialty, city, and area." },
        { title: "Trust", description: "A verified listing signals credibility to patients and families." },
        { title: "Control", description: "Your profile, your data — updated whenever your information changes." },
        { title: "Reach", description: "Connect with patients actively searching for your facility's services." }
    ];

    const ngoSteps = [
        "Share your existing voluntary donor database with Pillora",
        "Consent-based opt-in invitation sent via SMS to each donor",
        "Confirmed donors added to Blood Connect with full details",
        "Automatic matching and connection whenever a KYC-verified recipient needs blood"
    ];

    const ngoBenefits = [
        { title: "Greater Impact", description: "Turn a static list into an active, life-saving network." },
        { title: "Zero Manual Effort", description: "Matching and communication are handled by the platform." },
        { title: "Privacy & Safety", description: "Details shared only after Aadhaar-based KYC verification." },
        { title: "Compliance", description: "Strict adherence to non-commercial, voluntary donation principles." }
    ];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        
        try {
            const formData = new FormData(e.currentTarget);
            const data: any = Object.fromEntries(formData.entries());
            
            // Handle checkboxes for specializations
            const specializations = formData.getAll('specializations');
            if (specializations.length > 0) data.specializations = specializations;
            
            // Handle checkboxes for facilities
            const facilities = formData.getAll('facilities');
            if (facilities.length > 0) data.facilities = facilities;
            
            // Handle checkboxes for governmentSchemes
            const governmentSchemes = formData.getAll('governmentSchemes');
            if (governmentSchemes.length > 0) data.governmentSchemes = governmentSchemes;
            
            // Handle checkboxes for bloodGroups
            const bloodGroups = formData.getAll('bloodGroups');
            if (bloodGroups.length > 0) data.bloodGroups = bloodGroups;
            
            data.type = activeForm;
            if (selectedPlan) {
                data.interestedPlan = selectedPlan;
            }

            const response = await api.post('/partners/submit', data);
            
            if (response.data.success) {
                setFormSubmitted(true);
                setTimeout(() => {
                    setActiveForm(null);
                    setFormSubmitted(false);
                }, 5000);
            }
        } catch (err: any) {
            console.error('Submission error:', err);
            setError(err.response?.data?.message || "Failed to submit application. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const openForm = (type: FormType, plan: string | null = null) => {
        setActiveForm(type);
        setSelectedPlan(plan);
        setFormSubmitted(false);
        setError("");
    };

    return (
        <main className="min-h-screen bg-white font-sans">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-slate-50">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] -z-10 -mt-48" />
                
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.span
                        {...fadeIn}
                        className="inline-block px-4 py-1.5 mb-8 text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 border border-blue-600/20 rounded-full bg-blue-50/50 backdrop-blur-sm"
                    >
                        Partner with Pillora
                    </motion.span>
                    <motion.h1
                        {...fadeIn}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]"
                    >
                        Join India&apos;s Growing <br />
                        <span className="text-blue-600 italic">HealthTech Ecosystem</span>
                    </motion.h1>
                    <motion.p
                        {...fadeIn}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto italic"
                    >
                        At Pillora, we are on a mission to make healthcare accessible, transparent, and immediate. We don&apos;t work alone — we build through collaboration.
                    </motion.p>
                </div>
            </section>

            {/* For Hospitals & Clinics */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-200">
                                <Hospital className="w-8 h-8" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                                For Hospitals & Clinics
                            </h2>
                            <h3 className="text-2xl font-bold text-blue-600 mb-8 italic">
                                Be the First Choice When Patients Search
                            </h3>
                            <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                                When a patient or their family is looking for the right hospital, Pillora is where they come. Make sure your facility is visible, accurate, and trustworthy on our platform.
                            </p>

                            <div className="space-y-4 mb-12">
                                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">What we list for your hospital:</h4>
                                {hospitalList.map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="mt-1.5 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                                        </div>
                                        <p className="text-slate-600 font-medium">{item}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => openForm('hospital')}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-xs"
                            >
                                Become a Partner Now <ChevronRight className="w-4 h-4" />
                            </button>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {hospitalBenefits.map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-blue-100 transition-all duration-500"
                                >
                                    <h4 className="text-xl font-black text-slate-900 mb-3">{benefit.title}</h4>
                                    <p className="text-slate-500 font-medium leading-relaxed text-sm italic">{benefit.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Hospital Pricing Section */}
            <section className="py-24 px-6 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-1.5 mb-6 text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 border border-blue-600/20 rounded-full bg-blue-50/50"
                        >
                            Hospital & Clinic Pricing
                        </motion.span>
                        <motion.h2 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
                        >
                            Choose Your Partner Plan
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-500 font-medium text-lg max-w-2xl mx-auto italic"
                        >
                            Transparent pricing designed to fit clinics, mid-sized hospitals, and corporate chains.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Standard Listing */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-50 rounded-[32px] p-8 border border-slate-200 hover:border-blue-200 hover:shadow-2xl hover:bg-white transition-all duration-500 relative flex flex-col"
                        >
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Standard Listing</h3>
                            <p className="text-sm font-medium text-slate-500 mb-6 italic min-h-[40px]">For Small Clinics, Small Doctors</p>
                            <div className="mb-8">
                                <span className="text-4xl font-black text-slate-900">₹2,000</span>
                                <span className="text-slate-500 font-medium"> / month</span>
                            </div>
                            <div className="space-y-4 flex-grow mb-8">
                                {[
                                    "Verified badge on listing",
                                    "Doctor names + specialization"
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <span className="text-slate-600 font-medium text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => openForm('hospital', 'Standard Listing')}
                                className="w-full py-4 bg-white border-2 border-slate-200 text-slate-900 font-black rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-colors uppercase tracking-widest text-xs mt-auto"
                            >
                                Get Started
                            </button>
                        </motion.div>

                        {/* Premium Feature */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-900 rounded-[32px] p-8 border border-slate-800 shadow-2xl shadow-blue-900/20 relative flex flex-col transform md:-translate-y-4"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 w-full text-center">
                                <span className="inline-block px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 rounded-full shadow-lg">
                                    Most Popular
                                </span>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 mt-2">Premium Feature</h3>
                            <p className="text-sm font-medium text-slate-400 mb-6 italic min-h-[40px]">For Mid-Size Hospital, Multi-specialist</p>
                            <div className="mb-8">
                                <span className="text-4xl font-black text-white">₹5,000</span>
                                <span className="text-slate-400 font-medium"> / month</span>
                            </div>
                            <div className="space-y-4 flex-grow mb-8">
                                {[
                                    "Everything in Standard",
                                    "Top of search results",
                                    "Government Schemes Tag",
                                    "Health hub article & blog mention (1/mo)"
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                        <span className="text-slate-300 font-medium text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => openForm('hospital', 'Premium Feature')}
                                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 uppercase tracking-widest text-xs mt-auto"
                            >
                                Upgrade to Premium
                            </button>
                        </motion.div>

                        {/* Enterprise Feature */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-slate-50 rounded-[32px] p-8 border border-slate-200 hover:border-blue-200 hover:shadow-2xl hover:bg-white transition-all duration-500 relative flex flex-col"
                        >
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Enterprise Feature</h3>
                            <p className="text-sm font-medium text-slate-500 mb-6 italic min-h-[40px]">For Large Hospital Chains, Corporate</p>
                            <div className="mb-8">
                                <span className="text-4xl font-black text-slate-900">₹10,000</span>
                                <span className="text-slate-500 font-medium"> / month</span>
                            </div>
                            <div className="space-y-4 flex-grow mb-8">
                                {[
                                    "Includes everything",
                                    "Homepage banner & spotlight placement",
                                    "Custom landing page on Pillora",
                                    "Co-branding on health tips & campaigns",
                                    "Priority support + fast data update"
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <span className="text-slate-600 font-medium text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => openForm('hospital', 'Enterprise Feature')}
                                className="w-full py-4 bg-white border-2 border-slate-200 text-slate-900 font-black rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-colors uppercase tracking-widest text-xs mt-auto"
                            >
                                Contact Sales
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* NGOs Section */}
            <section className="py-32 px-6 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 grid grid-cols-1 gap-6">
                            {ngoBenefits.map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500"
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center text-red-500">
                                            {i === 0 && <Zap className="w-5 h-5" />}
                                            {i === 1 && <Users className="w-5 h-5" />}
                                            {i === 2 && <ShieldCheck className="w-5 h-5" />}
                                            {i === 3 && <Globe className="w-5 h-5" />}
                                        </div>
                                        <h4 className="text-xl font-black">{benefit.title}</h4>
                                    </div>
                                    <p className="text-slate-400 font-medium leading-relaxed italic">{benefit.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 lg:order-2"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white mb-8 shadow-xl shadow-red-900/50">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                                For NGOs & Voluntary <br />
                                Blood Donor Organizations
                            </h2>
                            <h3 className="text-2xl font-bold text-red-500 mb-8 italic">
                                Expand Your Impact Through Blood Connect
                            </h3>
                            <p className="text-lg text-slate-300 mb-10 leading-relaxed font-medium">
                                If your organization has an existing database of voluntary blood donors, partnering with Pillora means your donors can save more lives — automatically, without any manual coordination on your end.
                            </p>

                            <div className="space-y-6 mb-12">
                                <h4 className="font-black text-white uppercase tracking-widest text-xs mb-2">How the partnership works:</h4>
                                {ngoSteps.map((step, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center flex-shrink-0 text-[10px] font-black">
                                            {i + 1}
                                        </div>
                                        <p className="text-slate-300 font-medium">{step}</p>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => openForm('ngo')}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-black/20 uppercase tracking-widest text-xs mb-10"
                            >
                                Become a Partner <ChevronRight className="w-4 h-4" />
                            </button>

                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 italic text-sm text-slate-400">
                                <span className="text-red-500 font-bold uppercase tracking-widest text-[10px] block mb-2">Important Note</span>
                                Pillora&apos;s opt-in process ensures every donor from your database has explicitly consented to being part of the Blood Connect network before their information is used. Donor privacy and consent are non-negotiable.
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Partner Form Modal */}
            <AnimatePresence>
                {activeForm !== null && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm pt-20 pb-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl relative overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${activeForm === 'hospital' ? 'bg-blue-600' : 'bg-red-600'}`}>
                                        {activeForm === 'hospital' ? <Building2 className="w-6 h-6" /> : <Handshake className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Partner with Pillora</h3>
                                        <p className="text-sm text-slate-500 font-medium italic">
                                            {activeForm === 'hospital' ? 'Hospital & Clinic registration' : 'NGO & Blood Donor Organization registration'}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setActiveForm(null)}
                                    className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400 hover:text-slate-900"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8 md:p-12 overflow-y-auto max-h-[80vh]">
                                {formSubmitted ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-20 text-center"
                                    >
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 mb-4">Form Submitted!</h2>
                                        <p className="text-xl text-slate-600 font-medium italic">
                                            Thank you for your interest in partnering with Pillora. Our team will contact you shortly.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-12">
                                        {error && (
                                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center text-sm font-bold border border-red-100">
                                                {error}
                                            </div>
                                        )}
                                        {activeForm === 'hospital' ? (
                                            <>
                                                {/* Facility Information */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-8">
                                                        <Building2 className="w-5 h-5 text-blue-600" />
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Facility Information</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Hospital / Clinic Name</label>
                                                            <input required name="organizationName" type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-medium" placeholder="E.g. Apollo Hospital" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Type of Facility</label>
                                                            <select required name="facilityType" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-medium cursor-pointer">
                                                                <option value="">Select Type</option>
                                                                <option>Multi-specialty Hospital</option>
                                                                <option>Single Specialty Hospital</option>
                                                                <option>Clinic</option>
                                                                <option>Diagnostic Center</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Registration Number (Govt.)</label>
                                                            <input required name="registrationNumber" type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-medium" placeholder="Registration No." />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">City</label>
                                                            <input required name="city" type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-medium" placeholder="E.g. Ahmedabad" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Area / Locality</label>
                                                            <input required name="area" type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-medium" placeholder="E.g. Satellite" />
                                                        </div>
                                                        <div className="md:col-span-2 space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Full Address</label>
                                                            <textarea required name="address" rows={3} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-medium resize-none" placeholder="Enter complete address"></textarea>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Contact Person Information */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-8">
                                                        <UserCircle className="w-5 h-5 text-blue-600" />
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Contact Person Information</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Full Name</label>
                                                            <input required name="contactPersonName" type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-medium" placeholder="Contact person name" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Designation</label>
                                                            <select required name="designation" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-medium cursor-pointer">
                                                                <option value="">Select Designation</option>
                                                                <option>Owner</option>
                                                                <option>Administrator</option>
                                                                <option>Manager</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Phone Number</label>
                                                            <input required name="phoneNumber" type="tel" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-medium" placeholder="10-digit mobile number" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Official Email Address</label>
                                                            <input required name="email" type="email" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-medium" placeholder="email@hospital.com" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Services Information */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-8">
                                                        <Activity className="w-5 h-5 text-blue-600" />
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Services Information</h4>
                                                    </div>
                                                    <div className="space-y-8">
                                                        <div className="space-y-4">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Specializations / Departments Available</label>
                                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                                {['General', 'Cardiology', 'Orthopedics', 'Gynecology', 'Neurology', 'Pediatrics', 'Oncology', 'Dermatology'].map(spec => (
                                                                    <label key={spec} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-blue-50 transition-colors group">
                                                                        <input name="specializations" value={spec} type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0" />
                                                                        <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">{spec}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Number of Doctors</label>
                                                            <input required name="doctorCount" type="number" className="w-full md:w-1/3 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-medium" placeholder="Total doctors count" />
                                                        </div>

                                                        <div className="space-y-4">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Facilities Available</label>
                                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                                                {['ICU', 'OT', 'Emergency', 'Pharmacy', 'Lab'].map(fac => (
                                                                    <label key={fac} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-blue-50 transition-colors group">
                                                                        <input name="facilities" value={fac} type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0" />
                                                                        <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">{fac}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Government Schemes Accepted</label>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                {['Ayushman Bharat', 'State Health Schemes', 'ESIC', 'CGHS'].map(scheme => (
                                                                    <label key={scheme} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-blue-50 transition-colors group">
                                                                        <input name="governmentSchemes" value={scheme} type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0" />
                                                                        <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">{scheme}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {/* NGO Organization Information */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-8">
                                                        <Handshake className="w-5 h-5 text-red-600" />
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Organization Information</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Organization / NGO Name</label>
                                                            <input required name="organizationName" type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all font-medium" placeholder="E.g. Red Cross Society" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Type of Organization</label>
                                                            <select required name="ngoType" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all font-medium cursor-pointer">
                                                                <option value="">Select Type</option>
                                                                <option>NGO</option>
                                                                <option>Voluntary Blood Donor Group</option>
                                                                <option>Community Organization</option>
                                                                <option>Other</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Registration Number (Optional)</label>
                                                            <input name="registrationNumber" type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all font-medium" placeholder="Govt. / NGO registration" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">City</label>
                                                            <input required name="city" type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all font-medium" placeholder="E.g. Ahmedabad" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Area / Locality</label>
                                                            <input required name="area" type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all font-medium" placeholder="E.g. Paldi" />
                                                        </div>
                                                        <div className="md:col-span-2 space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Full Address</label>
                                                            <textarea required name="address" rows={3} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all font-medium resize-none" placeholder="Enter complete address"></textarea>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Contact Person Information */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-8">
                                                        <UserCircle className="w-5 h-5 text-red-600" />
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Contact Person Information</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Full Name</label>
                                                            <input required name="contactPersonName" type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all font-medium" placeholder="Contact person name" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Designation</label>
                                                            <select required name="designation" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all font-medium cursor-pointer">
                                                                <option value="">Select Designation</option>
                                                                <option>Founder</option>
                                                                <option>Director</option>
                                                                <option>Coordinator</option>
                                                                <option>Manager</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Phone Number</label>
                                                            <input required name="phoneNumber" type="tel" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all font-medium" placeholder="10-digit mobile number" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Official Email Address</label>
                                                            <input required name="email" type="email" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all font-medium" placeholder="email@organization.org" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Donor Database Information */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-8">
                                                        <Database className="w-5 h-5 text-red-600" />
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Donor Database Information</h4>
                                                    </div>
                                                    <div className="space-y-8">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Approx. Number of Donors</label>
                                                                <input required name="donorCount" type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all font-medium" placeholder="Total donors count" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Is donor data digitized?</label>
                                                                <select required name="isDigitized" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all font-medium cursor-pointer">
                                                                    <option value="">Select Option</option>
                                                                    <option>Yes</option>
                                                                    <option>No</option>
                                                                    <option>Partially</option>
                                                                </select>
                                                            </div>
                                                            <div className="md:col-span-2 space-y-2">
                                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Cities / Areas covered</label>
                                                                <input required name="areasCovered" type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all font-medium" placeholder="E.g. Ahmedabad, Gandhinagar, Surat" />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Blood Groups Available</label>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                                                    <label key={group} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-red-50 transition-colors group">
                                                                        <input name="bloodGroups" value={group} type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 text-red-600 focus:ring-red-500 focus:ring-offset-0" />
                                                                        <span className="text-sm font-semibold text-slate-700 group-hover:text-red-700">{group}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* Additional Information */}
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Additional Message (Optional)</label>
                                                <textarea name="message" rows={4} className={`w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 transition-all font-medium resize-none ${activeForm === 'hospital' ? 'focus:ring-blue-600/20' : 'focus:ring-red-600/20'} focus:bg-white`} placeholder="Any additional information you&apos;d like to share..."></textarea>
                                            </div>

                                            <button 
                                                type="submit"
                                                disabled={submitting}
                                                className={`w-full py-6 text-white font-black rounded-3xl transition-all shadow-2xl uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 ${activeForm === 'hospital' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'} disabled:opacity-70`}
                                            >
                                                {submitting ? (
                                                    <>Submitting... <Zap className="w-4 h-4 animate-pulse" /></>
                                                ) : (
                                                    'Submit Application'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Comparison Table */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                            Why Partner with Pillora?
                        </h2>
                        <p className="text-slate-500 font-medium text-lg">A collaboration designed for maximum community impact.</p>
                    </div>

                    <div className="overflow-hidden rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/50">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-8 py-6 font-black text-slate-900 uppercase tracking-widest text-xs border-b border-slate-100">What You Bring</th>
                                    <th className="px-8 py-6 font-black text-blue-600 uppercase tracking-widest text-xs border-b border-slate-100">What Pillora Brings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="px-8 py-6 text-slate-700 font-semibold italic">Hospital profile & data</td>
                                    <td className="px-8 py-6 text-slate-600 font-medium">Verified listing reaching patients across your city</td>
                                </tr>
                                <tr>
                                    <td className="px-8 py-6 text-slate-700 font-semibold italic">NGO donor database</td>
                                    <td className="px-8 py-6 text-slate-600 font-medium">Automated matching, KYC verification & privacy protection</td>
                                </tr>
                                <tr>
                                    <td className="px-8 py-6 text-slate-700 font-semibold italic">Trust in your community</td>
                                    <td className="px-8 py-6 text-slate-600 font-medium">Technology that scales your impact</td>
                                </tr>
                                <tr>
                                    <td className="px-8 py-6 text-slate-700 font-semibold italic">Healthcare expertise</td>
                                    <td className="px-8 py-6 text-slate-600 font-medium">A platform built to make that expertise accessible to all</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* How to Partner CTA */}
            <section className="py-24 px-6 bg-blue-600 text-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-black mb-6 tracking-tight">How to Partner with Us</h2>
                    <p className="text-xl text-blue-100 mb-10 font-medium">Getting started is simple. Reach out to our partnerships team and we will take it from there.</p>
                    
                    <div className="inline-flex flex-col md:flex-row items-center gap-6 p-2 bg-white/10 rounded-[32px] border border-white/20 backdrop-blur-md">
                        <div className="px-8 py-4 flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-200" />
                            <span className="font-bold text-lg">partner@pillora.in</span>
                        </div>
                        <div className="px-8 py-4 bg-white text-blue-600 rounded-[28px] font-black uppercase tracking-widest text-xs flex items-center gap-2">
                           Response within 24 hours <Zap className="w-3 h-3 fill-current" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 px-6 bg-slate-50 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[100px] -mr-48 -mb-48 opacity-60" />
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter">
                        Ready to Build the <br />
                        <span className="text-blue-600 italic">Future of Health?</span>
                    </h2>
                    <p className="text-slate-600 font-medium mb-12 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                        Join our growing network of hospitals, clinics, and donor organizations. Together, we can ensure that no patient is left searching when every second counts.
                    </p>
                    
                    <a 
                        href="mailto:partner@pillora.in"
                        className="group flex flex-col items-center gap-4 no-underline"
                    >
                        <div className="px-12 py-6 bg-slate-900 text-white font-black rounded-[32px] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-300 uppercase tracking-[0.2em] text-sm flex items-center gap-3">
                            Join the Network <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <span className="text-slate-500 font-bold italic text-sm">📩 partner@pillora.in</span>
                    </a>
                </div>
            </section>
        </main>
    );
}
