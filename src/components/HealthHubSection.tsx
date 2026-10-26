"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Calendar, ArrowRight, Activity, Clock, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { HEALTH_HUB_ARTICLES, HealthArticle } from '@/data/healthHubData';

export default function HealthHubSection() {
    const [tips, setTips] = useState<HealthArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTips = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/health-hub`,
                    { timeout: 3000 }
                );
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const mapped: HealthArticle[] = response.data.slice(0, 3).map((d: any) => ({
                        _id: d._id,
                        slug: d._id,
                        title: d.title,
                        description: d.description,
                        category: d.category || 'Clinical Guidance',
                        readTime: d.readTime || '4 min read',
                        date: d.date || new Date().toISOString(),
                        author: d.author || {
                            name: 'Pillora Health Team',
                            role: 'Medical Reviewer'
                        },
                        mediaType: d.mediaType || 'image',
                        imageUrl: d.imageUrl,
                        videoUrl: d.videoUrl,
                        linkUrl: d.linkUrl,
                        tags: d.tags || ['Health'],
                        keyTakeaways: [],
                        sections: []
                    }));
                    setTips(mapped);
                } else {
                    // Fallback to top curated articles
                    setTips(HEALTH_HUB_ARTICLES.slice(0, 3));
                }
            } catch (error) {
                // Fallback to top curated articles
                setTips(HEALTH_HUB_ARTICLES.slice(0, 3));
            } finally {
                setLoading(false);
            }
        };

        fetchTips();
    }, []);

    const displayTips = tips.length > 0 ? tips : HEALTH_HUB_ARTICLES.slice(0, 3);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                            <ShieldCheck className="w-4 h-4" /> Doctor-Verified Insights
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Health Hub</h2>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">
                            Latest medical discoveries, clinical advice, and daily preventive care tips
                        </p>
                    </div>
                    <Link
                        href="/health-hub"
                        className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm"
                    >
                        View All Articles
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-96 rounded-2xl bg-gray-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayTips.map((tip) => (
                            <Link
                                href={`/health-hub/${tip._id}`}
                                key={tip._id}
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="relative h-48 w-full bg-blue-50 overflow-hidden">
                                    {tip.imageUrl ? (
                                        <Image
                                            src={tip.imageUrl}
                                            alt={tip.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-blue-200">
                                            <Activity className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md text-blue-700 text-[11px] font-bold rounded-lg shadow-sm">
                                            {tip.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-3">
                                        <div className="flex items-center gap-1.5 text-blue-600">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(tip.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {tip.readTime || '4 min read'}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                                        {tip.title}
                                    </h3>
                                    <p className="text-gray-600 line-clamp-2 text-sm flex-1 leading-relaxed">
                                        {tip.description}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                                        <span>Read Full Article</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center sm:hidden">
                    <Link
                        href="/health-hub"
                        className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm"
                    >
                        View All Articles
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
