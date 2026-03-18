'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isWhoServeOpen, setIsWhoServeOpen] = useState(false);
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);

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

  return (
    <div className="bg-light-bg text-light-text dark:bg-navy dark:text-gray-200 font-sans antialiased overflow-x-hidden">
      
      {/* --- FIXED HEADER --- */}
      <header>
        <nav className="fixed top-0 w-full z-50 bg-[#050b1a]/95 backdrop-blur-md border-b border-white/5 py-10">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="flex items-center justify-between relative h-12">
              
              {/* Left Nav */}
              <div className="hidden lg:flex items-center space-x-10 w-[38%]">
                <Link href="/" className="text-[12px] font-bold uppercase tracking-[0.3em] text-white hover:text-[#97B99D] transition-colors">Home</Link>
                
                {/* Who We Serve Dropdown */}
                <div className="relative group py-4" onMouseEnter={() => setIsWhoServeOpen(true)} onMouseLeave={() => setIsWhoServeOpen(false)}>
                  <button className="text-[12px] font-bold uppercase tracking-[0.3em] text-white hover:text-[#97B99D] transition-colors flex items-center outline-none">
                    Who We Serve <svg className={`w-3 h-3 ml-2 transition-transform ${isWhoServeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  {isWhoServeOpen && (
                    <div className="absolute left-0 top-full w-64 bg-[#0a101e] border border-white/10 rounded-xl shadow-2xl py-4 z-[100]">
                      <Link href="/serve-probate" className="block px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#97B99D] hover:bg-white/5 transition-all">Probate Support</Link>
                      <Link href="/serve-rightsizing" className="block px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#97B99D] hover:bg-white/5 transition-all">Retiring Rightsizer</Link>
                      <Link href="/serve-relocation" className="block px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#97B99D] hover:bg-white/5 transition-all">Relocation Hub</Link>
                    </div>
                  )}
                </div>

                <Link href="/about" className="text-[12px] font-bold uppercase tracking-[0.3em] text-white hover:text-[#97B99D] transition-colors">About</Link>
              </div>

              {/* Center Logo */}
              <div className="absolute left-1/2 transform -translate-x-1/2 z-10 text-center">
                <Link href="/" className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tighter block whitespace-nowrap hover:text-[#97B99D] transition-all">
                  Homepathways
                </Link>
              </div>

              {/* Right Nav */}
              <div className="hidden lg:flex items-center justify-end space-x-10 w-[38%]">
                <Link href="/inner-circle" className="text-[12px] font-bold uppercase tracking-[0.3em] text-white hover:text-[#97B99D] transition-colors">Trusted Partners</Link>
                <Link href="#contact" className="bg-[#97B99D] text-[#050b1a] px-10 py-3.5 rounded-full text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl">Contact</Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* --- HERO --- */}
      <section className="relative h-screen flex items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy bg-opacity-60 dark:bg-opacity-70"></div>
        </div>
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-4">Guiding Every Home Journey With Clarity, Comfort, and Care.</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-gray-200">Supporting first-time buyers, relocating families, downsizing retirees, probate estates, and aging-in-place homeowners.</p>
          <Link href="/assessment" className="inline-block bg-mint text-navy font-bold text-lg px-10 py-4 rounded hover:bg-white transition-all">Start Your Home Pathway</Link>
        </div>
      </section>

      {/* --- ROADMAP SECTION --- */}
      <section className="relative z-10 -mt-32 pb-20">
        <div className="mx-auto max-w-7xl px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-24">
            <div className="lg:sticky lg:top-32 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">A Clear, Supportive Path – No Matter Where You’re Starting.</h2>
              <p className="mt-10 text-lg leading-8 text-slate-300">We've designed a simple, three-step process to bring clarity to your unique situation.</p>
            </div>
            
            <div className="mt-20 lg:mt-0 space-y-12">
              {/* Step 1 Card */}
              <div className="rounded-2xl bg-slate-900/70 p-8 border border-slate-700 backdrop-blur-sm">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 text-mint">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-mint">Step 1</p>
                    <h3 className="text-3xl font-serif font-bold text-white mt-1">Start With Clarity</h3>
                  </div>
                </div>
                <p className="mt-6 text-slate-300">Our journey begins with a comprehensive consultation to understand your goals, timeline, and financial picture.</p>
              </div>
              {/* ... Add other steps here similarly ... */}
            </div>
          </div>
        </div>
      </section>

      {/* --- PERSONA GRID --- */}
      <section className="py-32 bg-[#080e1a] border-y border-gray-900">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">Which Path Are You On?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Repeat Persona Cards from your original HTML... */}
             <div className="bg-[#0a101e] border border-white/5 p-10 rounded-[3rem] hover:border-[#97B99D] transition-all group">
                <h3 className="text-2xl font-serif text-white mb-4 group-hover:text-mint">First Time Buyer</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">Ready to stop paying rent and start owning my own space.</p>
                <Link href="/assessment?path=buyer" className="text-mint font-bold uppercase tracking-widest text-[10px] border-b border-mint/20 pb-1">Start Analysis →</Link>
             </div>
             {/* ... and so on ... */}
          </div>
        </div>
      </section>

      {/* --- BOOKING SECTION (THE IFRAME) --- */}
      <section id="contact" className="py-32 bg-[#050b1a]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-6xl mx-auto rounded-[40px] bg-slate-900/50 border border-slate-700 p-8 md:p-12 flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-2/3 w-full relative group">
              <div className="relative min-h-[600px] rounded-[40px] overflow-hidden bg-white border-4 border-slate-800">
                <iframe 
                  src="https://api.leadconnectorhq.com/widget/booking/YwaPtUtvGbMDsSNF6Iwl" 
                  style={{ width: '100%', border: 'none', overflow: 'hidden' }}
                  className="h-[600px] md:h-[700px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050b1a] border-t border-white/5 pt-24 pb-12 text-center text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em]">
        © 2026 Homepathways. All Rights Reserved.
      </footer>
    </div>
  );
}
