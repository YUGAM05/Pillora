"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
    ShieldCheck, 
    Zap, 
    Cpu, 
    HeartPulse, 
    Building2, 
    Droplets, 
    Sparkles, 
    Hospital, 
    ShieldAlert, 
    Users, 
    Target, 
    Lock, 
    Eye,
    Shield,
    Calendar,
    BookOpen
} from "lucide-react";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white selection:bg-rose-100 selection:text-rose-900">
            {/* 1. Hero Section */}
            <section className="relative py-20 md:py-28 px-6 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-50 via-white to-transparent">
                {/* Dynamic Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                            x: [0, 50, 0],
                            y: [0, 30, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-rose-400/10 rounded-full blur-[140px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, -45, 0],
                            x: [0, -40, 0],
                            y: [0, 60, 0]
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[140px]"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={fadeIn}
                        className="text-center max-w-5xl mx-auto"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-xs font-black tracking-[0.2em] text-rose-700 uppercase bg-rose-600/10 border border-rose-600/20 rounded-full backdrop-blur-md"
                        >
                            <Sparkles className="w-4 h-4" />
                            About Us
                        </motion.div>
                        <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-6 leading-tight tracking-tighter">
                            Healthcare Coordination <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-red-600 to-rose-700">Built for the Moments that Cannot Wait</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-8 max-w-4xl mx-auto font-medium">
                            Pillora is an emerging healthcare coordination platform built for the moments that cannot wait. We connect patients with verified blood donors, deliver transparent hospital pricing, show which government schemes are accepted, and facilitate seamless appointment booking—all from a single platform.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. Who We Are & Mission */}
            <section className="py-24 px-4 relative bg-slate-50 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-full lg:w-1/2 relative"
                        >
                            <div className="relative aspect-square max-w-[500px] mx-auto group">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-rose-500 to-rose-700 rounded-[3rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
                                <div className="relative h-full w-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl">
                                    <Image
                                        src="/Yugam-shah-founder.jpeg"
                                        alt="Yugam Shah - Founder of Pillora"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                        <p className="text-white font-black text-2xl">Yugam Shah</p>
                                        <p className="text-rose-400 font-bold uppercase tracking-widest text-sm">Founder & CEO</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="w-full lg:w-1/2 space-y-10">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 mb-6 flex items-center gap-4">
                                    <Users className="w-10 h-10 text-rose-600" />
                                    Who We Are
                                </h2>
                                <p className="text-lg text-slate-600 leading-relaxed font-medium mb-4">
                                    Pillora is an emerging healthcare coordination platform built for the moments that cannot wait. We connect patients with verified blood donors, deliver transparent hospital pricing, show which government schemes are accepted at each hospital, and facilitate seamless appointment booking—all from a single platform.
                                </p>
                                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                    Founded in 2024 and based in Ahmedabad, Gujarat, Pillora was born from a frustrating but universal truth: when someone needs blood urgently or wants to understand what a hospital procedure will cost, the healthcare system offers no reliable, fast, or transparent answer. We are fixing that by bridging the gap between people in need and the resources available around them.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 blur-xl" />
                                <h3 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-4">
                                    <Target className="w-8 h-8 text-rose-600" />
                                    Our Mission
                                </h3>
                                <p className="text-lg text-slate-600 leading-relaxed font-semibold border-l-4 border-rose-600 pl-6">
                                    To make healthcare access fast, transparent, and dignified—starting with the two most urgent gaps: emergency blood coordination and hospital information clarity.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. What We Do */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black text-slate-900 mb-4">What We Do</h2>
                        <div className="h-2 w-24 bg-rose-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Blood Connect Card */}
                        <div className="p-8 md:p-12 rounded-[2.5rem] bg-rose-50/50 border border-rose-100/80 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-rose-600/10 flex items-center justify-center mb-6 text-rose-600">
                                    <Droplets className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-4">Blood Connect</h3>
                                <p className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">
                                    Our flagship feature helps streamline the search for blood during emergencies. A patient enters their required blood group and location, and Pillora immediately notifies verified donors in the area to help speed up the search.
                                </p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm border border-rose-200 p-6 rounded-2xl shadow-sm mt-4">
                                <div className="flex gap-3">
                                    <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-rose-900 mb-1 text-sm uppercase tracking-wider">Important Notice</h4>
                                        <p className="text-xs text-rose-800 leading-relaxed font-medium">
                                            Pillora is a coordination platform, not a blood bank. While we provide an easier, faster, and more direct way to reach potential donors, <strong>we do not guarantee that blood will be successfully obtained or available through this service.</strong> We provide the technology to connect you with willing donors, but fulfillment depends entirely on donor availability and response at that specific moment.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hospital Information Card */}
                        <div className="p-8 md:p-12 rounded-[2.5rem] bg-blue-50/50 border border-blue-100/80 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-6 text-blue-600">
                                    <Hospital className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-4">Hospital Information</h3>
                                <p className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">
                                    We aggregate and publish real hospital charges, department availability, bed types, and facility ratings. Patients can compare hospitals before choosing, not after receiving a bill they cannot afford.
                                </p>
                            </div>
                            <div className="h-full flex items-end mt-6">
                                <div className="w-full grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-blue-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pricing</p>
                                        <p className="text-sm font-bold text-slate-800">Real Hospital Charges</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-blue-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                                        <p className="text-sm font-bold text-slate-800">Bed & Dept Availability</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Government Scheme Acceptance */}
                        <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200/80 shadow-sm">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center mb-6 text-emerald-600">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">Government Schemes</h3>
                            <p className="text-slate-600 leading-relaxed font-medium text-sm">
                                We show which government schemes—such as Ayushman Bharat PM-JAY and state health schemes—each hospital has confirmed they accept. If you are already enrolled in a scheme, Pillora helps you find empanelled hospitals quickly, without calling around. We do not check your personal eligibility—that is between you and the scheme authority.
                            </p>
                        </div>

                        {/* Appointment Booking */}
                        <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200/80 shadow-sm">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-6 text-indigo-600">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">Appointment Booking</h3>
                            <p className="text-slate-600 leading-relaxed font-medium text-sm">
                                Patients can book appointments with verified doctors across partner hospitals directly through Pillora. We verify doctor credentials, show real-time slot availability, and send reminders—reducing no-shows and saving time for both patients and hospitals.
                            </p>
                        </div>

                        {/* Health Hub */}
                        <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200/80 shadow-sm">
                            <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center mb-6 text-purple-600">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">Health Hub</h3>
                            <p className="text-slate-600 leading-relaxed font-medium text-sm">
                                Daily health tips, medical news, and accessible wellness content curated by our in-house health editorial team.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Why Pillora? */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black text-slate-900 mb-4">Why Pillora?</h2>
                        <div className="h-2 w-24 bg-rose-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "A Faster Search",
                                desc: "Average donor notification broadcast goes out within 2 minutes.",
                                icon: Zap,
                                colorClass: "text-amber-500 bg-amber-50 border-amber-100"
                            },
                            {
                                title: "An Easier Path",
                                desc: "A streamlined, direct alternative to traditional, stressful blood hunting.",
                                icon: HeartPulse,
                                colorClass: "text-rose-500 bg-rose-50 border-rose-100"
                            },
                            {
                                title: "Verified Networks",
                                desc: "Only verified doctors and donor profiles—no unverified public listings.",
                                icon: ShieldCheck,
                                colorClass: "text-emerald-500 bg-emerald-50 border-emerald-100"
                            },
                            {
                                title: "Transparent Pricing",
                                desc: "Clear hospital charges to help prevent hidden costs.",
                                icon: Cpu,
                                colorClass: "text-blue-500 bg-blue-50 border-blue-100"
                            },
                            {
                                title: "Government Schemes",
                                desc: "Real-time visibility into scheme acceptance per hospital.",
                                icon: Building2,
                                colorClass: "text-indigo-500 bg-indigo-50 border-indigo-100"
                            },
                            {
                                title: "Local Focus",
                                desc: "Deeply integrated into the Ahmedabad healthcare ecosystem for reliable local support.",
                                icon: Target,
                                colorClass: "text-rose-600 bg-rose-100/50 border-rose-200"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm flex flex-col items-start"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${item.colorClass}`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Our Values */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black text-slate-900 mb-4">Our Values</h2>
                        <div className="h-2 w-24 bg-rose-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Speed Over Bureaucracy */}
                        <div className="p-8 rounded-[2rem] border border-slate-200 bg-slate-50/50 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-xl" />
                            <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                                <Zap className="w-6 h-6 text-amber-500" />
                                Speed Over Bureaucracy
                            </h3>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Healthcare emergencies do not wait. Neither do we. Every product decision is tested against one question: does this make the coordination experience faster and easier for the person in need?
                            </p>
                        </div>

                        {/* Managing Expectations with Transparency */}
                        <div className="p-8 rounded-[2rem] border border-slate-200 bg-slate-50/50 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-xl" />
                            <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                                <ShieldAlert className="w-6 h-6 text-blue-500" />
                                Managing Expectations with Transparency
                            </h3>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                We believe in radical honesty. We publish what hospitals charge and which schemes they accept. Similarly, we are transparent about our platform&apos;s limits: we guarantee a faster, easier way to reach out for help, but we never promise guaranteed medical outcomes or blood fulfillment.
                            </p>
                        </div>

                        {/* Privacy by Default */}
                        <div className="p-8 rounded-[2rem] border border-slate-200 bg-slate-50/50 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-xl" />
                            <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                                <Lock className="w-6 h-6 text-emerald-500" />
                                Privacy by Default
                            </h3>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Patient data is sacred. We collect only what is necessary, encrypt everything in transit and at rest, and never sell user data. Full stop.
                            </p>
                        </div>

                        {/* Accessibility for All */}
                        <div className="p-8 rounded-[2rem] border border-slate-200 bg-slate-50/50 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 blur-xl" />
                            <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                                <Users className="w-6 h-6 text-rose-500" />
                                Accessibility for All
                            </h3>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Pillora is built to serve the community. While we are currently focused on perfecting our services within Ahmedabad, we build with every citizen in mind—actively working toward regional language support and low-bandwidth optimization.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. The Team */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-black text-slate-900 mb-6">The Team</h2>
                    <div className="h-2 w-24 bg-rose-600 mx-auto rounded-full mb-8" />
                    <p className="text-xl text-slate-600 leading-relaxed font-medium">
                        Pillora is built by a lean, mission-driven team of engineers, designers, and healthcare advocates based in Ahmedabad. We have deep roots in Gujarat&apos;s healthcare ecosystem. We believe the best healthcare technology comes from people who have personally experienced the gaps they are solving.
                    </p>
                </div>
            </section>

            {/* 7. Our Journey & Backed By */}
            <section className="py-24 px-6 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black text-slate-900 mb-4">Our Journey</h2>
                        <div className="h-2 w-24 bg-rose-600 mx-auto rounded-full" />
                    </div>

                    {/* Timeline */}
                    <div className="relative max-w-3xl mx-auto before:absolute before:inset-y-0 before:left-1/2 before:w-0.5 before:bg-slate-200">
                        {[
                            { year: "2024", text: "Pillora founded; Blood Connect MVP launched in Ahmedabad, Gujarat." },
                            { year: "2025", text: "Local hospital information database goes live; Government scheme acceptance mapping added." },
                            { year: "2026", text: "Appointment booking feature launched; optimizing core services across Ahmedabad." }
                        ].map((item, index) => (
                            <div key={index} className={`relative flex items-center justify-between mb-8 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                                <div className="w-[45%]" />
                                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-rose-600 border-4 border-white flex items-center justify-center text-white z-10 shadow-md">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                                <div className="w-[45%] bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm">
                                    <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-black rounded-full mb-2">{item.year}</span>
                                    <p className="text-slate-600 font-semibold text-sm leading-relaxed">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Backed By Callout */}
                    <div className="mt-20 max-w-4xl mx-auto bg-gradient-to-r from-slate-900 to-slate-950 rounded-[3rem] p-8 md:p-12 text-white text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black mb-4">Backed By</h3>
                            <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                                Pillora is currently bootstrapped and building toward its first institutional funding round. We are driven by mission first, metrics second.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}