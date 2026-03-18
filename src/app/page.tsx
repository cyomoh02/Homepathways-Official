'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Testimonial Data from your original script
const testimonials = [
  { id: 't1', name: "Sarah & Mark", type: "First Time Home Buyer", stars: 5, short: "We felt like guests in someone else's investment. Every rent hike felt like a weight on our shoulders until Sean sat us down..." },
  { id: 't2', name: "The Miller Family", type: "Up-Mover", stars: 4.5, short: "Our starter home had become a storage unit for our past. Coming home felt like a return to a cramped reality until the Excellence Audit..." },
  { id: 't3', name: "David L.", type: "Out Of Town Relocator", stars: 5, short: "Moving 1,000 miles for work was terrifying. I felt like I was moving my entire life support system into the dark until Sean became my guide..." },
  { id: 't4', name: "Robert & Lisa", type: "Probate", stars: 4, short: "Losing our parents was hard, but being business partners with my siblings to settle the estate was tearing us apart. Sean saved our unity..." },
  { id: 't5', name: "Margaret H.", type: "Aging In Place Adults", stars: 5, short: "I was scared of losing my autonomy or becoming a burden because of my stairs. Sean didn't tell me to leave; he showed me how to stay strong..." },
  { id: 't6', name: "Eleanor & James", type: "Retiring Rightsizer", stars: 5, short: "We were living in a monument to the past. Chores were stealing our travel years until Sean helped us pivot from Management to Freedom..." },
  { id: 't7', name: "Kevin & Jen", type: "Up-Mover", stars: 5, short: "We were playing small because we were comfortable, but we were burnt out. Sean showed us our home should be a win for our family brand..." },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-light-bg text-light-text dark:bg-navy dark:text-gray-200 font-sans antialiased overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <header>
        <nav className="fixed top-0 w-full z-50 bg-[#050b1a]/95 backdrop-blur-md border-b border-white/5 py-10">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="flex items-center justify-between relative h-12">
              <div className="hidden lg:flex items-center space-x-10 w-[38%]">
                <Link href="/" className="text-[12px] font-bold uppercase tracking-[0.3em] text-white hover:text-[#97B99D] transition-colors">Home</Link>
                <div className="relative group py-4">
                    <button className="text-[12px] font-bold uppercase tracking-[0.3em] text-white hover:text-[#97B99D] transition-colors flex items-center outline-none">
                        Who We Serve <svg className="w-3 h-3 ml-2 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                </div>
                <Link href="/about" className="text-[12px] font-bold uppercase tracking-[0.3em] text-white hover:text-[#97B99D] transition-colors">About</Link>
              </div>

              <div className="absolute left-1/2 transform -translate-x-1/2 z-10 text-center">
                <Link href="/" className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tighter block whitespace-nowrap hover:text-[#97B99D] transition-all">
                  Homepathways
                </Link>
              </div>

              <div className="hidden lg:flex items-center justify-end space-x-10 w-[38%]">
                <Link href="/inner-circle" className="text-[12px] font-bold uppercase tracking-[0.3em] text-white hover:text-[#97B99D] transition-colors">Trusted Partners</Link>
                <Link href="#contact" className="bg-[#97B99D] text-[#050b1a] px-10 py-3.5 rounded-full text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl">Contact</Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" alt="Luxurious Home" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy bg-opacity-60 dark:bg-opacity-70"></div>
        </div>
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-4">
            Guiding Every Home Journey With Clarity, Comfort, and Care.
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-gray-200">
            From first homes to life transitions, we help you understand your options and move forward with confidence.
          </p>
          <Link href="/pathway-assessment" className="inline-block bg-mint text-navy font-bold text-lg px-10 py-4 rounded hover:scale-105 transition-transform">
            Start Your Home Pathway
          </Link>
        </div>
      </section>

      {/* --- TESTIMONIAL MARQUEE --- */}
      <section className="py-32 bg-navy border-t border-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 uppercase tracking-tight">Real Stories From Our Clients</h2>
        </div>

        <div className="flex overflow-hidden group">
          <div className="flex gap-8 animate-marquee-seamless-left hover:[animation-play-state:paused] whitespace-nowrap">
            {testimonials.map((t) => (
              <div key={t.id} className="w-[450px] bg-[#0a101e] border border-gray-800 p-8 rounded-[32px] whitespace-normal flex flex-col justify-between h-[360px]">
                <div>
                  <div className="text-amber-400 text-lg mb-4">★★★★★</div>
                  <div className="text-mint font-bold text-[10px] uppercase tracking-widest mb-2">{t.type}</div>
                  <h4 className="text-xl text-white font-bold mb-4 font-serif italic leading-relaxed line-clamp-2">"{t.short}"</h4>
                </div>
                <p className="text-slate-500 text-sm font-bold uppercase">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-24 bg-[#050b1a] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Common Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "What qualifies you as a first-time home buyer in Canada?", a: "In Canada, you qualify if you have not occupied a home that you or your current spouse owned in the last four years." },
              { q: "Who is eligible for the First Time Home Buyers’ Program in BC?", a: "To skip the Property Transfer Tax, you must be a Canadian citizen/PR and have lived in BC for 12 consecutive months." }
            ].map((faq, idx) => (
              <div key={idx} className="border-b border-white/10">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full py-6 flex justify-between items-center text-left text-gray-200 hover:text-mint transition-colors"
                >
                  <span className="text-lg">{faq.q}</span>
                  <svg className={`w-5 h-5 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {openFaq === idx && <div className="pb-6 text-gray-400 font-light">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#050b1a] border-t border-white/5 py-12 text-center text-[9px] text-gray-600 uppercase tracking-widest font-bold">
        © 2026 Homepathways. All Rights Reserved.
      </footer>
    </div>
  );
}
