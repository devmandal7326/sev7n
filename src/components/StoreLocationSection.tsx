import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  MessageSquare, 
  Send, 
  Check, 
  Star,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';

export const StoreLocationSection: React.FC = () => {
  const { settings, openWhatsAppChat, showToast, goBack, currentPage } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Store Visit Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast('Please fill in name, phone, and your message', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.sendContactMessage({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        subject: subject.trim(),
        message: message.trim()
      });

      if (res.success) {
        setSubmitted(true);
        setName('');
        setPhone('');
        setEmail('');
        setMessage('');
        showToast('Message sent to Sev7n team', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="store-location" className="py-14 md:py-20 bg-[#0d0d0f] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link if on dedicated contact route */}
        {currentPage === 'contact' && (
          <div className="mb-6">
            <button
              onClick={() => goBack()}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Go back to previous step"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
            Visit Our Flagship Store
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sev7n (सेव7न) Mansarovar
          </h2>
          <p className="text-neutral-400 text-sm mt-2 leading-relaxed">
            Experience our contemporary streetwear collections in person. Try boxy cuts, check fabric drape, and consult our stylists at our Jaipur showroom.
          </p>
        </div>

        {/* Main Grid: Store Info + Interactive Map + Working Contact Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Store Details & Interior View (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Boutique Photograph & Store Status Strip */}
            <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 group">
              <img
                src="/src/assets/images/store_interior_sev7n_1792911394516.jpg"
                alt="Sev7n Mansarovar Jaipur store interior clothing racks"
                className="w-full h-64 sm:h-80 object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-white">Open Daily</span>
                    <span className="text-neutral-400">· Closes at {settings.closingTime}</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] mt-0.5">
                    Plus Code: <strong className="text-neutral-300 font-mono">{settings.plusCode}</strong>
                  </p>
                </div>
                <a
                  href={settings.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white text-neutral-950 font-semibold rounded hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* Structured Store Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                <MapPin className="w-4 h-4 text-white mb-2" />
                <h4 className="font-semibold text-white mb-1">Physical Address</h4>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  {settings.address}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                <Phone className="w-4 h-4 text-white mb-2" />
                <h4 className="font-semibold text-white mb-1">Direct Phone</h4>
                <p className="text-neutral-300 font-mono text-[11px] mb-2">
                  {settings.phone}
                </p>
                <button
                  onClick={() => openWhatsAppChat('location')}
                  className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>WhatsApp Desk</span>
                </button>
              </div>

              <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                <Clock className="w-4 h-4 text-white mb-2" />
                <h4 className="font-semibold text-white mb-1">Hours of Service</h4>
                <p className="text-neutral-300 text-[11px]">
                  Monday – Sunday
                </p>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  Open until 10:00 PM IST
                </p>
              </div>
            </div>

            {/* Embedded Map Section */}
            <div className="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900">
              <div className="p-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-neutral-300">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Mansarovar Sector II Map Locator</span>
                </div>
                <a
                  href={settings.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="w-full h-64 bg-neutral-950 relative">
                <iframe
                  title="Sev7n Clothing Store Location Mansarovar Jaipur"
                  src="https://maps.google.com/maps?q=24/27,+Swarn+Path,+Sector+II,+Shukalpura,+Mansarovar,+Jaipur,+Rajasthan+302020&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 filter grayscale contrast-125 opacity-85 hover:opacity-100 transition-opacity"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>

          </div>

          {/* Right Column: Inquiries Desk Form (5 cols) */}
          <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-lg p-6 sm:p-7">
            <div className="mb-6">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs mb-1 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>4.9 / 5 Google Verified Experience</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                Contact Store Management
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Reach our Mansarovar retail team for sizes, custom fit questions, or order inquiries.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-neutral-950 rounded border border-neutral-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-white text-sm">Message Recorded</h4>
                <p className="text-xs text-neutral-400">
                  Our Jaipur retail team will contact your phone or WhatsApp shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-neutral-300 underline hover:text-white cursor-pointer pt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 86198 90774"
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                  >
                    <option value="Store Visit Inquiry">Store Visit & Trials</option>
                    <option value="Product Stock Availability">Product Stock Availability</option>
                    <option value="Online Order Inquiry">Online Order Status</option>
                    <option value="Size & Styling Advice">Size & Styling Advice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about size availability, store visit timings, or order queries..."
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded text-white focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-neutral-950 bg-white rounded hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message to Store</span>
                    </>
                  )}
                </button>

                {/* Direct WhatsApp Quick Alternative */}
                <div className="pt-3 border-t border-neutral-800 text-center">
                  <button
                    type="button"
                    onClick={() => openWhatsAppChat('general')}
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Prefer WhatsApp? Chat directly with +91 86198 90774</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
