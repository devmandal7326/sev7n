import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { Order, PaymentMethod } from '../types';
import { 
  X, 
  ArrowLeft,
  MapPin, 
  Phone, 
  MessageSquare, 
  Store, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onSuccess }) => {
  const { cart, subtotal, clearCart } = useCart();
  const { settings, showToast, refreshProducts } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Jaipur');
  const [state, setState] = useState('Rajasthan');
  const [pincode, setPincode] = useState('302020');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('whatsapp');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState<string | null>(null);

  // Calculate pricing
  const isPickup = paymentMethod === 'store_pickup';
  const freeThreshold = settings.freeShippingThreshold;
  const standardFee = settings.standardShippingFee;
  const isFreeDelivery = subtotal >= freeThreshold;
  const shippingFee = isPickup ? 0 : (isFreeDelivery ? 0 : standardFee);
  const finalTotal = subtotal + shippingFee;

  const validate = (): boolean => {
    setFormError(null);
    if (!fullName.trim() || fullName.trim().length < 3) {
      setFormError('Please enter your full customer name.');
      return false;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number for order delivery coordination.');
      return false;
    }
    if (!addressLine.trim()) {
      setFormError('Please provide your complete delivery street address.');
      return false;
    }
    if (!pincode.trim() || pincode.trim().length < 6) {
      setFormError('Please enter a valid 6-digit postal PIN code.');
      return false;
    }
    return true;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          addressLine: addressLine.trim(),
          landmark: landmark.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim()
        },
        items: cart.map(item => ({
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity
        })),
        paymentMethod
      };

      // Server processes stock verification & creates order
      const result = await api.createOrder(payload);

      if (result.success && result.order) {
        setCreatedOrder(result.order);
        setGeneratedWhatsAppUrl(result.whatsappUrl);
        clearCart();
        refreshProducts();
        showToast(`Order #${result.order.orderNumber} successfully registered!`, 'success');
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to place order. Please review your cart.');
      showToast(err.message || 'Error creating order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#121216] border border-neutral-800 rounded-lg shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Back Button */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!createdOrder && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-700/80 rounded transition-colors cursor-pointer"
                title="Go back to Shopping Bag"
                aria-label="Back to shopping bag"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
            <div>
              <h2 className="font-display text-lg font-bold text-white tracking-tight">
                {createdOrder ? 'Order Confirmed' : 'Checkout & Delivery'}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Sev7n (सेव7न) Flagship · Mansarovar, Jaipur
              </p>
            </div>
          </div>
          <button
            onClick={createdOrder ? onSuccess : onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-md transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {createdOrder ? (
            /* Order Success View */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950/70 border border-emerald-800 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Order Registered Successfully
                </h3>
                <p className="text-sm text-neutral-300 mt-1">
                  Official Order Reference: <strong className="text-white font-mono">{createdOrder.orderNumber}</strong>
                </p>
              </div>

              {/* Order Verification Notice */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-xs text-left text-neutral-300 space-y-2">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Important Store Policy: </span>
                    <span>
                      As an authentic local brand, your order is pending confirmation until our Mansarovar team inspects the inventory and acknowledges dispatch or in-store readiness.
                    </span>
                  </div>
                </div>
                <p className="text-neutral-400 pt-1">
                  Deliver to: <strong className="text-white">{createdOrder.customer.fullName}</strong> ({createdOrder.customer.phone}) at {createdOrder.customer.addressLine}, {createdOrder.customer.city}.
                </p>
                <div className="pt-2 border-t border-neutral-800 flex justify-between font-medium">
                  <span>Total Amount:</span>
                  <span className="text-white font-bold tabular-nums">₹{createdOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* WhatsApp Trigger Button */}
              {generatedWhatsAppUrl && (
                <div className="space-y-2">
                  <a
                    href={generatedWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Order to Store on WhatsApp (+91 86198 90774)</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-[11px] text-neutral-400">
                    Sends your pre-formatted order summary directly to our Jaipur desk for immediate preparation.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-4 pt-4 border-t border-neutral-800 text-xs">
                <button
                  onClick={onSuccess}
                  className="px-5 py-2.5 text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-700 rounded-md cursor-pointer transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              {formError && (
                <div className="p-3 rounded-md bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Order Items Snapshot */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-md p-3.5 text-xs">
                <div className="flex justify-between items-center mb-2 text-neutral-400 font-medium">
                  <span>Order Summary ({cart.length} unique items)</span>
                  <span className="tabular-nums font-bold text-white">Subtotal: ₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-2 py-1.5 rounded shrink-0">
                      <img src={item.image} alt="" className="w-7 h-9 object-cover rounded" />
                      <div className="text-[11px] leading-tight">
                        <span className="font-semibold text-white block truncate max-w-[120px]">{item.name}</span>
                        <span className="text-neutral-400">{item.size} · Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact & Personal Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  1. Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Mobile Number (WhatsApp) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-neutral-400 font-mono">+91</span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="86198 90774"
                        className="w-full pl-11 pr-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For invoice and tracking notifications"
                    className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  2. Shipping Destination
                </h3>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Street Address / Flat / Building *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="House/Plot No., Colony, Street Name"
                    className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="302020"
                      maxLength={6}
                      className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Nearby Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Swarn Path Circle / Shukalpura"
                    className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  3. Select Payment & Fulfillment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* WhatsApp Order */}
                  <label 
                    onClick={() => setPaymentMethod('whatsapp')}
                    className={`p-3 rounded-lg border flex flex-col justify-between cursor-pointer transition-colors ${
                      paymentMethod === 'whatsapp'
                        ? 'border-white bg-neutral-900 text-white'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-white">WhatsApp Confirmation</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Submit order details and confirm inventory directly with our Jaipur team via WhatsApp.
                    </p>
                  </label>

                  {/* Store Pickup */}
                  <label 
                    onClick={() => setPaymentMethod('store_pickup')}
                    className={`p-3 rounded-lg border flex flex-col justify-between cursor-pointer transition-colors ${
                      paymentMethod === 'store_pickup'
                        ? 'border-white bg-neutral-900 text-white'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Store className="w-4 h-4 text-neutral-300" />
                      <span className="text-xs font-semibold text-white">Store Pickup (Complimentary)</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Collect in person at 24/27 Swarn Path, Mansarovar, Jaipur today before 10 PM.
                    </p>
                  </label>

                  {/* Razorpay Gateway */}
                  <label 
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`p-3 rounded-lg border flex flex-col justify-between cursor-pointer transition-colors ${
                      paymentMethod === 'razorpay'
                        ? 'border-white bg-neutral-900 text-white'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-semibold text-white">Razorpay Online Gateway</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Secure checkout architecture. Demonstrates signature verification flow.
                    </p>
                  </label>

                  {/* Cash on Delivery (Restricted per prompt instructions) */}
                  <div className={`p-3 rounded-lg border flex flex-col justify-between ${
                    settings.cashOnDeliveryEnabled 
                      ? 'border-neutral-800 bg-neutral-950 cursor-pointer' 
                      : 'border-neutral-850 bg-neutral-950/60 opacity-60 cursor-not-allowed'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-neutral-500" />
                        <span className="text-xs font-semibold text-neutral-400">Cash on Delivery</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 uppercase font-mono">
                        {settings.cashOnDeliveryEnabled ? 'Available' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      {settings.cashOnDeliveryEnabled 
                        ? 'Pay upon delivery at your doorstep.'
                        : 'Currently disabled until confirmed by store ownership (Admin toggleable).'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Cost Breakdown */}
              <div className="p-4 rounded bg-neutral-950 border border-neutral-800 text-xs space-y-1.5">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Fee</span>
                  <span className="tabular-nums text-white">
                    {shippingFee === 0 ? <span className="text-emerald-400">FREE</span> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-neutral-800">
                  <span>Final Payable Amount</span>
                  <span className="tabular-nums">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 text-xs font-semibold text-neutral-950 bg-white rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Validating with Jaipur Server...</span>
                  ) : (
                    <>
                      <span>Place Order (₹{finalTotal.toLocaleString('en-IN')})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-neutral-400 mt-2">
                  No hidden charges · All orders verified directly by Sev7n Mansarovar team
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
