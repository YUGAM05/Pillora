"use client";
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import dynamic from 'next/dynamic';
import { Package, Truck, MapPin, ChevronLeft, Phone, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const OrderMap = dynamic(() => import('@/components/OrderMap'), {
    ssr: false,
    loading: () => <div className="h-[400px] bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center text-gray-400">Loading Tracking Map...</div>
});

export default function TrackOrderPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = useCallback(async () => {
        try {
            const res = await api.get(`/orders/${id}`);
            setOrder(res.data);
        } catch (err) {
            console.error("Error fetching order tracking:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOrder();
        const interval = setInterval(fetchOrder, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, [fetchOrder]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;
    if (!order) return <div className="p-10 text-center">Order not found.</div>;

    const seller = order.items[0]?.product?.seller;
    const deliveryPartner = order.assignedDelivery;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/my-orders" className="p-2 hover:bg-white rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Track Your <span className="text-blue-600 italic">Order</span></h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Map & Journey */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100">
                            <OrderMap
                                sellerLocation={seller?.location}
                                customerLocation={order.shippingLocation || order.user?.location}
                                deliveryLocation={deliveryPartner?.location}
                                orderStatus={order.orderStatus}
                            />
                        </div>

                        {/* Status Timeline */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                Delivery Progress
                            </h3>
                            <div className="space-y-8">
                                <StatusStep
                                    active={['pending', 'confirmed', 'shipped', 'out_for_pickup', 'picked_up', 'out_for_delivery', 'delivered'].includes(order.orderStatus)}
                                    title="Order Confirmed"
                                    desc="We've received your order and it's being processed."
                                />
                                <StatusStep
                                    active={['out_for_pickup', 'picked_up', 'out_for_delivery', 'delivered'].includes(order.orderStatus)}
                                    title="Out for Pickup"
                                    desc="A delivery partner has been assigned and is heading to the pharmacy."
                                />
                                <StatusStep
                                    active={['picked_up', 'out_for_delivery', 'delivered'].includes(order.orderStatus)}
                                    title="Picked Up"
                                    desc="Your medicines are with our partner and on the way."
                                />
                                <StatusStep
                                    active={order.orderStatus === 'delivered'}
                                    title="Delivered"
                                    desc="Order successfully delivered to your doorstep."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Partner Info */}
                    <div className="space-y-6">
                        <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Truck className="w-24 h-24" />
                            </div>
                            <h4 className="font-black uppercase text-[10px] tracking-widest opacity-80 mb-6">Delivery Specialist</h4>
                            {deliveryPartner ? (
                                <div className="space-y-4 relative z-10">
                                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20">
                                        <Truck className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black">{deliveryPartner.name}</p>
                                        <div className="flex items-center gap-1 text-blue-100 text-xs font-bold">
                                            <ShieldCheck className="w-3 h-3 text-green-300" /> Verified Partner
                                        </div>
                                    </div>
                                    <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                                        <Phone className="w-4 h-4" /> Call Partner
                                    </button>
                                </div>
                            ) : (
                                <div className="py-10 text-center relative z-10">
                                    <div className="animate-pulse bg-white/10 h-2 rounded-full mb-4" />
                                    <p className="font-bold text-sm">Finding best partner for you...</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-widest mb-6">Order Details</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery To</p>
                                    <p className="font-bold text-sm text-gray-800">{order.shippingAddress?.fullName}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">{order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}</p>
                                </div>
                                <div className="pt-4 border-t border-gray-50">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</p>
                                    {order.items.map((item: any, i: number) => (
                                        <p key={i} className="text-sm font-bold text-gray-800">{item.name} <span className="text-blue-600">x{item.quantity}</span></p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusStep({ active, title, desc }: { active: boolean, title: string, desc: string }) {
    return (
        <div className="flex gap-4 group">
            <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${active ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-600/20' : 'bg-gray-100 text-gray-300'}`}>
                    <Package className="w-5 h-5" />
                </div>
                <div className={`w-0.5 h-12 my-2 rounded-full ${active ? 'bg-blue-600/20' : 'bg-gray-50'}`} />
            </div>
            <div className="pt-1">
                <p className={`font-black text-sm tracking-tight ${active ? 'text-gray-900' : 'text-gray-300'}`}>{title}</p>
                <p className={`text-xs mt-1 leading-relaxed ${active ? 'text-gray-500' : 'text-gray-300'}`}>{desc}</p>
            </div>
        </div>
    );
}
