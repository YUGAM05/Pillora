"use client";
import { useState, useEffect } from 'react';
import { getCartItems, updateCartQuantity, removeFromCart, getCartTotal, CartItem } from '@/lib/cart';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import Image from 'next/image';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);

    const loadCart = () => {
        setCartItems(getCartItems());
        setTotal(getCartTotal());
    };

    useEffect(() => {
        loadCart();

        const handleCartUpdate = () => loadCart();
        window.addEventListener('cart:updated', handleCartUpdate);
        return () => window.removeEventListener('cart:updated', handleCartUpdate);
    }, []);

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pb-20">
                <ShoppingBag className="w-32 h-32 text-gray-300 mb-6" />
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 text-lg">Start shopping to add items to your cart!</p>
                <Link
                    href="/"
                    className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <span className="ml-auto text-gray-500">({cartItems.length} items)</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <CartItemCard key={item.productId} item={item} onUpdate={loadCart} />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                                    <span>Total</span>
                                    <span className="text-blue-600">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link href="/checkout" className="block">
                                <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>

                             <Link
                                href="/"
                                className="block text-center text-blue-600 font-medium hover:underline"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CartItemCard({ item, onUpdate }: { item: CartItem; onUpdate: () => void }) {
    const handleQuantityChange = (newQuantity: number) => {
        updateCartQuantity(item.productId, newQuantity);
        onUpdate();
    };

    const handleRemove = () => {
        if (confirm('Remove this item from cart?')) {
            removeFromCart(item.productId);
            onUpdate();
        }
    };

    const subtotal = item.price * item.quantity;
    const savings = item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Product Image */}
                <Link href={`/products/${item.productId}`} className="flex-shrink-0 self-start">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl overflow-hidden shadow-inner">
                        {item.image ? (
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl sm:text-4xl">
                                📦
                            </div>
                        )}
                    </div>
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                        <Link href={`/products/${item.productId}`} className="flex-1">
                            <h3 className="font-bold text-gray-900 text-base sm:text-lg hover:text-blue-600 transition line-clamp-2">
                                {item.name}
                            </h3>
                        </Link>
                        {/* Subtotal on Desktop */}
                        <div className="hidden sm:block text-right flex-shrink-0">
                            <p className="text-xl font-black text-blue-600 tracking-tight">₹{subtotal.toFixed(2)}</p>
                            {savings > 0 && (
                                <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Save ₹{savings.toFixed(2)}</p>
                            )}
                        </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4 font-medium">{item.category}</p>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Quantity & Controls */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                            <div className="flex items-center gap-1 border border-gray-100 bg-gray-50/50 rounded-xl p-1 shadow-sm">
                                <button
                                    onClick={() => handleQuantityChange(item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="p-2 hover:bg-white text-gray-400 hover:text-blue-600 rounded-lg transition-all disabled:opacity-30 disabled:pointer-events-none"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-black text-gray-900 w-8 text-center text-sm">{item.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(item.quantity + 1)}
                                    disabled={item.quantity >= item.stock}
                                    className="p-2 hover:bg-white text-gray-400 hover:text-blue-600 rounded-lg transition-all disabled:opacity-30 disabled:pointer-events-none"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={handleRemove}
                                className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2 group"
                            >
                                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Remove</span>
                            </button>
                        </div>

                        {/* Subtotal on Mobile */}
                        <div className="sm:hidden text-right">
                            <p className="text-lg font-black text-blue-600 tracking-tight">₹{subtotal.toFixed(2)}</p>
                            {savings > 0 && (
                                <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Save ₹{savings.toFixed(2)}</p>
                            )}
                        </div>
                    </div>

                    {item.quantity >= item.stock && (
                        <p className="text-[10px] text-red-500 mt-3 font-black uppercase tracking-widest bg-red-50 w-fit px-2 py-1 rounded">Stock Limit Reached</p>
                    )}
                </div>
            </div>
        </div>
    );
}
