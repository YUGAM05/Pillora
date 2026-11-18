"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, 
    Lock, 
    Database, 
    EyeOff, 
    FileCheck2, 
    Users, 
    Scale, 
    Mail, 
    Fingerprint, 
    CheckCircle2,
    Info,
    Smartphone,
    MapPin,
    AlertCircle
} from 'lucide-react';

export default function PrivacyPolicyPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <main className="min-h-screen bg-slate-50 py-20 px-6 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="mb-16 text-center">
                    <motion.div
                        {...fadeIn}
                        className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] text-white shadow-2xl shadow-blue-200 mb-8"
                    >
                        <Lock className="w-10 h-10" />
                    </motion.div>
                    <motion.h1
                        {...fadeIn}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-4"
                    >
                        Pillora <span className="text-blue-600 italic">Privacy Policy</span>
                    </motion.h1>
                    <motion.p
                        {...fadeIn}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]"
                    >
                        Last Updated: April 2026
                    </motion.p>
                </header>

                <div className="space-y-12 pb-24">
                    {/* Overview */}
                    <motion.section
                        {...fadeIn}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <Info className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h2>
                        </div>
                        <p className="text-xl text-slate-600 font-medium leading-relaxed italic">
                            At Pillora, we recognize the sensitivity of your personal and health information. Our privacy framework is built to ensure that your data remains confidential, secure, and under your control. We only collect data that is strictly necessary to deliver our services — Blood Connect and Hospital Information.
                        </p>
                        <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-500 font-medium">
                            This policy applies to all users of the Pillora platform including blood donors, blood recipients, and patients searching for hospital information.
                        </div>
                    </motion.section>

                    {/* 1. Data We Collect */}
                    <motion.section
                        {...fadeIn}
                        transition={{ delay: 0.4 }}
                        className="space-y-8"
                    >
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight px-4">1. Data We Collect</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <CollectionCard 
                                title="From Blood Donors"
                                icon={<Users className="w-6 h-6" />}
                                items={["Full Name", "Age & Gender", "Blood Group", "Phone Number", "City, Area, and Full Address"]}
                                color="bg-blue-600"
                            />
                            <CollectionCard 
                                title="From Blood Recipients"
                                icon={<Fingerprint className="w-6 h-6" />}
                                items={["Patient Name", "Age & Gender", "Blood Group Needed", "Phone Number", "Aadhaar Card (for KYC)"]}
                                color="bg-red-600"
                            />
                            <CollectionCard 
                                title="Technical & Search"
                                icon={<Smartphone className="w-6 h-6" />}
                                items={["City and Area", "IP Address", "Device Information", "Platform Security Data", "Fraud Prevention Logs"]}
                                color="bg-slate-900"
                            />
                        </div>
                    </motion.section>

                    {/* 2. Purpose of Processing Table */}
                    <motion.section
                        {...fadeIn}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50"
                    >
                        <div className="p-8 md:p-12 border-b border-slate-50">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">2. Purpose of Processing</h2>
                            <p className="text-slate-500 font-medium mt-2 italic">We process your data specifically for:</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-12 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Purpose</th>
                                        <th className="px-12 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <PurposeRow title="Blood Donor Matching" detail="Matching donors who agreed to be contacted with recipients whose ID has been approved, based on blood group and city" />
                                    <PurposeRow title="KYC Verification" detail="Checking the recipient's ID document (Aadhaar card, PAN card or driving licence) before donor details are shared" />
                                    <PurposeRow title="SMS Notifications" detail="Sending automated confirmation messages upon KYC approval" />
                                    <PurposeRow title="Hospital Information" detail="Helping users search and compare hospitals by specialty, pricing, doctors, and schemes" />
                                    <PurposeRow title="Platform Security" detail="Preventing fraud, misuse, and unauthorized access" />
                                </tbody>
                            </table>
                        </div>
                    </motion.section>

                    {/* 3. Aadhaar Data Handling */}
                    <motion.section
                        {...fadeIn}
                        transition={{ delay: 0.6 }}
                        className="bg-slate-900 text-white p-8 md:p-16 rounded-[3rem] relative overflow-hidden shadow-2xl shadow-blue-900/20"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-8 italic tracking-tight">3. Aadhaar Data Handling</h2>
                            <p className="text-slate-400 font-medium mb-12 text-lg leading-relaxed">
                                Pillora collects Aadhaar card information solely for the purpose of KYC verification of blood recipients. We handle this data with the highest level of care:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <AadhaarPoint title="No Full Storage" text="Aadhaar numbers are never stored in full. They are masked and saved as **** **** **XX." />
                                <AadhaarPoint title="AI-Processing" text="Images are processed via AI verification and are not shared with any third party." />
                                <AadhaarPoint title="Limited Visibility" text="Only the last 2 digits of your Aadhaar are visible in our secure admin panel." />
                                <AadhaarPoint title="Legal Compliance" text="In full compliance with Aadhaar Act 2016 and the DPDP Act 2023." />
                            </div>
                        </div>
                    </motion.section>

                    {/* 4. Donor Data & Privacy */}
                    <motion.section
                        {...fadeIn}
                        transition={{ delay: 0.65 }}
                        className="bg-red-50 p-8 md:p-12 rounded-[3rem] border border-red-100"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-200">
                                <EyeOff className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">4. Donor Data & Privacy Protection</h2>
                        </div>
                        <p className="text-slate-700 font-bold mb-8 italic leading-relaxed">
                            Donor contact details (name and phone number) are only shared with a recipient when:
                        </p>
                        <div className="space-y-4 mb-10">
                            {[
                                "The donor agreed to this when registering",
                                "Our team has checked and approved the recipient&apos;s ID document",
                                "The recipient&apos;s blood group requirement matches the donor&apos;s blood group",
                                "The request is in the donor&apos;s city (at most 5 donors are shared per request)"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-red-100">
                                    <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0" />
                                    <span className="text-slate-700 font-semibold">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-start gap-4 p-6 bg-red-600 text-white rounded-[2rem] shadow-xl shadow-red-200 font-bold italic">
                            <AlertCircle className="w-6 h-6 flex-shrink-0" />
                            <p>Under no circumstances is donor information shared with a recipient without all of these conditions being met. Donors may request removal at any time by contacting help@pillora.in</p>
                        </div>
                    </motion.section>

                    {/* 5. Sharing with Third Parties */}
                    <motion.section
                        {...fadeIn}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50"
                    >
                        <div className="p-8 md:p-12 border-b border-slate-50">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">5. Sharing with Third Parties</h2>
                            <p className="text-slate-500 font-medium mt-2 italic">We do not sell, rent, or trade your data. Sharing is strictly limited to:</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-12 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Recipient</th>
                                        <th className="px-12 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Purpose</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <PurposeRow title="Matched Blood Donors" detail="Recipient&apos;s contact details shared with matched donor to facilitate arrangement" />
                                    <PurposeRow title="Matched Blood Recipients" detail="Name and phone number of up to 5 donors who agreed to be contacted, shared only after the recipient&apos;s ID is approved" />
                                    <PurposeRow title="Government Authorities" detail="Only if required under the DPDP Act 2023 for legal or public health emergencies" />
                                </tbody>
                            </table>
                        </div>
                    </motion.section>

                    {/* 6, 7. Security & Rights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.section
                            {...fadeIn}
                            transition={{ delay: 0.75 }}
                            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight uppercase tracking-[0.2em] text-xs text-blue-600">6. Data Security</h2>
                            <p className="text-slate-600 font-semibold leading-relaxed italic">
                                All data is stored with encryption standards appropriate for sensitive health and identity information. Aadhaar numbers are masked at the storage level, and internal access is strictly logged and restricted.
                            </p>
                        </motion.section>

                        <motion.section
                            {...fadeIn}
                            transition={{ delay: 0.8 }}
                            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight uppercase tracking-[0.2em] text-xs text-blue-600">7. Your Rights</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {["Access", "Correction", "Erasure", "Withdrawal"].map(right => (
                                    <div key={right} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl font-bold text-slate-700 text-sm">
                                        <FileCheck2 className="w-4 h-4 text-blue-600" /> {right}
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </div>

                    {/* 8. Contact */}
                    <motion.section
                        {...fadeIn}
                        transition={{ delay: 0.85 }}
                        className="bg-blue-600 text-white p-8 md:p-12 rounded-[3rem] text-center shadow-2xl shadow-blue-200"
                    >
                        <h2 className="text-3xl font-black mb-6 tracking-tight uppercase">8. Contact Us</h2>
                        <div className="inline-flex flex-col md:flex-row items-center gap-6 justify-center">
                            <div className="flex items-center gap-3 font-black text-xl">
                                <Mail className="w-6 h-6 border-b-2 border-white pb-1" />
                                help@pillora.in
                            </div>
                            <div className="px-6 py-2 bg-white/10 rounded-full font-bold uppercase tracking-widest text-[10px] backdrop-blur-md">
                                Response within 24 hours
                            </div>
                        </div>
                    </motion.section>

                    <motion.div
                        {...fadeIn}
                        transition={{ delay: 0.9 }}
                        className="text-center pt-8"
                    >
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">
                            Your Health. Your Data. Our Responsibility.
                        </p>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

function CollectionCard({ title, icon, items, color }: any) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 h-full">
            <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                {icon}
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight italic">{title}</h3>
            <div className="space-y-3">
                {items.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <span className="text-sm font-semibold text-slate-500">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PurposeRow({ title, detail }: any) {
    return (
        <tr className="group hover:bg-slate-50 transition-colors">
            <td className="px-12 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="font-bold text-slate-900">{title}</span>
                </div>
            </td>
            <td className="px-12 py-6 italic font-medium text-slate-500 leading-relaxed text-sm">
                {detail}
            </td>
        </tr>
    );
}

function AadhaarPoint({ title, text }: any) {
    return (
        <div className="space-y-2 group">
            <h4 className="text-blue-500 font-black uppercase tracking-widest text-[10px] group-hover:text-white transition-colors">{title}</h4>
            <p className="text-sm text-slate-400 font-medium leading-relaxed group-hover:text-slate-200 transition-colors">{text}</p>
        </div>
    );
}
