"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCartItems, getCartTotal, clearCart, CartItem } from '@/lib/cart';
import api from '@/lib/api';
import { getUser } from '@/lib/tokenStorage';
import Link from 'next/link';
import { ArrowLeft, MapPin, CreditCard, CheckCircle, Truck, Package, Navigation, Loader2, Ticket, X } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const AddressMap = dynamic(() => import('@/components/AddressMap'), { ssr: false });

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponData, setCouponData] = useState<any>(null);
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [couponError, setCouponError] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pinCode: '',
        addressType: 'home',
        paymentMethod: 'cod',
        notes: ''
    });

    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [geoLoading, setGeoLoading] = useState(false);


    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        // Check authentication
        const storedUser = getUser();
        if (!storedUser) {
            router.push('/login?redirect=/checkout');
            return;
        }
        const userData = JSON.parse(storedUser);
        setUser(userData);

        // Pre-fill user data
        setFormData(prev => ({
            ...prev,
            fullName: userData.name || '',
            email: userData.email || ''
        }));

        // Load cart
        const items = getCartItems();
        if (items.length === 0) {
            router.push('/cart');
            return;
        }
        setCartItems(items);
        setTotal(getCartTotal());
    }, [router]);

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(formData.phone))
            newErrors.phone = 'Phone must be 10 digits';

        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = 'Email is invalid';

        if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.pinCode.trim()) newErrors.pinCode = 'PIN Code is required';
        else if (!/^\d{6}$/.test(formData.pinCode))
            newErrors.pinCode = 'PIN Code must be 6 digits';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchLocation = () => {
        setGeoLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setGeoLoading(false);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    alert('Could not get location. Please enable GPS.');
                    setGeoLoading(false);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
            setGeoLoading(false);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setValidatingCoupon(true);
        setCouponError('');
        try {
            const res = await api.post('/coupons/validate', {
                code: couponCode,
                orderAmount: total
            });
            setCouponData(res.data);
        } catch (err: any) {
            setCouponError(err.response?.data?.message || 'Invalid coupon code');
            setCouponData(null);
        } finally {
            setValidatingCoupon(false);
        }
    };

    const removeCoupon = () => {
        setCouponData(null);
        setCouponCode('');
        setCouponError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fill all required fields correctly');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                shippingAddress: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    email: formData.email,
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2,
                    city: formData.city,
                    state: formData.state,
                    pinCode: formData.pinCode,
                    addressType: formData.addressType
                },
                shippingLocation: location,
                totalAmount: total + 10 - (couponData?.discountAmount || 0),
                paymentMethod: formData.paymentMethod,
                notes: formData.notes,
                couponCode: couponData?.code,
                discountAmount: couponData?.discountAmount || 0
            };

            const response = await api.post('/orders', orderData);
            const orderId = response.data._id;

            clearCart();
            router.push(`/order-success/${orderId}`);
        } catch (error: any) {
            console.error('Order error:', error);
            alert(error.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev: any) => ({ ...prev, [name]: '' }));
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-900">Cart</span>
                        </div>
                        <div className="w-16 h-1 bg-blue-600"></div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                2
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-900">Checkout</span>
                        </div>
                        <div className="w-16 h-1 bg-gray-200"></div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">
                                3
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-500">Complete</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-6 h-6 text-blue-600" />
                                        <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={fetchLocation}
                                        disabled={geoLoading}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${location
                                            ? 'bg-green-50 text-green-600 border border-green-100'
                                            : 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 shadow-sm shadow-blue-100'
                                            }`}
                                    >
                                        {geoLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : location ? (
                                            <CheckCircle className="w-4 h-4" />
                                        ) : (
                                            <Navigation className="w-4 h-4" />
                                        )}
                                        {location ? 'Location Pinned' : 'Pin Precise Location'}
                                    </button>
                                </div>

                                {location && (
                                    <>
                                        <div className="mb-6 p-3 bg-green-50/50 border border-green-100 rounded-xl flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-green-800">GPS Coordinates Captured</p>
                                                <p className="text-[10px] text-green-600">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <AddressMap location={location} />
                                        </div>
                                    </>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter full name"
                                        />
                                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            maxLength={10}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="10 digit mobile number"
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="your@email.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address Line 1 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="addressLine1"
                                            value={formData.addressLine1}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="House no., Building name, Street"
                                        />
                                        {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address Line 2 (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="addressLine2"
                                            value={formData.addressLine2}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Landmark, Area"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.city ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter city"
                                        />
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.state ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value="">Select State</option>
                                            {INDIAN_STATES.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            PIN Code <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="pinCode"
                                            value={formData.pinCode}
                                            onChange={handleChange}
                                            maxLength={6}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.pinCode ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="6 digit PIN code"
                                        />
                                        {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address Type
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="addressType"
                                                    value="home"
                                                    checked={formData.addressType === 'home'}
                                                    onChange={handleChange}
                                                    className="mr-2"
                                                />
                                                Home
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="addressType"
                                                    value="office"
                                                    checked={formData.addressType === 'office'}
                                                    onChange={handleChange}
                                                    className="mr-2"
                                                />
                                                Office
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <CreditCard className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                                </div>

                                <div className="space-y-3">
                                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleChange}
                                            className="mr-3"
                                        />
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900">Cash on Delivery (COD)</p>
                                            <p className="text-sm text-gray-500">Pay when you receive the order</p>
                                        </div>
                                        <Truck className="w-6 h-6 text-blue-600" />
                                    </label>
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Any special instructions for delivery..."
                                />
                            </div>

                            {/* Place Order Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Place Order
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="w-5 h-5 text-gray-600" />
                                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                            </div>

                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {cartItems.map(item => (
                                    <div key={item.productId} className="flex gap-3 pb-3 border-b">
                                        <Image
                                            src={item.image || '/placeholder.png'}
                                            alt={item.name}
                                            width={64}
                                            height={64}
                                            className="w-16 h-16 object-cover rounded-lg"
                                            unoptimized
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm text-gray-900 line-clamp-2">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Platform Fee</span>
                                    <span className="font-medium text-blue-600">₹10.00</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                                {couponData && (
                                    <div className="flex justify-between text-green-600 font-bold">
                                        <span>Discount ({couponData.code})</span>
                                        <span>- ₹{couponData.discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-900">
                                    <span>Total</span>
                                    <span className="text-blue-600">₹{(total + 10 - (couponData?.discountAmount || 0)).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Coupon Section */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <Ticket className="w-4 h-4 text-gray-600" />
                                    <p className="text-sm font-bold text-gray-900">Apply Coupon Code</p>
                                </div>
                                {couponData ? (
                                    <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-green-800">Coupon &quot;{couponData.code}&quot; Applied!</p>
                                            <p className="text-[10px] text-green-600">You saved ₹{couponData.discountAmount.toFixed(2)}</p>
                                        </div>
                                        <button onClick={removeCoupon} className="p-2 hover:bg-green-100 rounded-lg text-green-700">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter coupon code"
                                                className={`flex-1 px-4 py-2 bg-gray-50 border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase ${couponError ? 'border-red-500' : 'border-gray-200'}`}
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={validatingCoupon || !couponCode}
                                                className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition disabled:opacity-50"
                                            >
                                                {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                            </button>
                                        </div>
                                        {couponError && <p className="text-red-500 text-[10px] font-bold">{couponError}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="text-xs text-gray-500">
                                By placing this order, you agree to our Terms & Conditions
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
