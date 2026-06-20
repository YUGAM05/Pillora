"use client";
import { motion } from "framer-motion";
import { FileText, Shield, UserCheck, AlertCircle, Scale, HeartHandshake, CreditCard } from "lucide-react";

export default function TermsPage() {
    const sections = [
        {
            title: "1. Platform Nature",
            icon: <Scale className="w-6 h-6 text-primary" />,
            content: "Pillora is a digital intermediary — not a medical provider or licensed blood bank. We connect you with hospital directories and a voluntary blood donor network."
        },
        {
            title: "2. Medical Disclaimer",
            icon: <AlertCircle className="w-6 h-6 text-red-500" />,
            content: "Pillora is not for emergencies. In a life-threatening situation, call 108 or visit the nearest ER. Content from our blog is for educational purposes only and is not a substitute for professional medical advice."
        },
        {
            title: "3. Blood Donor Network",
            icon: <HeartHandshake className="w-6 h-6 text-primary" />,
            content: "Pillora is a voluntary, non-monetary platform. Buying or selling blood is illegal in India. Any user found soliciting money for blood will be permanently banned and reported to authorities."
        },
        {
            title: "4. Your Responsibilities",
            icon: <UserCheck className="w-6 h-6 text-green-500" />,
            content: (
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>You are at least 18 years old</li>
                    <li>You will provide accurate identity and health information</li>
                    <li>You are responsible for keeping your login credentials confidential</li>
                </ul>
            )
        },
        {
            title: "5. Payments, Advance Booking & Refunds",
            icon: <CreditCard className="w-6 h-6 text-primary" />,
            content: (
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li><strong>5.1.</strong> Booking an appointment requires payment of an advance amount equal to 20% of the doctor&apos;s consultation fee, collected at the time of booking.</li>
                    <li><strong>5.2.</strong> Refund and cancellation terms are governed by Pillora&apos;s <a href="/returns" className="text-primary hover:underline font-medium">Refund and Cancellation Policy</a>, which forms part of these Terms by reference.</li>
                    <li><strong>5.3.</strong> Pillora uses third-party payment gateways for transaction processing. Pillora is not liable for delays or failures caused by the payment gateway, bank, or User&apos;s payment provider.</li>
                    <li><strong>5.4.</strong> Hospitals are responsible for honoring confirmed bookings and for the accuracy of consultation fees displayed on the Platform.</li>
                </ul>
            )
        },
        {
            title: "6. Liability",
            icon: <Shield className="w-6 h-6 text-blue-500" />,
            content: "Pillora and its founder (Shah Yugam) are not liable for adverse medication reactions or inaccuracies in third-party facility data."
        }
    ];

    return (
        <main className="min-h-screen bg-gray-50">
            
            
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100 pt-32 pb-16">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms &amp; Conditions</h1>
                        <p className="text-gray-500">Effective Date: January 26, 2026</p>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                >
                    <div className="prose prose-blue max-w-none">
                        <p className="text-lg text-gray-600 mb-12">
                            By creating an account or logging in, you agree to the following Terms &amp; Conditions. 
                            These terms govern your use of the Pillora platform and services.
                        </p>

                        <div className="space-y-12">
                            {sections.map((section, index) => (
                                <div key={index} className="relative pl-12">
                                    <div className="absolute left-0 top-1">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">{section.title}</h2>
                                    <div className="text-gray-600 leading-relaxed">
                                        {section.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 pt-8 border-t border-gray-100">
                            <p className="text-sm text-gray-500 text-center">
                                By using Pillora, you confirm that you have read, understood, and agreed to these 
                                Terms &amp; Conditions and our <a href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="pb-16" />
        </main>
    );
}
