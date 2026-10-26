"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
    Calendar, 
    Loader2, 
    Play, 
    ExternalLink, 
    Video, 
    FileText, 
    Search, 
    Sparkles, 
    Clock, 
    ArrowRight, 
    ShieldCheck, 
    BookOpen, 
    Heart, 
    Activity, 
    Filter,
    CheckCircle2
} from 'lucide-react';
import { 
    HEALTH_HUB_ARTICLES, 
    HEALTH_CATEGORIES, 
    HealthArticle 
} from '@/data/healthHubData';

interface DynamicTip {
    _id: string;
    title: string;
    description: string;
    date: string;
    mediaType?: 'image' | 'video' | 'url';
    imageUrl?: string;
    videoUrl?: string;
    linkUrl?: string;
    category?: string;
    readTime?: string;
    author?: {
        name: string;
        role: string;
        avatar?: string;
    };
    tags?: string[];
}

export default function HealthHubPage() {
    const [dynamicTips, setDynamicTips] = useState<DynamicTip[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        const fetchTips = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/health-hub`,
                    { timeout: 3500 }
                );
                if (Array.isArray(response.data)) {
                    setDynamicTips(response.data);
                }
            } catch (error) {
                // Silently fallback to our rich curated content library
                console.log('Using curated Health Hub articles repository.');
            } finally {
                setLoading(false);
            }
        };

        fetchTips();
    }, []);

    // Combine curated static articles with dynamic DB tips (avoiding duplicates)
    const combinedArticles = useMemo(() => {
        const dynamicMapped: HealthArticle[] = dynamicTips.map(dt => ({
            _id: dt._id,
            slug: dt._id,
            title: dt.title,
            description: dt.description,
            category: dt.category || 'Wellness News',
            readTime: dt.readTime || '3 min read',
            date: dt.date || new Date().toISOString(),
            author: dt.author || {
                name: 'Pillora Health Advisory',
                role: 'Editorial Board',
                avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
            },
            mediaType: dt.mediaType || 'image',
            imageUrl: dt.imageUrl,
            videoUrl: dt.videoUrl,
            linkUrl: dt.linkUrl,
            tags: dt.tags || ['Health', 'Update'],
            keyTakeaways: [dt.description.slice(0, 140) + '...'],
            sections: [
                {
                    heading: 'Overview',
                    paragraphs: dt.description.split('\n').filter(Boolean)
                }
            ]
        }));

        // Dynamic items take top priority, followed by curated articles
        return [...dynamicMapped, ...HEALTH_HUB_ARTICLES];
    }, [dynamicTips]);

    // Filter by category and search query
    const filteredArticles = useMemo(() => {
        return combinedArticles.filter((article) => {
            const matchesCategory =
                selectedCategory === 'All' || article.category === selectedCategory;

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                article.title.toLowerCase().includes(q) ||
                article.description.toLowerCase().includes(q) ||
                article.category.toLowerCase().includes(q) ||
                article.tags?.some(tag => tag.toLowerCase().includes(q));

            return matchesCategory && matchesSearch;
        });
    }, [combinedArticles, selectedCategory, searchQuery]);

    // Spotlight / Featured article
    const featuredArticle = useMemo(() => {
        return (
            combinedArticles.find(a => a.featured) ||
            combinedArticles[0]
        );
    }, [combinedArticles]);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (newsletterEmail) {
            setSubscribed(true);
            setTimeout(() => {
                setNewsletterEmail('');
            }, 3000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-600 text-sm font-semibold tracking-wide animate-pulse">
                    Loading verified health guidance...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-slate-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* 1. Header Hero Section */}
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        Pillora Medical Knowledge Hub
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                        Health & Wellness Hub
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        Evidence-based wellness articles, medical guides, and daily preventive care tips curated by certified doctors and healthcare researchers.
                    </p>
                </div>

                {/* 2. Search & Category Filters Bar */}
                <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by health condition, symptom, nutrition, heart health, lab tests..."
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm sm:text-base"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600 bg-gray-200 px-2 py-1 rounded-md"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
                            <Filter className="w-3.5 h-3.5 text-gray-400" /> Topic:
                        </span>
                        {HEALTH_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                                    selectedCategory === cat
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-100'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Featured Spotlight Story (shown when no search query and 'All' category) */}
                {selectedCategory === 'All' && !searchQuery && featuredArticle && (
                    <div className="relative bg-gradient-to-br from-blue-900 to-indigo-950 rounded-3xl overflow-hidden shadow-xl text-white">
                        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                            <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 space-y-5">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-blue-500/30 backdrop-blur-md border border-blue-400/40 text-blue-200 text-xs font-bold uppercase tracking-wider rounded-lg">
                                        Editor’s Choice
                                    </span>
                                    <span className="text-xs text-blue-200/80 font-medium flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {featuredArticle.readTime}
                                    </span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight text-white">
                                    {featuredArticle.title}
                                </h2>

                                <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed line-clamp-3">
                                    {featuredArticle.description}
                                </p>

                                <div className="pt-2 flex flex-wrap items-center gap-4">
                                    <Link
                                        href={`/health-hub/${featuredArticle._id}`}
                                        className="inline-flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 px-6 py-3 rounded-2xl font-bold text-sm tracking-wide shadow-lg transition-all hover:scale-105"
                                    >
                                        <BookOpen className="w-4 h-4 text-blue-600" />
                                        Read Full Article
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>

                                    <div className="flex items-center gap-2 text-xs text-blue-200">
                                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                        <span>Medically Reviewed by {featuredArticle.author.name}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5 relative h-72 lg:h-full min-h-[320px] w-full bg-slate-800">
                                {featuredArticle.imageUrl ? (
                                    <Image
                                        src={featuredArticle.imageUrl}
                                        alt={featuredArticle.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-900">
                                        <Heart className="w-16 h-16 text-blue-400/50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-blue-950/80 lg:to-transparent" />
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. Quick Daily Health Ticker Strip */}
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                                Daily Clinical Takeaway
                            </p>
                            <p className="text-sm font-medium text-emerald-950 mt-0.5">
                                Drinking 450ml of warm water within 15 minutes of waking lowers overnight blood viscosity and primes morning metabolism.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/health-hub/hydration-science-metabolism"
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 shrink-0 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-xs"
                    >
                        Learn Science &rarr;
                    </Link>
                </div>

                {/* 5. Articles Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                {selectedCategory === 'All' ? 'All Health Articles & Medical Guides' : `${selectedCategory} Articles`}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Showing {filteredArticles.length} verified health resources
                            </p>
                        </div>
                    </div>

                    {filteredArticles.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No articles matched your search</h3>
                            <p className="text-sm text-gray-500 max-w-md mx-auto">
                                Try adjusting your keywords or browse all health topics to find what you are looking for.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('All');
                                }}
                                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                Reset Search Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {filteredArticles.map((article) => {
                                const CardContent = (
                                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer hover:border-blue-200 group">
                                        
                                        {/* Media / Image Container */}
                                        <div className="relative h-52 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                                            {article.mediaType === 'video' && article.videoUrl ? (
                                                <div className="relative w-full h-full bg-black flex items-center justify-center">
                                                    <video
                                                        src={article.videoUrl}
                                                        className="w-full h-full object-cover"
                                                        muted
                                                        playsInline
                                                        loop
                                                        autoPlay
                                                    />
                                                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                                        <div className="w-10 h-10 bg-white/20 group-hover:bg-white/45 backdrop-blur-md rounded-full flex items-center justify-center transition-colors">
                                                            <Play className="w-5 h-5 text-white fill-current" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : article.imageUrl ? (
                                                <Image
                                                    src={article.imageUrl}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-slate-300">
                                                    <FileText className="w-12 h-12 text-slate-200" />
                                                </div>
                                            )}

                                            {/* Category Overlay Tag */}
                                            <div className="absolute top-3 left-3 z-10">
                                                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-blue-700 text-[11px] font-bold rounded-lg shadow-sm border border-white/50">
                                                    {article.category}
                                                </span>
                                            </div>

                                            {/* Media Type Ribbon */}
                                            {article.mediaType && (
                                                <div className="absolute top-3 right-3 z-10">
                                                    {article.mediaType === 'video' ? (
                                                        <span className="px-2.5 py-1 bg-rose-500 text-white text-[9px] font-extrabold uppercase tracking-wider rounded-lg flex items-center gap-1 shadow-md">
                                                            <Video className="w-2.5 h-2.5" /> Video
                                                        </span>
                                                    ) : article.mediaType === 'url' ? (
                                                        <span className="px-2.5 py-1 bg-emerald-500 text-white text-[9px] font-extrabold uppercase tracking-wider rounded-lg flex items-center gap-1 shadow-md">
                                                            <ExternalLink className="w-2.5 h-2.5" /> External
                                                        </span>
                                                    ) : null}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Container */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-3">
                                                <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(article.date).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {article.readTime || '4 min read'}
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                                                {article.title}
                                            </h3>

                                            <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                                {article.description}
                                            </p>

                                            {/* Author and Action */}
                                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {article.author?.avatar ? (
                                                        <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-gray-100">
                                                            <Image
                                                                src={article.author.avatar}
                                                                alt={article.author.name}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                                                            P
                                                        </div>
                                                    )}
                                                    <span className="text-xs font-semibold text-gray-700 truncate max-w-[130px]">
                                                        {article.author?.name || 'Pillora Health'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1 text-blue-600 font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                                                    {article.mediaType === 'url' ? (
                                                        <>
                                                            <span>Visit Link</span>
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Read Article</span>
                                                            <ArrowRight className="w-3.5 h-3.5" />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );

                                if (article.mediaType === 'url' && article.linkUrl) {
                                    return (
                                        <a
                                            href={article.linkUrl}
                                            key={article._id}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block h-full"
                                        >
                                            {CardContent}
                                        </a>
                                    );
                                } else {
                                    return (
                                        <Link
                                            href={`/health-hub/${article._id}`}
                                            key={article._id}
                                            className="block h-full"
                                        >
                                            {CardContent}
                                        </Link>
                                    );
                                }
                            })}
                        </div>
                    )}
                </div>

                {/* 6. Medical Disclaimer & Emergency Connect Banner */}
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-3 max-w-2xl">
                        <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                            <Heart className="w-4 h-4 fill-current" />
                            Pillora 24/7 Emergency Healthcare Grid
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Need Immediate Medical Help or Emergency Blood?
                        </h3>
                        <p className="text-blue-100/80 text-sm leading-relaxed">
                            Access verified blood donors near your GPS location in real time, or explore accredited multi-speciality hospital networks with live bed availability.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                        <Link
                            href="/blood-bank"
                            className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-sm tracking-wide text-center shadow-lg shadow-rose-500/30 transition-all hover:scale-105"
                        >
                            Find Blood Donor
                        </Link>
                        <Link
                            href="/hospitals"
                            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-sm tracking-wide text-center transition-all"
                        >
                            Explore Hospitals
                        </Link>
                    </div>
                </div>

                {/* 7. Health Digest Newsletter */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm text-center max-w-2xl mx-auto space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Subscribe to Pillora Weekly Health Digest
                    </h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                        Receive doctor-vetted health tips, seasonal immunity advisories, and lab test guides straight to your inbox. No spam, ever.
                    </p>

                    {subscribed ? (
                        <div className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 px-5 py-2.5 rounded-xl font-bold text-sm border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4" />
                            Thank you! You are subscribed to our Health Digest.
                        </div>
                    ) : (
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                            <input
                                type="email"
                                required
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors shrink-0"
                            >
                                Subscribe Free
                            </button>
                        </form>
                    )}
                </div>

                {/* 8. Medical Footer Disclaimer */}
                <div className="border-t border-gray-200 pt-8 pb-4 text-center">
                    <p className="text-xs text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        <strong>Medical Disclaimer:</strong> The articles and advice published on Pillora Health Hub are intended solely for educational, preventive, and general informational purposes. They do not constitute formal medical diagnosis, treatment, or clinical prescriptions. Always seek the direct guidance of a qualified healthcare provider regarding any specific medical condition.
                    </p>
                </div>

            </div>
        </div>
    );
}
