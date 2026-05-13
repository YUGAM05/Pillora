"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Star, Check, ShieldCheck, Truck, AlertCircle, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import api from '@/lib/api';
import { addToCart } from '@/lib/cart';
import ShareButton from '@/components/ShareButton';
import Image from 'next/image';

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState<'desc' | 'directions' | 'safety' | 'faqs'>('desc');

    useEffect(() => {
        if (id) {
            api.get(`/products/${id}`)
                .then(res => {
                    setProduct(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

    const images = product.images && product.images.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : []);

    const scrollToDetails = () => {
        setActiveTab('desc');
        const element = document.getElementById('details-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Product Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden relative group">
                            {images.length > 0 ? (
                                <Image 
                                    src={images[selectedImage]} 
                                    alt={product.name} 
                                    fill 
                                    className="object-contain mix-blend-multiply" 
                                    unoptimized
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-20 h-20 rounded-lg border-2 flex-shrink-0 overflow-hidden relative ${selectedImage === idx ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-cover" unoptimized />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-6">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                {product.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-2">{product.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>By <span className="text-primary font-semibold">{product.manufacturer}</span></span>
                                <span>•</span>
                                <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-bold"}>
                                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-end gap-3 mb-6">
                            <span className="text-4xl font-bold text-gray-900">₹{product.sellingPrice}</span>
                            {product.actualPrice > product.sellingPrice && (
                                <>
                                    <span className="text-xl text-gray-400 line-through mb-1">₹{product.actualPrice}</span>
                                    <span className="text-green-600 font-bold mb-1">{product.discount}% OFF</span>
                                </>
                            )}
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {product.description?.slice(0, 150)}...
                            <button onClick={scrollToDetails} className="text-primary font-medium hover:underline ml-1">Read more</button>
                        </p>

                        <div className="flex gap-4 mb-8">
                            {product.stock <= 0 && (
                                <button
                                    disabled
                                    className="flex-1 bg-gray-200 text-gray-500 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 cursor-not-allowed"
                                >
                                    Out of Stock
                                </button>
                            )}
                            {product.stock > 0 && (
                                <button
                                    onClick={() => {
                                        addToCart({
                                            productId: product._id,
                                            name: product.name,
                                            price: product.sellingPrice,
                                            originalPrice: product.actualPrice,
                                            image: product.images?.[0] || product.imageUrl || '',
                                            category: product.category,
                                            stock: product.stock
                                        });
                                        router.push('/checkout');
                                    }}
                                    className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                >
                                    Buy Now
                                </button>
                            )}
                            <button className="p-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition">
                                <Heart className="w-6 h-6" />
                            </button>
                            <ShareButton
                                title={product.name}
                                text={`Check out ${product.name} on Pillora!`}
                                url={`/products/${product._id}`}
                                className="p-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition"
                            />
                        </div>
                        <div className="mt-2">
                            <div className="mt-2 text-center text-xs text-gray-500">
                                Secure transaction
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <ShieldCheck className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">100% Genuine</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <Truck className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">Fast Delivery</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs & Details */}
                <div id="details-section" className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex border-b overflow-x-auto">
                                {['desc', 'directions', 'safety', 'faqs'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`px-6 py-4 font-bold text-sm uppercase tracking-wide whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-primary text-primary bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {tab === 'desc' ? 'Description' : tab === 'faqs' ? 'FAQ' : tab + ' Information'}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 md:p-8 min-h-[300px]">
                                {activeTab === 'desc' && (
                                    <div className="prose max-w-none text-gray-600">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
                                        <p className="whitespace-pre-line">{product.description}</p>

                                        {product.returnPolicy && (
                                            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                                    <AlertCircle className="w-4 h-4" /> Return Policy
                                                </h4>
                                                <p className="text-sm">{product.returnPolicy}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'directions' && (
                                    <div className="prose max-w-none text-gray-600">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Directions for Use</h3>
                                        <p className="whitespace-pre-line">{product.directionsForUse || "No specific directions provided. Please consult your physician."}</p>
                                    </div>
                                )}

                                {activeTab === 'safety' && (
                                    <div className="prose max-w-none text-gray-600">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Safety Information</h3>
                                        <p className="whitespace-pre-line">{product.safetyInformation || "Keep out of reach of children. Store in a cool, dry place."}</p>
                                    </div>
                                )}

                                {activeTab === 'faqs' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                                        {product.faqs && product.faqs.length > 0 ? (
                                            product.faqs.map((faq: any, i: number) => (
                                                <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                                                    <h4 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                                                        <span className="text-primary">Q:</span> {faq.question}
                                                    </h4>
                                                    <p className="text-gray-600 pl-6">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 italic">No FAQs available for this product.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Seller Information</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-xl">
                                    {product?.seller?.name?.[0] || 'S'}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{product?.seller?.name || 'Verified Seller'}</div>
                                    <div className="text-xs text-green-600 flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Certified Pharmacy
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 space-y-2">
                                <div className="flex justify-between">
                                    <span>Established</span>
                                    <span className="font-medium text-gray-900">2023</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Rating</span>
                                    <span className="font-medium text-gray-900 flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.8/5</span>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div >
    )
}
