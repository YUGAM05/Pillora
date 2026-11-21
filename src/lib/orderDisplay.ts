/**
 * Orders come back from the backend in its own shape
 * ({ medicines, total_amount, delivery_address, status, payment_status, user_id }),
 * while older pages were written for a legacy shape
 * ({ items, totalAmount, shippingAddress, orderStatus, paymentMethod }).
 * toDisplayOrder fills the legacy fields from whichever shape is present so the
 * order pages render either kind without crashing.
 */

export interface DisplayOrderItem {
    productId?: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    product?: any;
}

export interface DisplayOrder {
    _id: string;
    createdAt: string;
    status: string;
    orderStatus: string;
    paymentStatus: string;
    paymentMethod: string;
    totalAmount: number;
    items: DisplayOrderItem[];
    shippingAddress: {
        fullName?: string;
        phone?: string;
        email?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        pinCode?: string;
    };
    [key: string]: any;
}

const num = (v: unknown): number => {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
};

const idOf = (v: any): string | undefined => {
    if (!v) return undefined;
    if (typeof v === 'string') return v;
    if (v._id) return String(v._id);
    return String(v);
};

export function toDisplayOrder(raw: any): DisplayOrder {
    const o = raw || {};

    const sourceItems: any[] = Array.isArray(o.items) && o.items.length
        ? o.items
        : Array.isArray(o.medicines) ? o.medicines : [];

    const items: DisplayOrderItem[] = sourceItems.map((it: any) => ({
        productId: idOf(it.productId) || idOf(it.product) || idOf(it.medicine_id),
        name: it.name || it.product?.name || 'Item',
        quantity: num(it.quantity) || 1,
        price: num(it.price),
        image: it.image,
        product: it.product,
    }));

    const buyer = o.user_id && typeof o.user_id === 'object' ? o.user_id : (o.user && typeof o.user === 'object' ? o.user : {});

    const shippingAddress = o.shippingAddress && typeof o.shippingAddress === 'object'
        ? o.shippingAddress
        : {
            fullName: buyer.name,
            phone: buyer.phone,
            email: buyer.email,
            addressLine1: typeof o.delivery_address === 'string' ? o.delivery_address : undefined,
        };

    const status = String(o.status || o.orderStatus || 'pending');
    const paymentStatus = String(o.payment_status || o.paymentStatus || 'pending');

    return {
        ...o,
        _id: String(o._id || ''),
        createdAt: o.createdAt || new Date().toISOString(),
        status,
        orderStatus: String(o.orderStatus || o.status || 'pending'),
        paymentStatus,
        // Legacy pages treat anything other than 'cod' as paid, so only report
        // non-COD when the backend actually says the order is paid.
        paymentMethod: o.paymentMethod || (paymentStatus === 'paid' ? 'online' : 'cod'),
        totalAmount: num(o.totalAmount ?? o.total_amount),
        items,
        shippingAddress,
    };
}
