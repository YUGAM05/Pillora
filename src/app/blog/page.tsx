"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Droplets,
    Pill,
    Cpu,
    MapPin,
    Search,
    User,
    ArrowRight,
    Clock,
    Heart,
    Share2,
    Bookmark,
    AlertCircle,
    CheckCircle2,
    ShieldCheck,
    Loader2,
    BookOpen
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

interface Blog {
    _id: string;
    title: string;
    description: string;
    category: string;
    imageUrl?: string;
    author: string;
    authorRole?: string;
    readTime: string;
    date: string;
}

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await api.get('/blogs');
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ["All", "Life-Saver Series", "Healthcare Guides", "Tech & Innovation", "Local Focus", "Health"];

    const filteredPosts = blogs.filter(post => {
        const matchesCategory = activeCategory === "All" || post.category === activeCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "Life-Saver Series": return <Droplets className="w-5 h-5" />;
            case "Healthcare Guides": return <BookOpen className="w-5 h-5" />;
            case "Tech & Innovation": return <Cpu className="w-5 h-5" />;
            case "Local Focus": return <MapPin className="w-5 h-5" />;
            default: return <BookOpen className="w-5 h-5" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Life-Saver Series": return "bg-red-50 text-red-600";
            case "Healthcare Guides": return "bg-blue-50 text-blue-600";
            case "Tech & Innovation": return "bg-purple-50 text-purple-600";
            case "Local Focus": return "bg-emerald-50 text-emerald-600";
            default: return "bg-blue-50 text-blue-600";
        }
    };

    return (
        <main className="min-h-screen bg-slate-50">
            {/* 1. Dynamic Hero Header */}
            <section className="relative py-24 px-6 overflow-hidden bg-white border-b border-gray-100">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] -mr-96 -mt-96 opacity-60" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50 rounded-full blur-[120px] -ml-96 -mb-96 opacity-60" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={fadeIn}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 text-blue-600 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 border border-blue-600/20">
                            Knowledge is Power
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-8 leading-[0.9] tracking-tighter">
                            Pillora <span className="text-blue-600">Insights.</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                            Your guide to modern healthcare in 2026. From life-saving blood connect tips to the latest innovations in health tech.
                        </p>

                        {/* Search & Filter Bar */}
                        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
                            <div className="relative w-full max-w-md group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search articles, guides, series..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100/10 focus:border-blue-600 transition-all font-medium shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeCategory === cat
                                        ? "bg-gray-900 text-white shadow-lg"
                                        : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. Blog Grid */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {loading ? null : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredPosts.map((post) => (
                                    <motion.article
                                        layout
                                        key={post._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                        className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden"
                                    >
                                        <Link href={`/blog/${post._id}`} className="flex flex-col h-full">
                                            {/* Header: Category & Icon */}
                                            <div className="p-8 pb-4">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getCategoryColor(post.category)}`}>
                                                        {getCategoryIcon(post.category)} {post.category}
                                                    </div>
                                                    <button className="text-gray-300 hover:text-red-500 transition-colors" onClick={(e) => { e.preventDefault(); /* Like logic? */ }}>
                                                        <Heart className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                                                    {post.title}
                                                </h3>
                                                <p className="text-gray-500 font-medium leading-relaxed line-clamp-3">
                                                    {post.description}
                                                </p>
                                            </div>

                                            {/* Visual Element: Image if exists */}
                                            <div className="px-8 mb-4 overflow-hidden">
                                                {post.imageUrl ? (
                                                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                                        <Image src={post.imageUrl} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-1 bg-gray-50 rounded-full" />
                                                )}
                                            </div>

                                            {/* Footer: Author Bio & Date */}
                                            <div className="p-8 pt-0 mt-auto">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-200 group-hover:rotate-12 transition-transform">
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900">{post.author}</p>
                                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{post.authorRole || 'Contributor'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest pt-4 border-t border-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3 h-3" /> {post.readTime}
                                                    </div>
                                                    <span>{new Date(post.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.article>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {!loading && filteredPosts.length === 0 && (
                        <div className="text-center py-32">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">No matching insights</h3>
                            <p className="text-gray-500 font-medium">Try searching for different keywords or categories.</p>
                        </div>
                    )}
                </div>
            </section>

        </main>
    );
}
