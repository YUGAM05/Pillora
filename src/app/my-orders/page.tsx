"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { format } from "date-fns";
import { Package, Truck, CheckCircle, Clock, ChevronRight, ShoppingBag } from "lucide-react";
import { toDisplayOrder } from "@/lib/orderDisplay";

interface Order {
    _id: string;
    items: any[];
    totalAmount: number;
    status: string;
    createdAt: string;
    paymentMethod: string;
}

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // The backend lists the current user's orders at /orders/my (GET /orders does not exist)
                const res = await api.get("/orders/my");
                setOrders(Array.isArray(res.data) ? res.data.map(toDisplayOrder) : []);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setLoadError("We couldn't load your orders right now. Please try again in a moment.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <ShoppingBag className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                </div>

                {loadError ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-red-100 shadow-sm">
                        <p className="text-gray-700 mb-6">{loadError}</p>
                        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                            Retry
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-12 h-12 text-blue-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-8">Looks like you haven&apos;t placed any orders yet.</p>
                        <Link href="/">
                            <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                                Back to Home
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <Link href={`/order-success/${order._id}`} key={order._id}>
                                <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-8 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 group cursor-pointer relative overflow-hidden">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">

                                        {/* Decorative Background Element */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Left: ID & Date */}
                                        <div className="flex items-start gap-4 sm:gap-6 relative z-10">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-500 shadow-sm">
                                                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 group-hover:text-white transition-colors" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <p className="font-black text-gray-900 text-base sm:text-xl tracking-tight">Order #{order._id.slice(-8).toUpperCase()}</p>
                                                    <div className="lg:hidden ml-auto">
                                                        <p className="text-xl font-black text-blue-600 tracking-tighter">₹{order.totalAmount.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">
                                                    Manifested on {format(new Date(order.createdAt), "MMMM d, yyyy")}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest
                                                         ${order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                            order.status === 'processing' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                                order.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                                    'bg-amber-50 text-amber-600 border border-amber-100'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                    {['processing', 'out_for_pickup', 'picked_up', 'out_for_delivery'].includes(order.status) && (
                                                        <Link href={`/my-orders/track/${order._id}`} onClick={(e) => e.stopPropagation()}>
                                                            <span className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-blue-600 transition-all tracking-widest uppercase shadow-lg shadow-slate-200 hover:shadow-blue-200">
                                                                Live Tracker
                                                            </span>
                                                        </Link>
                                                    )}
                                                    <span className="h-1 w-1 bg-gray-300 rounded-full hidden sm:block" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.items.length} Units</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Amount & Arrow (Desktop only for amount, arrow stays) */}
                                        <div className="flex items-center justify-between lg:justify-end gap-6 sm:gap-10 border-t lg:border-none pt-4 lg:pt-0 border-gray-50">
                                            <div className="hidden lg:text-right lg:block">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Net Total</p>
                                                <p className="text-2xl font-black text-blue-600 tracking-tighter">₹{order.totalAmount.toFixed(2)}</p>
                                            </div>
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors ml-auto lg:ml-0">
                                                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
