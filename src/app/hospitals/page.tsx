"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Phone, Clock, CreditCard, Star, ChevronLeft, ChevronRight, User, ExternalLink, Building2, Share2, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Doctor {
    name: string;
    specialization?: string;
    daysAvailable?: string[];
    timing?: string;
}

interface Hospital {
    _id: string;
    slug: string;
    name: string;
    address: string;
    mapLink?: string;
    city: string;
    image: string;
    images?: string[];
    isOpen24Hours: boolean;
    consultationFee: number;
    governmentSchemes: string[];
    isOnlinePaymentAvailable: boolean;
    ambulanceContact: string;
    contactNumber?: string;
    phoneNumbers?: string[];
    description: string;
    rating: number;
    doctors?: Doctor[];
    management_type: 'SELF' | 'PILLORA';
    is_verified: boolean;
    hospitalType?: 'Government' | 'Private' | 'Trust' | 'Charitable';
    bedCapacity?: number;
    specialities?: string[];
}

// ─── Image Slideshow ──────────────────────────────────────────────────────────
function ImageSlideshow({ images, alt }: { images: string[]; alt: string }) {
    const [idx, setIdx] = useState(0);
    const fallback = '/premium-hospital.png';

    const prev = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }, [images.length]);
    const next = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }, [images.length]);

    useEffect(() => {
        if (images.length <= 1) return;
        const t = setInterval(() => setIdx(i => (i + 1) % images.length), 4000);
        return () => clearInterval(t);
    }, [images.length]);

    return (
        <div className="absolute inset-0">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={images[idx] || fallback}
                        alt={`${alt} – image ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallback; }}
                    />
                </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
                <>
                    <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 backdrop-blur-sm transition-colors z-10">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 backdrop-blur-sm transition-colors z-10">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                        {images.map((_, i) => (
                            <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                                className={`h-1.5 rounded-full transition-all ${i === idx ? 'bg-white w-3' : 'bg-white/50 w-1.5'}`} />
                        ))}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full z-10 font-medium">
                        {idx + 1}/{images.length}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-44 bg-gray-200" />
            <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-3.5 bg-gray-100 rounded w-full" />
                <div className="h-3.5 bg-gray-100 rounded w-2/3" />
                <div className="border-t pt-3 flex justify-between">
                    <div className="h-3.5 bg-gray-100 rounded w-1/3" />
                    <div className="h-3.5 bg-gray-200 rounded w-1/4" />
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HospitalsPage() {
    const router = useRouter();
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Hospital[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = React.useRef<HTMLDivElement>(null);

    // City detection and manual list states
    const [selectedCity, setSelectedCity] = useState('');
    const [showCityModal, setShowCityModal] = useState(false);
    const [cities, setCities] = useState<string[]>([]);
    const [geocodingLoading, setGeocodingLoading] = useState(false);

    // Sidebar filter states
    const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
    const [isPmjayAccepted, setIsPmjayAccepted] = useState(false);
    const [selectedGovtSchemes, setSelectedGovtSchemes] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedBedRanges, setSelectedBedRanges] = useState<string[]>([]);
    const [isEmergency247, setIsEmergency247] = useState(false);
    const [isBookingAvailable, setIsBookingAvailable] = useState(false);
    const [ratingThreshold, setRatingThreshold] = useState(0);
    const [sortBy, setSortBy] = useState('relevance');

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const fallbackImage = '/premium-hospital.png';

    const resolveSrc = (s?: string) => {
        if (!s) return fallbackImage;
        if (s.startsWith('/uploads/')) return `http://localhost:5000${s}`;
        if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:')) return s;
        return fallbackImage;
    };

    const getImages = (h: Hospital): string[] => {
        if (h.images && h.images.length > 0) return h.images.map(resolveSrc);
        if (h.image) return [resolveSrc(h.image)];
        return [fallbackImage];
    };

    const getMapUrl = (h: Hospital) =>
        h.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${h.address}, ${h.city}`)}`;

    // Autocomplete Search
    useEffect(() => {
        const t = setTimeout(async () => {
            if (searchTerm.trim().length < 2) { setSuggestions([]); return; }
            try {
                const res = await api.get(`/hospitals/search?q=${searchTerm}`);
                setSuggestions(res.data);
            } catch { /* ignore */ }
        }, 300);
        return () => clearTimeout(t);
    }, [searchTerm]);

    // Close autocomplete when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Load available cities & read localStorage city
    useEffect(() => {
        const loadCities = async () => {
            try {
                const res = await api.get('/hospitals/cities');
                setCities(res.data);
            } catch (error) {
                console.error("Failed to load cities", error);
                setCities(['Ahmedabad', 'Vadodara', 'Gandhinagar']);
            }
        };
        loadCities();

        const savedCity = localStorage.getItem('pillora_selected_city');
        if (savedCity) {
            setSelectedCity(savedCity);
        } else {
            setShowCityModal(true);
        }
    }, []);

    // Fetch hospitals from API based on active filters
    const fetchHospitals = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (selectedCity) params.city = selectedCity;
            if (selectedSpecs.length > 0) params.speciality = selectedSpecs.join(',');
            if (isPmjayAccepted) params.pmjay = 'true';
            if (selectedGovtSchemes.length > 0) params.govtSchemes = selectedGovtSchemes.join(',');
            if (selectedTypes.length > 0) params.hospitalType = selectedTypes.join(',');
            if (selectedBedRanges.length > 0) params.bedCapacity = selectedBedRanges.join(',');
            if (isEmergency247) params.emergency = 'true';
            if (isBookingAvailable) params.booking = 'true';
            if (ratingThreshold > 0) params.minRating = ratingThreshold;
            if (sortBy) params.sortBy = sortBy;

            const res = await api.get('/hospitals', { params });
            
            // Check if seeded database is empty
            if (res.data.length === 0 && !selectedCity) {
                await api.post('/hospitals/seed');
                const r2 = await api.get('/hospitals');
                setHospitals(r2.data);
            } else {
                setHospitals(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch hospitals', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, [selectedCity, selectedSpecs, isPmjayAccepted, selectedGovtSchemes, selectedTypes, selectedBedRanges, isEmergency247, isBookingAvailable, ratingThreshold, sortBy]);

    // Reverse geocode geolocation coordinate to city via Nominatim (OpenStreetMap)
    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }
        setGeocodingLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();
                    const detectedCity = data.address?.city || 
                                         data.address?.town || 
                                         data.address?.village || 
                                         data.address?.municipality || 
                                         data.address?.county;
                    
                    if (detectedCity) {
                        handleSelectCity(detectedCity);
                    } else {
                        alert("Could not detect your city. Please select manually.");
                    }
                } catch (error) {
                    console.error(error);
                    alert("Error getting location. Please select manually.");
                } finally {
                    setGeocodingLoading(false);
                }
            },
            (error) => {
                console.error(error);
                alert("Location access denied or unavailable. Please select manually.");
                setGeocodingLoading(false);
            }
        );
    };

    const handleSelectCity = (city: string) => {
        localStorage.setItem('pillora_selected_city', city);
        setSelectedCity(city);
        setShowCityModal(false);
    };

    const handleChangeCity = () => {
        setShowCityModal(true);
    };

    const clearAllFilters = () => {
        setSelectedSpecs([]);
        setIsPmjayAccepted(false);
        setSelectedGovtSchemes([]);
        setSelectedTypes([]);
        setSelectedBedRanges([]);
        setIsEmergency247(false);
        setIsBookingAvailable(false);
        setRatingThreshold(0);
        setSortBy('relevance');
    };

    // Client-side text search filter on the fetched results
    const filteredHospitals = hospitals.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Active filter chips compilation
    const activeChips: { id: string; label: string; onRemove: () => void }[] = [];
    selectedSpecs.forEach(spec => {
        activeChips.push({
            id: `spec-${spec}`,
            label: spec,
            onRemove: () => setSelectedSpecs(prev => prev.filter(s => s !== spec))
        });
    });
    if (isPmjayAccepted) {
        activeChips.push({
            id: 'pmjay',
            label: 'PM-JAY Accepted',
            onRemove: () => setIsPmjayAccepted(false)
        });
    }
    selectedGovtSchemes.forEach(scheme => {
        activeChips.push({
            id: `govt-${scheme}`,
            label: scheme,
            onRemove: () => setSelectedGovtSchemes(prev => prev.filter(s => s !== scheme))
        });
    });
    selectedTypes.forEach(type => {
        activeChips.push({
            id: `type-${type}`,
            label: `${type} Type`,
            onRemove: () => setSelectedTypes(prev => prev.filter(t => t !== type))
        });
    });
    selectedBedRanges.forEach(range => {
        activeChips.push({
            id: `beds-${range}`,
            label: `${range} Beds`,
            onRemove: () => setSelectedBedRanges(prev => prev.filter(r => r !== range))
        });
    });
    if (isEmergency247) {
        activeChips.push({
            id: 'emergency',
            label: '24/7 Emergency',
            onRemove: () => setIsEmergency247(false)
        });
    }
    if (isBookingAvailable) {
        activeChips.push({
            id: 'booking',
            label: 'Online Booking',
            onRemove: () => setIsBookingAvailable(false)
        });
    }
    if (ratingThreshold > 0) {
        activeChips.push({
            id: 'rating',
            label: `${ratingThreshold}★ & above`,
            onRemove: () => setRatingThreshold(0)
        });
    }

    const phoneList = (h: Hospital) => {
        const list = [];
        if (h.contactNumber) list.push(h.contactNumber);
        if (h.phoneNumbers && h.phoneNumbers.length > 0) {
            list.push(...h.phoneNumbers);
        }
        return Array.from(new Set(list)).filter(Boolean);
    };

    // Shared Sidebar Filter Panel Content
    const renderFilterPanelContent = () => (
        <div className="space-y-6 text-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-black text-slate-900 text-sm sm:text-base tracking-tight flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Filters
                </span>
                <button 
                    onClick={clearAllFilters} 
                    className="text-xs text-blue-600 hover:text-blue-800 font-extrabold transition-colors hover:underline underline-offset-2"
                >
                    Clear all
                </button>
            </div>

            {/* City Searchable Dropdown */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">City Location</label>
                <select 
                    value={selectedCity} 
                    onChange={(e) => handleSelectCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-800 font-bold transition-all cursor-pointer"
                >
                    <option value="">All Cities</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Specialities Checkboxes */}
            <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Speciality / Department</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {['Cardiology', 'Orthopaedics', 'Gynaecology', 'Neurology', 'General Surgery', 'Paediatrics'].map(spec => (
                        <label key={spec} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer select-none transition-colors">
                            <input 
                                type="checkbox"
                                checked={selectedSpecs.includes(spec)}
                                onChange={() => {
                                    setSelectedSpecs(prev => prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]);
                                }}
                                className="w-4 h-4 text-blue-600 border-slate-200 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
                            />
                            {spec}
                        </label>
                    ))}
                </div>
            </div>

            {/* Ayushman Bharat PM-JAY Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs sm:text-sm font-black text-slate-800">Ayushman Bharat (PM-JAY)</span>
                <button 
                    type="button"
                    onClick={() => setIsPmjayAccepted(prev => !prev)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${isPmjayAccepted ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${isPmjayAccepted ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>

            {/* Other Government Schemes */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Other Govt Schemes</label>
                {['MA Vatsalya', 'CGHS', 'ESI'].map(scheme => (
                    <label key={scheme} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer select-none transition-colors">
                        <input 
                            type="checkbox"
                            checked={selectedGovtSchemes.includes(scheme)}
                            onChange={() => {
                                setSelectedGovtSchemes(prev => prev.includes(scheme) ? prev.filter(s => s !== scheme) : [...prev, scheme]);
                            }}
                            className="w-4 h-4 text-blue-600 border-slate-200 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
                        />
                        {scheme}
                    </label>
                ))}
            </div>

            {/* Hospital Type */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Hospital Type</label>
                {['Private', 'Government', 'Trust', 'Charitable'].map(type => (
                    <label key={type} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer select-none transition-colors">
                        <input 
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => {
                                setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
                            }}
                            className="w-4 h-4 text-blue-600 border-slate-200 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
                        />
                        {type}
                    </label>
                ))}
            </div>

            {/* Bed Capacity */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Bed Capacity</label>
                {['<50', '50-200', '200-500', '500+'].map(range => (
                    <label key={range} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer select-none transition-colors">
                        <input 
                            type="checkbox"
                            checked={selectedBedRanges.includes(range)}
                            onChange={() => {
                                setSelectedBedRanges(prev => prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]);
                            }}
                            className="w-4 h-4 text-blue-600 border-slate-200 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
                        />
                        {range} beds
                    </label>
                ))}
            </div>

            {/* Emergency & Booking Toggles */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black text-slate-800">24/7 Emergency</span>
                    <button 
                        type="button"
                        onClick={() => setIsEmergency247(prev => !prev)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${isEmergency247 ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${isEmergency247 ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black text-slate-800">Online Booking Available</span>
                    <button 
                        type="button"
                        onClick={() => setIsBookingAvailable(prev => !prev)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${isBookingAvailable ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${isBookingAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            {/* Stars Minimum Filter */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Rating</label>
                <div className="flex gap-2">
                    {[3, 4].map(stars => (
                        <button
                            type="button"
                            key={stars}
                            onClick={() => setRatingThreshold(prev => prev === stars ? 0 : stars)}
                            className={`flex-1 py-2 px-3 border rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all ${
                                ratingThreshold === stars 
                                    ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-900/10' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <Star className="w-3.5 h-3.5 fill-current" /> {stars}★ & above
                        </button>
                    ))}
                </div>
            </div>

            {/* Sorting Dropdown */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Sort By</label>
                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-800 font-bold transition-all cursor-pointer"
                >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating (High to Low)</option>
                    <option value="beds">Beds (High to Low)</option>
                    <option value="name">Name (A–Z)</option>
                </select>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-slate-50/50 to-slate-50 flex flex-col text-slate-700">

            {/* ── Hero Banner ── */}
            <div className="relative bg-gradient-to-br from-blue-50/60 via-white to-white text-slate-900 border-b border-blue-100/40 z-20 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdHRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoNTksMTMwLDI0NiwwLjAzKSIiIHN0cm9rZS13aWR0aD0iMSfvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full sm:w-[800px] h-[400px] bg-blue-100/40 rounded-full blur-[120px]" />
                    <div className="absolute -top-24 -right-24 w-[400px] h-[400px] bg-indigo-100/35 rounded-full blur-[100px]" />
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 z-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-100/80 rounded-full px-4.5 py-1.5 text-xs sm:text-sm font-semibold mb-6 text-blue-700 shadow-sm shadow-blue-100/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                            </span>
                            <span>{hospitals.length > 0 ? `${hospitals.length} Premium Facilities Partnered` : 'Hospital Directory'}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-5 text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900">
                            Trusted Healthcare<br className="hidden sm:block" /> When You Need It Most
                        </h1>

                        {/* Location Header Info */}
                        <div className="flex items-center justify-center gap-2 mb-8 text-xs sm:text-sm text-slate-500 font-bold">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>Hospitals in <strong className="text-blue-950 font-black">{selectedCity || 'All Cities'}</strong></span>
                            <button 
                                onClick={handleChangeCity}
                                className="text-xs text-blue-600 hover:text-blue-700 underline underline-offset-4 font-black ml-1.5 transition-colors"
                            >
                                Change city
                            </button>
                        </div>

                        {/* Search Input Box */}
                        <div className="relative max-w-lg mx-auto" ref={searchRef}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-blue-600" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-11 pr-4 py-3.5 sm:py-4 bg-white border border-blue-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 text-sm sm:text-base shadow-lg shadow-blue-900/5 transition-all outline-none"
                                placeholder="Search by hospital name or city..."
                                value={searchTerm}
                                onChange={e => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
                                onFocus={() => setShowSuggestions(true)}
                            />
                            {/* Autocomplete Dropdown */}
                            {showSuggestions && (suggestions.length > 0 || searchTerm.length >= 2) && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(59,130,246,0.12)] border border-blue-50/80 overflow-hidden z-[60] py-2 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                                    {suggestions.length > 0 ? (
                                        <>
                                            <div className="px-4 py-2 text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-slate-50 mb-1">Top Matches</div>
                                            {suggestions.map(h => (
                                                <button key={h._id} onClick={() => { setSearchTerm(h.name); setShowSuggestions(false); }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50/50 transition-colors text-left group">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden relative">
                                                        <Image src={resolveSrc(h.images?.[0] ?? h.image)} alt={h.name} fill className="object-cover" unoptimized />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-extrabold text-slate-800 text-sm truncate group-hover:text-blue-600 transition-colors">{h.name}</p>
                                                        <div className="flex items-center text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                                                            <MapPin className="w-2.5 h-2.5 mr-1 text-blue-500" />{h.city}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-200/50 px-2 py-1 rounded-lg shrink-0">
                                                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />{h.rating}
                                                    </div>
                                                </button>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="px-4 py-6 text-center text-slate-500">
                                            <p className="text-sm font-semibold">No hospitals found matching &quot;{searchTerm}&quot;</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Content Area ── */}
            <div className="flex-grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Sticky Sidebar Panel (Desktop Only) */}
                    <div className="hidden lg:block w-72 shrink-0 sticky top-24">
                        <div className="bg-white rounded-[2rem] border border-blue-50/80 p-6 shadow-[0_8px_30px_rgba(59,130,246,0.015)] max-h-[80vh] overflow-y-auto custom-scrollbar">
                            {renderFilterPanelContent()}
                        </div>
                    </div>

                    {/* Right Results Grid */}
                    <div className="flex-1 w-full min-w-0">
                        {/* Filters Trigger (Mobile) & Results Count Label */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            
                            <div className="flex items-center gap-3">
                                {/* Mobile Floating Filters Trigger Button */}
                                <button 
                                    onClick={() => setIsMobileFilterOpen(true)}
                                    className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-100 active:scale-95 transition-all"
                                >
                                    <SlidersHorizontal className="w-4 h-4" /> Filters
                                </button>
                                
                                {!loading && (
                                    <p className="text-sm text-slate-500 font-bold">
                                        Showing <span className="font-black text-slate-800">{filteredHospitals.length}</span> hospital{filteredHospitals.length !== 1 ? 's' : ''} in <span className="font-black text-slate-800">{selectedCity || 'All Cities'}</span>
                                    </p>
                                )}
                            </div>

                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="text-xs text-blue-600 hover:text-blue-800 font-extrabold hover:underline underline-offset-2 self-start sm:self-auto transition-colors">
                                    Clear text search
                                </button>
                            )}
                        </div>

                        {/* Active Filter Chips */}
                        {activeChips.length > 0 && (
                            <div className="flex flex-wrap gap-2 items-center mb-6 bg-white border border-blue-50/80 p-3.5 rounded-3xl shadow-[0_8px_30px_rgba(59,130,246,0.01)]">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Active Filters:</span>
                                {activeChips.map(chip => (
                                    <div key={chip.id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50/70 border border-blue-100/50 rounded-full text-xs font-bold text-blue-700 shadow-sm animate-fade-in">
                                        {chip.label}
                                        <button onClick={chip.onRemove} className="p-0.5 hover:bg-blue-200 rounded-full text-blue-500 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={clearAllFilters} className="text-xs text-rose-600 hover:text-rose-800 font-black ml-2 transition-colors">
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        {/* Hospital Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                            </div>
) : filteredHospitals.length === 0 ? (
                            <div className="text-center py-24 bg-white border border-blue-50/80 rounded-[2rem] shadow-sm">
                                <Building2 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                                <p className="text-lg font-black text-slate-800">No Hospitals Found</p>
                                <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto px-4 font-semibold">We couldn&apos;t find any hospitals matching your current active filters. Try clearing some selections.</p>
                                <button 
                                    onClick={clearAllFilters}
                                    className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all text-sm active:scale-95"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredHospitals.map((hospital, index) => {
                                    const imgs = getImages(hospital);
                                    const phones = phoneList(hospital);
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            key={hospital._id}
                                            className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(59,130,246,0.015)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.06)] hover:-translate-y-1.5 transition-all duration-300 border border-slate-100/60 overflow-hidden flex flex-col cursor-pointer group"
                                            onClick={() => router.push(`/hospitals/${hospital.slug}`)}
                                        >
                                            {/* Slideshow image container */}
                                            <div className="relative h-44 sm:h-48 w-full overflow-hidden flex-shrink-0 bg-slate-50">
                                                <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500 ease-out">
                                                    <ImageSlideshow images={imgs} alt={hospital.name} />
                                                </div>
                                                
                                                {/* Star rating */}
                                                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm z-10 border border-white/40">
                                                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                                                    <span className="font-black text-slate-800 text-xs sm:text-sm">{hospital.rating}</span>
                                                </div>

                                                {/* Top Badges */}
                                                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                                                    {hospital.is_verified && (
                                                        <div className="bg-white/95 backdrop-blur-md text-blue-700 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 border border-blue-100">
                                                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Verified
                                                        </div>
                                                    )}
                                                    {hospital.isOpen24Hours && (
                                                        <div className="bg-emerald-500/95 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 border border-emerald-400/20">
                                                            <Clock className="w-3.5 h-3.5 text-white" /> 24/7 Emergency
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Lower Management Tag */}
                                                <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider z-10 backdrop-blur-md shadow-sm border ${
                                                    hospital.management_type === 'SELF' 
                                                        ? 'bg-white/95 text-emerald-700 border-emerald-100' 
                                                        : 'bg-blue-600/95 text-white border-blue-500/35'
                                                }`}>
                                                    {hospital.management_type === 'SELF' ? '🏥 Self Managed' : '✨ Pillora Managed'}
                                                </div>

                                                {/* Payment details tag */}
                                                <div className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider z-10 backdrop-blur-md shadow-sm border ${
                                                    hospital.isOnlinePaymentAvailable
                                                        ? 'bg-white/95 text-blue-700 border-blue-100'
                                                        : 'bg-slate-900/90 text-white border-slate-800'
                                                }`}>
                                                    {hospital.isOnlinePaymentAvailable ? '💳 Online Pay' : 'Cash Only'}
                                                </div>
                                            </div>

                                            {/* Details Content */}
                                            <div className="p-5 flex-1 flex flex-col bg-white">
                                                <h3 className="text-base sm:text-lg font-black text-slate-950 mb-1 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {hospital.name}
                                                </h3>

                                                {/* Clickable Map Link */}
                                                <a
                                                    href={getMapUrl(hospital)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={e => e.stopPropagation()}
                                                    className="flex items-start gap-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 mb-4 transition-colors font-bold group/addr"
                                                    title="Open in Google Maps"
                                                >
                                                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-500" />
                                                    <span className="line-clamp-2 leading-snug">{hospital.address}, {hospital.city}</span>
                                                    <ExternalLink className="w-3 h-3 mt-0.5 shrink-0 opacity-0 group-hover/addr:opacity-100 transition-opacity" />
                                                </a>

                                                {/* Specs and details grid */}
                                                <div className="mt-auto space-y-2.5 border-t border-slate-50 pt-3.5">
                                                    
                                                    {/* Consultation cost */}
                                                    <div className="flex items-center justify-between text-xs sm:text-sm border-b border-dashed border-slate-100/60 pb-2">
                                                        <span className="text-slate-500 flex items-center gap-1.5 font-bold">
                                                            <CreditCard className="w-3.5 h-3.5 text-blue-500" /> Consultation Fee
                                                        </span>
                                                        <span className="font-black text-slate-900">
                                                            ₹{hospital.consultationFee}
                                                        </span>
                                                    </div>

                                                    {phones.length > 0 && (
                                                        <div className="flex items-center justify-between text-xs sm:text-sm border-b border-dashed border-slate-100/60 pb-2">
                                                            <span className="text-slate-500 flex items-center gap-1.5 font-bold">
                                                                <Phone className="w-3.5 h-3.5 text-blue-500" /> Emergency Contact
                                                            </span>
                                                            <a
                                                                href={`tel:${phones[0]}`}
                                                                onClick={e => e.stopPropagation()}
                                                                className="font-black text-blue-600 hover:text-blue-800 transition-colors"
                                                            >
                                                                {phones[0]}
                                                                {phones.length > 1 && (
                                                                    <span className="ml-1 text-slate-400 font-bold">+{phones.length - 1}</span>
                                                                )}
                                                            </a>
                                                        </div>
                                                    )}

                                                    {/* Doctor availability count */}
                                                    {hospital.doctors && hospital.doctors.length > 0 && (
                                                        <div className="flex items-center justify-between text-xs sm:text-sm border-b border-dashed border-slate-100/60 pb-2">
                                                            <span className="text-slate-500 flex items-center gap-1.5 font-bold">
                                                                <User className="w-3.5 h-3.5 text-blue-500" /> Doctors
                                                            </span>
                                                            <span className="font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] sm:text-xs border border-blue-100/50">
                                                                {hospital.doctors.length} Available
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Beds capacity count info */}
                                                    {hospital.bedCapacity !== undefined && (
                                                        <div className="flex items-center justify-between text-xs sm:text-sm border-b border-dashed border-slate-100/60 pb-2">
                                                            <span className="text-slate-500 flex items-center gap-1.5 font-bold">
                                                                <Building2 className="w-3.5 h-3.5 text-blue-500" /> Bed Capacity
                                                            </span>
                                                            <span className="font-black text-slate-800">
                                                                {hospital.bedCapacity} Beds
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Government Schemes tag lists */}
                                                    {hospital.governmentSchemes && hospital.governmentSchemes.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                                                            {hospital.governmentSchemes.map(s => (
                                                                <span key={s} className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100/50 text-[10px] font-black uppercase tracking-wider">
                                                                    🛡️ {s}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* CTA buttons */}
                                                <div className="mt-5 flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const url = `https://www.pillora.in/hospitals/${hospital.slug}`;
                                                            if (navigator.share) {
                                                                navigator.share({ title: hospital.name, url });
                                                            } else {
                                                                navigator.clipboard.writeText(url);
                                                                alert('Link copied to clipboard!');
                                                            }
                                                        }}
                                                        className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors border border-slate-100"
                                                        title="Share Hospital"
                                                    >
                                                        <Share2 className="w-5 h-5" />
                                                    </button>
                                                    <div className="flex-grow flex items-center justify-center gap-1 py-3 rounded-xl bg-blue-50 text-blue-700 text-xs sm:text-sm font-black border border-blue-100/50 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:shadow-md group-hover:shadow-blue-500/10 transition-all duration-300 shadow-sm active:scale-[0.97]">
                                                        <span>View Details</span>
                                                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Mobile Sidebar Drawer Slider ── */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        {/* Drawer Backdrop overlay */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="fixed inset-0 bg-slate-950/60 z-[90] backdrop-blur-sm"
                        />
                        {/* Slide-out Drawer Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-white z-[95] shadow-2xl p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between border-b pb-4 mb-4">
                                <h3 className="font-extrabold text-lg text-slate-900">Filters</h3>
                                <button 
                                    onClick={() => setIsMobileFilterOpen(false)} 
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <div className="flex-grow overflow-y-auto pr-1">
                                {renderFilterPanelContent()}
                            </div>
                            <div className="border-t pt-4 mt-4">
                                <button 
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all text-sm active:scale-95"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── City Detection Welcome Modal ── */}
            <AnimatePresence>
                {showCityModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Blur Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
                        />
                        {/* Modal Dialog Card */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                            className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl relative z-10 border border-slate-100 flex flex-col"
                        >
                            <div className="text-center mb-6">
                                <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm">
                                    <MapPin className="w-7 h-7" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Which city are you in?</h2>
                                <p className="text-slate-500 text-sm mt-2 font-bold">We will show you partner hospitals near your location.</p>
                            </div>

                            <div className="space-y-4">
                                {/* Auto Geolocation Trigger */}
                                <button 
                                    onClick={handleUseMyLocation}
                                    disabled={geocodingLoading}
                                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:scale-100 text-sm"
                                >
                                    <MapPin className="w-4 h-4" /> 
                                    {geocodingLoading ? 'Detecting Location...' : 'Use My Current Location'}
                                </button>

                                <div className="relative flex py-2 items-center">
                                    <div className="flex-grow border-t border-slate-100"></div>
                                    <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-black uppercase tracking-wider">Or select manually</span>
                                    <div className="flex-grow border-t border-slate-100"></div>
                                </div>

                                {/* Manual Selector dropdown */}
                                <select 
                                    value={selectedCity} 
                                    onChange={(e) => {
                                        if (e.target.value) handleSelectCity(e.target.value);
                                    }}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-800 font-bold shadow-sm cursor-pointer"
                                >
                                    <option value="" disabled>Select your city...</option>
                                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
