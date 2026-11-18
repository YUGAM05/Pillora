"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    Minus,
    Droplets,
    HeartPulse,
    Hospital,
    Handshake,
    Mail,
    Zap,
    HelpCircle,
    ArrowRight,
    SearchCheck,
    Stethoscope
} from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    title: string;
    icon: React.ReactNode;
    faqs: FAQ[];
    color: string;
}

const FAQItem = ({ faq }: { faq: FAQ }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-start justify-between gap-4 text-left group"
            >
                <span className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                    {faq.question}
                </span>
                <div className={`mt-1 p-1 rounded-lg transition-colors ${isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pb-8 text-slate-600 font-medium leading-relaxed italic">
                            {faq.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQSection = ({ title, icon, faqs, color }: FAQSectionProps) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 last:mb-0"
    >
        <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}>
                {icon}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">
                {title}
            </h2>
        </div>
        <div className="bg-white rounded-[32px] p-6 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-50">
            {faqs.map((faq, index) => (
                <FAQItem key={index} faq={faq} />
            ))}
        </div>
    </motion.div>
);

export default function HelpCenterPage() {
    const bloodDonorFAQs: FAQ[] = [
        {
            question: "How do I register as a blood donor?",
            answer: "Visit the Blood Connect section and fill in your Full Name, Blood Group, Age, Gender, Phone Number, City, Area, and Full Address. Once submitted, your profile is added to our donor network."
        },
        {
            question: "When will my contact details be shared?",
            answer: "Only if you agreed when registering. Your name and phone number may be shared with someone who requests your blood group in your city, after our team has checked their ID document. We share up to 5 donors per request."
        },
        {
            question: "Can I remove myself from the donor network?",
            answer: "Yes. Contact us at help@pillora.in and we will remove your profile from the network promptly."
        },
        {
            question: "Is there any cost to register as a donor?",
            answer: "No. Registering as a donor on Pillora is completely free."
        }
    ];

    const bloodRecipientFAQs: FAQ[] = [
        {
            question: "How do I request blood?",
            answer: "Go to the Blood Connect section and submit a request with — Patient Name, Age, Blood Group Needed, Units Needed, Hospital Name & Address, City, Area/Locality, and Contact Person Number."
        },
        {
            question: "Why is KYC verification mandatory?",
            answer: "The ID check protects donors from fraud and misuse. Our team checks every recipient's ID document (Aadhaar card, PAN card or driving licence) before any donor contact details are shared with them."
        },
        {
            question: "How does the ID check work?",
            answer: "Upload a clear photo of your ID document with your request. Our team checks it, sometimes with the help of an automatic document check. Once it is approved, we send you the matching donors' details by email and WhatsApp."
        },
        {
            question: "Is my Aadhaar number stored safely?",
            answer: "Yes. Your Aadhaar number is never stored in full. It is masked and saved as **** **** **XX — only the last 2 digits are visible in our admin panel."
        },
        {
            question: "How long does it take to find a matching donor?",
            answer: "Our team reviews your ID after you submit the request. Once it is approved, matching runs straight away: if donors with your blood group who agreed to be contacted are available in your city, you receive the details of up to 5 of them by email and WhatsApp."
        },
        {
            question: "What if no donor is found in my area?",
            answer: "If no match is found in your immediate area, we recommend also contacting your nearest licensed Blood Connect or hospital blood storage facility directly."
        }
    ];

    const hospitalFAQs: FAQ[] = [
        {
            question: "How do I search for a hospital on Pillora?",
            answer: "Go to the Hospitals section and search by city, area, specialty, or doctor name. You can compare hospitals based on doctors, pricing, facilities, and government schemes accepted."
        },
        {
            question: "Where does the hospital information on Pillora come from?",
            answer: "Hospitals are added by the Pillora team. Doctors, fees and timings are entered by the Pillora team or by the hospital from its own dashboard. Details can change, so please confirm fees and timings with the hospital before your visit."
        },
        {
            question: "What information is available for each hospital?",
            answer: "For every listed hospital we provide — doctor profiles with specializations and experience, consultation availability schedules, pricing for consultations and treatments, government schemes accepted (Ayushman Bharat, state schemes, and others), and facilities & departments available."
        },
        {
            question: "Can I book an appointment through Pillora?",
            answer: "Currently Pillora provides hospital and doctor information to help you make informed decisions. For appointments, you can directly contact the hospital using the details provided on their profile."
        }
    ];

    const partnerFAQs: FAQ[] = [
        {
            question: "How can my hospital get listed on Pillora?",
            answer: "Visit our Partners page and click &quot;Become a Partner&quot; under the Hospitals & Clinics section. Fill in your facility details and our team will contact you shortly."
        },
        {
            question: "We are an NGO with a donor database. How do we partner?",
            answer: "Visit our Partners page and click &quot;Become a Partner&quot; under the NGO & Blood Donor Organizations section. Share details about your donor database and our team will contact you shortly."
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-32">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-slate-900 text-white">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -ml-24 -mb-24" />
                
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-500/20"
                    >
                        <HelpCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight"
                    >
                        Help Center — <span className="text-blue-500 italic">Pillora</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl text-slate-400 font-medium mb-12 italic"
                    >
                        How can we help you?
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto relative group"
                    >
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <Search className="w-6 h-6" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search for answers..."
                            className="w-full pl-16 pr-8 py-6 bg-white/10 border border-white/20 rounded-[32px] backdrop-blur-md text-white text-lg font-medium placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:bg-white/15 transition-all shadow-2xl"
                        />
                    </motion.div>
                </div>
            </section>

            {/* FAQ Sections */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <FAQSection 
                        title="Blood Connect — Donor FAQs" 
                        icon={<Droplets className="w-6 h-6" />} 
                        faqs={bloodDonorFAQs} 
                        color="bg-red-600 shadow-red-200" 
                    />
                    
                    <FAQSection 
                        title="Blood Connect — Recipient FAQs" 
                        icon={<HeartPulse className="w-6 h-6" />} 
                        faqs={bloodRecipientFAQs} 
                        color="bg-red-500 shadow-red-100" 
                    />

                    <FAQSection 
                        title="Hospital Information — FAQs" 
                        icon={<Hospital className="w-6 h-6" />} 
                        faqs={hospitalFAQs} 
                        color="bg-blue-600 shadow-blue-200" 
                    />

                    <FAQSection 
                        title="Partner FAQs" 
                        icon={<Handshake className="w-6 h-6" />} 
                        faqs={partnerFAQs} 
                        color="bg-slate-900 shadow-slate-200" 
                    />
                </div>
            </section>

            {/* Contact CTA */}
            <section className="px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto bg-blue-600 rounded-[40px] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200"
                >
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -ml-48 -mt-48" />
                    
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-10 backdrop-blur-sm">
                            <Mail className="w-10 h-10" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Still Need Help?</h2>
                        <p className="text-xl text-blue-100 mb-12 font-medium max-w-2xl mx-auto italic">
                            Can&apos;t find what you&apos;re looking for? Reach out to us directly. Our team is here to assist you.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <a 
                                href="mailto:help@pillora.in"
                                className="w-full md:w-auto px-10 py-6 bg-white text-blue-600 font-black rounded-3xl hover:bg-slate-100 transition-all shadow-xl uppercase tracking-widest text-sm flex items-center justify-center gap-3"
                            >
                                help@pillora.in <ArrowRight className="w-4 h-4" />
                            </a>
                            <div className="px-10 py-6 bg-blue-700/50 border border-white/20 rounded-3xl font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                Response Time: Within 24 hours <Zap className="w-3 h-3 fill-current" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
