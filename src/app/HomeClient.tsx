"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ShieldCheck, Upload, FileHeart, MapPin, Activity, UserCheck, CreditCard, Landmark, Stethoscope, Briefcase, User, Heart, Bell } from "lucide-react";
import HealthHubSection from "@/components/HealthHubSection";
import { UNVERIFIED_CLAIMS } from "@/content/claims";
import { getUser, getToken } from "@/lib/tokenStorage";
import { useRouter } from "next/navigation";

interface FeatureItemProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
}

export default function Home({ children }: { children?: React.ReactNode }) {
    const router = useRouter();

    // Removed automatic redirect to dashboard for logged-in users
    // This allows users to view the home page even when authenticated.


    return (
        <main className="bg-gradient-to-b from-blue-50/30 to-white min-h-screen pb-20">
            {/* Page heading for search engines & screen readers (the visual hero rotates) */}
            <h1 className="sr-only">Pillora — find blood donors, hospitals, doctors and government health schemes in India</h1>

            {/* 1. Rotating Banner Component (Hero) */}
            <div className="pt-6">
                <RotatingBanner />
            </div>

            {/* 2. Trust Strip */}
            <section className="max-w-7xl mx-auto px-6 py-12 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    <FeatureItem icon={<MapPin className="w-6 h-6 text-blue-500" />} title="Smart Area Matching" desc="Donor found near you instantly" />
                    <FeatureItem icon={<Activity className="w-6 h-6 text-red-500" />} title="24/7 Emergency Blood" desc="Round-the-clock donor network" />
                    <FeatureItem icon={<CreditCard className="w-6 h-6 text-emerald-500" />} title="Transparent Pricing" desc="No hidden charges, ever" />
                    <FeatureItem icon={<Landmark className="w-6 h-6 text-orange-500" />} title="Govt. Scheme Eligible" desc="Ayushman Bharat & more covered" />
                </div>
            </section>

            {/* Server-rendered section passed from page.tsx (crawlable links and copy) */}
            {children}

            {/* 3. Health Hub (also covers the daily tips, so they are not repeated) */}
            <HealthHubSection />
        </main>
    );
}

// Components

function FeatureItem({ icon, title, desc }: FeatureItemProps) {
    return (
        <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
                <p className="text-xs text-gray-500">{desc}</p>
            </div>
        </div>
    )
}

const slides = [
    {
        id: "blood-1",
        tag: "Blood Connect",
        title: "Need blood urgently?",
        subtext: "Enter your blood group and area — we match you with a verified donor nearby in minutes.",
        buttonText: "Request blood now",
        buttonLink: "/blood-bank?tab=request",
        icon: <Bell className="w-8 h-8 md:w-16 md:h-16 text-white" strokeWidth={1.5} />,
        sideText: UNVERIFIED_CLAIMS.notificationTime.value,
        sideSubText: UNVERIFIED_CLAIMS.notificationTime.label,
        bgColor: "bg-blue-600", // Classic Pillora Blue
        circleBg: "bg-white/20"
    },
    {
        id: "hospital-1",
        tag: "Hospital",
        title: "Are you eligible for free treatment?",
        subtext: "Check which government schemes cover your treatment — Ayushman Bharat, PMJAY & more.",
        buttonText: "Check eligibility",
        buttonLink: "/hospitals",
        icon: <Briefcase className="w-8 h-8 md:w-16 md:h-16 text-white" strokeWidth={1.5} />,
        sideText: UNVERIFIED_CLAIMS.schemesListed.value,
        sideSubText: UNVERIFIED_CLAIMS.schemesListed.label,
        bgColor: "bg-sky-700", // Vibrant Sky Blue
        circleBg: "bg-white/20"
    },
    {
        id: "hospital-2",
        tag: "Hospital",
        title: "Know your doctor before you visit",
        subtext: "Browse doctor profiles, specializations, visiting hours and consultation charges — all in one place.",
        buttonText: "Find a doctor",
        buttonLink: "/hospitals",
        icon: <User className="w-8 h-8 md:w-16 md:h-16 text-white" strokeWidth={1.5} />,
        sideText: UNVERIFIED_CLAIMS.specialistDoctors.value,
        sideSubText: UNVERIFIED_CLAIMS.specialistDoctors.label,
        bgColor: "bg-blue-900", // Premium Deep Blue
        circleBg: "bg-white/20"
    },
    {
        id: "blood-2",
        tag: "Blood Connect",
        title: "Be someone's reason to live",
        subtext: "Register as a verified donor on Pillora. Your one donation can save up to 3 lives.",
        buttonText: "Become a donor",
        buttonLink: "/blood-bank",
        icon: <Heart className="w-8 h-8 md:w-16 md:h-16 text-white" strokeWidth={1.5} />,
        sideText: UNVERIFIED_CLAIMS.donorsRegistered.value,
        sideSubText: UNVERIFIED_CLAIMS.donorsRegistered.label,
        bgColor: "bg-indigo-600", // Rich Indigo Blue
        circleBg: "bg-white/20"
    }
];

function RotatingBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Rotate every 5 seconds
        return () => clearInterval(timer);
    }, []);

    const s = slides[currentSlide];

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 xl:px-8">
            <div className={`rounded-[2rem] md:rounded-[3rem] px-5 py-8 md:p-16 pb-12 overflow-hidden flex flex-col md:flex-row items-center justify-between relative transition-colors duration-700 shadow-xl md:shadow-2xl ${s.bgColor}`}>
                {/* Content */}
                <div className="relative z-10 max-w-2xl w-full flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 mb-3 md:mb-6 text-xs md:text-sm font-bold text-white bg-white/20 rounded-full backdrop-blur-sm">
                        {s.tag}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 md:mb-6 leading-tight">
                        {s.title}
                    </h2>
                    <p className="text-white/90 text-[13px] sm:text-sm md:text-xl mb-6 md:mb-10 font-medium max-w-xl leading-relaxed">
                        {s.subtext}
                    </p>
                    <Link href={s.buttonLink} className="bg-white text-gray-900 px-6 py-2.5 md:px-8 md:py-3.5 rounded-xl font-bold text-sm md:text-base hover:bg-gray-50 transition-colors inline-block shadow-sm">
                        {s.buttonText}
                    </Link>
                </div>

                {/* Right Visual Side */}
                <div className="relative z-10 mt-6 md:mt-0 flex flex-col items-center justify-center shrink-0 md:mr-10">
                    <div className={`w-20 h-20 md:w-48 md:h-48 rounded-full ${s.circleBg} flex items-center justify-center mb-2 md:mb-6 transition-colors duration-700`}>
                        {s.icon}
                    </div>
                    <div className="text-center mb-2 md:mb-0">
                        <div className="text-xl md:text-4xl font-bold text-white mb-0.5 md:mb-1 tracking-tight">{s.sideText}</div>
                        <div className="text-white/80 text-[11px] md:text-base font-medium">{s.sideSubText}</div>
                    </div>
                </div>

                {/* Dots Navigation */}
                <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2.5 z-20">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className="p-2 -m-1 flex items-center justify-center"
                            aria-label={`Go to slide ${idx + 1}`}
                            aria-current={idx === currentSlide}
                        >
                            <span className={`block h-1.5 md:h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-5 md:w-8 bg-white' : 'w-1.5 md:w-2.5 bg-white/40 hover:bg-white/60'}`} />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
