"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, User, Phone, MapPin, Droplet, ShieldCheck, ArrowLeft, Loader2, CheckCircle, Info } from 'lucide-react';
import Link from 'next/link';
import api from '../../lib/api';

interface DonorProfile {
    _id: string;
    name: string;
    bloodGroup: string;
    age: number;
    phone: string;
    gender: string;
    address: string;
    area: string;
    city: string;
    isAvailable: boolean;
    createdAt: string;
}

export default function MyDonorProfilePage() {
    const [donor, setDonor] = useState<DonorProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonorProfile = async () => {
            try {
                if (!api) {
                    console.warn('API instance is not initialized yet');
                    return;
                }
                const response = await api.get('/blood-bank/my-donor');
                setDonor(response.data);
            } catch (error: any) {
                if (error.response?.status !== 404) {
                    console.error('Error fetching donor profile:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDonorProfile();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <Link href="/" className="p-2 hover:bg-white rounded-full transition-colors shrink-0">
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Donor Profile</h1>
                        <p className="text-sm text-gray-500">Your registration as a life-saver</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
                        <p className="text-gray-500">Retrieving your profile...</p>
                    </div>
                ) : donor ? (
                    <div className="space-y-6">
                        {/* Profile Summary Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-10 -mt-10 opacity-50" />

                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                                <div className="w-24 h-24 bg-red-600 text-white rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg shadow-red-200">
                                    <span className="text-3xl font-black">{donor.bloodGroup}</span>
                                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Group</span>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold text-gray-900">{donor.name}</h2>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${donor.isAvailable ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                            {donor.isAvailable ? 'Available to Donate' : 'On Break'}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            {donor.phone}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            {donor.age} Years, {donor.gender}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                                    <MapPin className="w-5 h-5 text-red-500" />
                                    Location Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">City</span>
                                        <span className="font-bold text-gray-900">{donor.city}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Area</span>
                                        <span className="font-bold text-gray-900">{donor.area}</span>
                                    </div>
                                    <div className="pt-2">
                                        <span className="text-gray-500 text-xs block mb-1">Full Address</span>
                                        <p className="text-sm text-gray-900 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            {donor.address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                                        <ShieldCheck className="w-5 h-5 text-green-500" />
                                        Safety & Privacy
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        When someone signed in to Pillora requests your blood group in your city, we may send them your name and phone number by email and WhatsApp so they can contact you. To change your availability or remove your details, email help@pillora.in.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Info className="w-4 h-4" />
                                    Registered on {new Date(donor.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                            <p className="text-red-800 font-medium mb-4">Want to update your information or status?</p>
                            <Link href="/blood-bank" className="bg-red-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-all inline-block">
                                Edit Donor Details
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Not Registered as a Donor</h2>
                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                            Become a hero by registering as a blood donor in our network.
                        </p>
                        <Link href="/blood-bank" className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100">
                            Register Now <Droplet className="w-5 h-5" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
