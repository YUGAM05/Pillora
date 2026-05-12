"use client";

import { useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/lib/tokenStorage";
import { Building2, MapPin, Phone, DollarSign, Clock, FileText, Loader2, CheckCircle2 } from "lucide-react";

export default function AddHospitalForm({ onClose }: { onClose?: () => void }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        city: "",
        address: "",
        consultationFee: "",
        ambulanceContact: "",
        description: "",
        isOpen24Hours: false,
    });

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const token = getToken();
            const payload = {
                ...formData,
                slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                consultationFee: Number(formData.consultationFee)
            };

            await api.post("/hospitals", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                if (onClose) onClose();
            }, 2000);
            
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add hospital");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-emerald-50 rounded-2xl border border-emerald-100">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Hospital Added!</h3>
                <p className="text-gray-600">The hospital directory has been successfully updated.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 space-y-6">
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                    {error}
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Hospital Name</label>
                    <div className="relative group">
                        <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. City General Hospital"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">City</label>
                    <div className="relative group">
                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            required
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="e.g. Mumbai"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700">Full Address</label>
                    <div className="relative group">
                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            required
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Full street address..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Consultation Fee (₹)</label>
                    <div className="relative group">
                        <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            required
                            type="number"
                            name="consultationFee"
                            value={formData.consultationFee}
                            onChange={handleChange}
                            placeholder="500"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Ambulance Contact</label>
                    <div className="relative group">
                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            required
                            name="ambulanceContact"
                            value={formData.ambulanceContact}
                            onChange={handleChange}
                            placeholder="+91..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700">Description</label>
                    <div className="relative group">
                        <FileText className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <textarea
                            required
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description about facilities and specialties..."
                            rows={3}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input
                    type="checkbox"
                    id="isOpen24Hours"
                    name="isOpen24Hours"
                    checked={formData.isOpen24Hours}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isOpen24Hours" className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
                    <Clock className="w-5 h-5 text-primary" /> Open 24 Hours
                </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 font-bold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Hospital"}
                </button>
            </div>
        </form>
    );
}
