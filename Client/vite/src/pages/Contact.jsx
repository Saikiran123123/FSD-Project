import React, { useState } from 'react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const faqs = [
    {
      q: 'How does the 5-minute atomic seat hold work?',
      a: 'When you select seats and proceed to snacks, our backend atomically locks those seats in MongoDB for 5 minutes. If checkout is not completed within 5 minutes, the seats automatically release for other guests.',
    },
    {
      q: 'What is the ticket cancellation & refund policy?',
      a: 'You can cancel any active booking prior to showtime from "My Bookings". 100% of your ticket amount is automatically refunded directly to the original payment source.',
    },
    {
      q: 'How do I use my Digital QR Ticket at the cinema?',
      a: 'Simply present the high-contrast QR code on your mobile pass or printed receipt directly to the cinema usher scanner at the gate for express paperless entry.',
    },
    {
      q: 'Can I pre-order gourmet popcorn and combos?',
      a: 'Yes! You can add food and beverage items during the booking flow. Concession orders are freshly prepared and served right to your cinema seat.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page min-h-screen bg-[#07070b] text-white py-16 sm:py-20">
      <div className="container-cinema max-w-5xl space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#e50914] text-xs font-bold uppercase tracking-[0.12em] block">
            ● GUEST ASSISTANCE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Support & Help Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Have a question about your booking, auditorium facilities, or corporate screenings? We are here 24/7.
          </p>
        </div>

        {/* Grid: Contact Information & Inquiry Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Info Cards */}
          <div className="glass-panel rounded-3xl p-7 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Get in Touch</h3>
              <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                Need immediate assistance regarding show timings or payment status? Reach out via our dedicated channels.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-[#e50914]/10 text-[#e50914] flex items-center justify-center font-bold text-lg shrink-0 border border-[#e50914]/20">
                  📞
                </div>
                <div>
                  <span className="text-zinc-400 text-[11px] block">Customer Support (24/7 Toll Free)</span>
                  <span className="text-white font-bold font-mono text-sm">+91 1800-CINE-BOOK</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-[#ffb703]/10 text-[#ffb703] flex items-center justify-center font-bold text-lg shrink-0 border border-[#ffb703]/20">
                  ✉️
                </div>
                <div>
                  <span className="text-zinc-400 text-[11px] block">Email Inquiries</span>
                  <span className="text-white font-bold text-sm">support@cinebook.com</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-[#00d4aa]/10 text-[#00d4aa] flex items-center justify-center font-bold text-lg shrink-0 border border-[#00d4aa]/20">
                  📍
                </div>
                <div>
                  <span className="text-zinc-400 text-[11px] block">Corporate Headquarters</span>
                  <span className="text-white font-bold text-sm">CineBook Tower, Hitec City, Hyderabad 500081</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Message Form */}
          <div className="glass-panel rounded-3xl p-7 sm:p-8">
            <h3 className="text-xl font-bold text-white mb-4">Send Us a Message</h3>
            {submitted ? (
              <div className="p-8 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-2xl text-center space-y-2">
                <p className="text-3xl">✓</p>
                <p className="font-bold text-sm text-white">Thank you for contacting CineBook!</p>
                <p className="text-zinc-400">Our concierge support team will get back to you within 2 business hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary text-xs font-bold px-4 py-2 rounded-xl mt-3 cursor-pointer"
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sai Kiran"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#10111a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-[#e50914] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="user@cinebook.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#10111a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-[#e50914] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Booking inquiry / Cinema feedback"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#10111a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-[#e50914] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can our cinema team help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#10111a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-[#e50914] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-cinema py-3.5 rounded-xl text-xs font-bold shadow-lg cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="glass-panel rounded-3xl p-7 sm:p-8 space-y-6">
          <div>
            <span className="text-[#ffb703] text-xs font-bold uppercase tracking-[0.12em] block mb-2">
              ● KNOWLEDGE BASE
            </span>
            <h3 className="text-2xl font-black text-white">Frequently Asked Questions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.06] space-y-2">
                <h4 className="font-bold text-white text-sm">❓ {faq.q}</h4>
                <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
