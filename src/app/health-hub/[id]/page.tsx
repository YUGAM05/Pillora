"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Calendar, 
    Loader2, 
    ArrowLeft, 
    Share2, 
    Clock, 
    Check, 
    ExternalLink, 
    BookOpen, 
    ShieldCheck, 
    ChevronRight, 
    Heart, 
    Tag, 
    Sparkles,
    HelpCircle,
    ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
    getHealthArticleById, 
    getRelatedHealthArticles, 
    HealthArticle 
} from '@/data/healthHubData';

export default function HealthTipDetailPage() {
    const params = useParams();
    const articleId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
    
    const [article, setArticle] = useState<HealthArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        if (!articleId) {
            setLoading(false);
            setError('Article identifier is missing.');
            return;
        }

        // 1. First check our local curated repository
        const curated = getHealthArticleById(articleId);
        if (curated) {
            setArticle(curated);
            setLoading(false);
            return;
        }

        // 2. Fallback to API if not in curated list
        const fetchApiTip = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/health-hub/${articleId}`,
                    { timeout: 3500 }
                );

                if (response.data) {
                    const d = response.data;
                    const mapped: HealthArticle = {
                        _id: d._id,
                        slug: d._id,
                        title: d.title,
                        description: d.description,
                        category: d.category || 'Clinical Guidance',
                        readTime: d.readTime || '4 min read',
                        date: d.date || new Date().toISOString(),
                        author: d.author || {
                            name: 'Pillora Health Team',
                            role: 'Medical Review Board',
                            avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
                        },
                        mediaType: d.mediaType || 'image',
                        imageUrl: d.imageUrl,
                        videoUrl: d.videoUrl,
                        linkUrl: d.linkUrl,
                        tags: d.tags || ['Healthcare', 'Wellness'],
                        keyTakeaways: [
                            'Evidence-based wellness recommendation reviewed by Pillora clinical experts.'
                        ],
                        sections: [
                            {
                                heading: 'Article Content',
                                paragraphs: d.description ? d.description.split('\n').filter(Boolean) : []
                            }
                        ]
                    };
                    setArticle(mapped);
                } else {
                    setError('Health article not found.');
                }
            } catch (err) {
                console.error('Error fetching tip details:', err);
                setError('Unable to load health article.');
            } finally {
                setLoading(false);
            }
        };

        fetchApiTip();
    }, [articleId]);

    const handleShare = async () => {
        if (!article) return;
        const shareData = {
            title: article.title,
            text: article.description,
            url: typeof window !== 'undefined' ? window.location.href : ''
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error("Error sharing:", err);
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareData.url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Error copying to clipboard:", err);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 text-sm font-semibold">Loading article details...</p>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-16 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Article not found'}</h2>
                <p className="text-gray-500 max-w-md mb-6">
                    The health resource you are looking for may have moved or been updated. Explore our full library of verified guides below.
                </p>
                <Link
                    href="/health-hub"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all"
                >
                    <ArrowLeft className="w-4 h-4" /> Return to Health Hub
                </Link>
            </div>
        );
    }

    const relatedArticles = getRelatedHealthArticles(article._id, article.category);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* 1. Breadcrumb Navigation */}
                <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium overflow-x-auto pb-1">
                    <Link href="/" className="hover:text-blue-600 shrink-0">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <Link href="/health-hub" className="hover:text-blue-600 shrink-0">Health Hub</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-blue-600 font-semibold truncate max-w-[200px] sm:max-w-none">
                        {article.category}
                    </span>
                </nav>

                {/* Back button */}
                <Link
                    href="/health-hub"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 font-semibold transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to All Articles
                </Link>

                {/* 2. Main Article Document */}
                <article className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                    
                    {/* Hero Media Section */}
                    {article.mediaType === 'video' && article.videoUrl ? (
                        <div className="relative w-full bg-black flex items-center justify-center border-b border-gray-100">
                            <video
                                src={article.videoUrl}
                                controls
                                className="w-full max-h-[480px] object-contain"
                            />
                        </div>
                    ) : article.imageUrl ? (
                        <div className="relative h-[320px] sm:h-[420px] w-full bg-slate-900">
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                priority
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                            
                            <div className="absolute bottom-0 left-0 p-6 sm:p-10 text-white w-full space-y-3">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold">
                                    <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-md rounded-lg uppercase tracking-wider text-[11px] font-black">
                                        {article.category}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg">
                                        <Clock className="w-3.5 h-3.5 text-blue-300" />
                                        {article.readTime}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg">
                                        <Calendar className="w-3.5 h-3.5 text-blue-300" />
                                        {new Date(article.date).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>

                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-snug drop-shadow-sm">
                                    {article.title}
                                </h1>
                            </div>
                        </div>
                    ) : null}

                    {/* Content Body */}
                    <div className="p-6 sm:p-10 md:p-12 space-y-8">
                        
                        {/* Title if no image */}
                        {!article.imageUrl && (
                            <div className="space-y-4 border-b border-gray-100 pb-6">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider rounded-lg">
                                        {article.category}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {article.readTime}
                                    </span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                                    {article.title}
                                </h1>
                            </div>
                        )}

                        {/* Author & Review Byline */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/60">
                            <div className="flex items-center gap-3.5">
                                {article.author?.avatar ? (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                                        <Image
                                            src={article.author.avatar}
                                            alt={article.author.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                                        {article.author.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                                            {article.author.name}
                                        </h4>
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">
                                        {article.author.role} • Medically Verified
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleShare}
                                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                                    copied
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                                }`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" /> Link Copied!
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="w-4 h-4 text-blue-600" /> Share Article
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Executive Summary */}
                        <div className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal italic border-l-4 border-blue-500 pl-4 py-1">
                            {article.description}
                        </div>

                        {/* Key Takeaways Callout Box */}
                        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200/80 rounded-2xl p-6 space-y-3">
                                <div className="flex items-center gap-2 text-amber-800 font-black text-xs uppercase tracking-wider">
                                    <Sparkles className="w-4 h-4 text-amber-600 fill-current" />
                                    Clinical Key Takeaways
                                </div>
                                <ul className="space-y-2.5">
                                    {article.keyTakeaways.map((takeaway, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5 text-sm text-amber-950 font-medium leading-relaxed">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                            <span>{takeaway}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Article Content Sections */}
                        <div className="space-y-8 pt-2">
                            {article.sections && article.sections.map((section, idx) => (
                                <section key={idx} className="space-y-4">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                                        {section.heading}
                                    </h2>

                                    {section.paragraphs.map((para, pIdx) => (
                                        <p key={pIdx} className="text-gray-600 leading-relaxed text-base sm:text-lg">
                                            {para}
                                        </p>
                                    ))}

                                    {section.bulletPoints && section.bulletPoints.length > 0 && (
                                        <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 my-4 space-y-2.5">
                                            {section.bulletPoints.map((point, bIdx) => (
                                                <div key={bIdx} className="flex items-start gap-3 text-sm sm:text-base text-gray-700 font-medium leading-relaxed">
                                                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                                                    <span>{point}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {section.callout && (
                                        <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 text-sm sm:text-base font-semibold leading-relaxed shadow-xs">
                                            {section.callout}
                                        </div>
                                    )}
                                </section>
                            ))}
                        </div>

                        {/* FAQs Accordion */}
                        {article.faqs && article.faqs.length > 0 && (
                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Frequently Asked Questions
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    {article.faqs.map((faq, idx) => {
                                        const isOpen = openFaq === idx;
                                        return (
                                            <div
                                                key={idx}
                                                className="border border-gray-200 rounded-2xl overflow-hidden transition-colors"
                                            >
                                                <button
                                                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                                                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-gray-900 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                                                >
                                                    <span>{faq.question}</span>
                                                    <span className="text-blue-600 font-bold ml-4">
                                                        {isOpen ? '−' : '+'}
                                                    </span>
                                                </button>
                                                {isOpen && (
                                                    <div className="p-4 sm:p-5 pt-0 text-sm sm:text-base text-gray-600 leading-relaxed bg-gray-50/50 border-t border-gray-100">
                                                        {faq.answer}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                                    <Tag className="w-3 h-3" /> Tags:
                                </span>
                                {article.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Medical Advisory Box */}
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-500 leading-relaxed space-y-1">
                            <p className="font-bold text-slate-700 uppercase tracking-wider">
                                Medical Advisory & Clinical Review
                            </p>
                            <p>
                                This article is published by Pillora’s Medical Communications Board in consultation with verified clinicians. It does not replace individualized clinical diagnosis. If you are experiencing concerning symptoms, consult a doctor or emergency services immediately.
                            </p>
                        </div>
                    </div>
                </article>

                {/* 3. Related Articles Recommendations */}
                {relatedArticles.length > 0 && (
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                Recommended in {article.category}
                            </h3>
                            <Link
                                href="/health-hub"
                                className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((rel) => (
                                <Link
                                    key={rel._id}
                                    href={`/health-hub/${rel._id}`}
                                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group"
                                >
                                    <div className="relative h-40 w-full bg-gray-100">
                                        {rel.imageUrl ? (
                                            <Image
                                                src={rel.imageUrl}
                                                alt={rel.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                                                <Heart className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-2">
                                            <span>{rel.category}</span>
                                            <span>{rel.readTime}</span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-base mb-2">
                                            {rel.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 line-clamp-2 flex-1">
                                            {rel.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Bottom Feedback widget */}
                <div className="text-center pt-6">
                    <p className="text-sm text-gray-500 mb-3">Was this health guide informative?</p>
                    <div className="inline-flex items-center gap-3">
                        <button
                            onClick={() => alert('Thank you for your feedback!')}
                            className="px-5 py-2 rounded-full border border-gray-200 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 font-semibold text-xs shadow-xs transition-colors"
                        >
                            👍 Yes, very helpful
                        </button>
                        <button
                            onClick={() => alert('Thank you! We will continue improving our health content.')}
                            className="px-5 py-2 rounded-full border border-gray-200 bg-white text-gray-700 hover:border-gray-400 font-semibold text-xs shadow-xs transition-colors"
                        >
                            👎 Needs more detail
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
