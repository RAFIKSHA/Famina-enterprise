import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Phone, MessageSquare, Sparkles, CheckCircle, 
  MapPin, Clock, ArrowRight, BookOpen, ChevronRight, X, ShieldCheck,
  UserCheck, Heart, Zap, Waves, Smile
} from "lucide-react";
import heroBanner from "../assets/hero_banner.png";
import beforeAfterImg from "../assets/before_after.png";

const Instagram = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Home() {
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  const phoneNo = "+919921719656";
  const whatsappUrl = "https://wa.me/919921719656";
  const instagramUrl = "https://instagram.com/feminaclinic"; // placeholder

  const treatments = [
    {
      id: "laser",
      title: "Laser Hair Reduction",
      summary: "Enjoy permanent, smooth skin with state-of-the-art US FDA-approved Diode laser technology.",
      description: "Ditch the constant cycle of waxing, shaving, and threading. Our clinical laser hair reduction uses high-performance cooling technology and targeting lasers to safely destroy hair follicles at the root, leading to permanent hair reduction.",
      benefits: [
        "Virtually painless sessions with sapphire cooling tip",
        "Safe for all Indian skin types (Fitzpatrick I-VI)",
        "Fast treatment sessions with no downtime",
        "Reduces ingrown hair and strawberry legs"
      ],
      duration: "30 - 60 Mins",
      icon: Zap,
      gradient: "from-rose-50 to-amber-50"
    },
    {
      id: "hydra",
      title: "HydraFacial Luxury",
      summary: "Deep cleanse, extract, and hydrate your skin with proprietary clinical vortex-fusion serums.",
      description: "Our premium HydraFacial treatment is a multi-step experience that combines cleansing, exfoliation, extraction, hydration, and antioxidant protection simultaneously. It resolves clogged pores and dullness, giving you an instantaneous red-carpet glow.",
      benefits: [
        "Instant, visible results right after the session",
        "Deeply extracts blackheads and skin impurities",
        "Infuses medical-grade hyaluronic acid and peptides",
        "Improves skin tone, texture, and elasticity"
      ],
      duration: "45 Mins",
      icon: Waves,
      gradient: "from-teal-50/40 to-rose-50/40"
    },
    {
      id: "peels",
      title: "Chemical Peels",
      summary: "Medical-grade chemical resurfacing to resolve active acne, fine lines, and stubborn pigmentation.",
      description: "We offer customized clinical peels (Glycolic, Salicylic, Yellow, and Party Peels) under strict supervision. They accelerate cell turnover to peel away damaged outer skin layers, revealing fresh, pigment-free, and smooth baby skin underneath.",
      benefits: [
        "Highly effective against active acne and blemishes",
        "Reduces superficial hyperpigmentation and melasma",
        "Stimulates fresh collagen synthesis",
        "Tailored intensity based on your skin type"
      ],
      duration: "30 Mins",
      icon: Sparkles,
      gradient: "from-amber-50/40 to-rose-50/40"
    },
    {
      id: "prp",
      title: "PRP Hair & Skin Therapy",
      summary: "Harness your body's natural growth factors to restore hair volume and stimulate youthful skin.",
      description: "Platelet-Rich Plasma (PRP) therapy utilizes your own blood plasma enriched with growth factors. Injected into the scalp or face, it naturally triggers hair follicle multiplication and collagen rebuilding for thicker hair and a highly rejuvenated face.",
      benefits: [
        "100% natural therapy using your body's own plasma",
        "Combats male & female pattern baldness effectively",
        "Deeply rejuvenates skin cells to reverse aging",
        "Improves skin thickness and elasticity"
      ],
      duration: "60 Mins",
      icon: Heart,
      gradient: "from-rose-50/60 to-teal-50/30"
    },
    {
      id: "acne",
      title: "Acne & Scar Revision",
      summary: "Advanced microneedling, subcision, and clinical peels to smooth deep-seated acne scars.",
      description: "Acne scars require precise collagen remodelling. We combine advanced microneedling (dermapen/RF), chemical subcision to break fibrous bands, and localized peels to drastically smooth out ice-pick, boxcar, and rolling scars while preventing new breakouts.",
      benefits: [
        "Noticeable reduction in deep-seated acne scars",
        "Calms active clinical acne and inflammation",
        "Smooths uneven skin texture and craters",
        "Evens out post-acne dark marks and erythema"
      ],
      duration: "45 Mins",
      icon: Smile,
      gradient: "from-teal-50/50 to-amber-50/30"
    },
    {
      id: "pigmentation",
      title: "Melasma & Pigmentation",
      summary: "Advanced clinical brightening therapies to resolve stubborn melasma and sun damage.",
      description: "Pigmentation issues like melasma, freckles, and age spots are treated with a multi-modal approach combining targeted depigmenting peels, micro-infusions of vitamin C, and clinical homecare protocols to target melanin pathways and brighten complexion.",
      benefits: [
        "Fades stubborn hormonal melasma patches",
        "Corrects uneven skin tone and sunspots",
        "Restores a bright, radiant, and fresh complexion",
        "Impedes future melanin overproduction"
      ],
      duration: "40 Mins",
      icon: UserCheck,
      gradient: "from-rose-50/40 to-amber-50/40"
    }
  ];

  const courses = [
    {
      title: "Master Diploma in Cosmetology & Aesthetics",
      duration: "6 Months",
      type: "Clinical + Hands-on",
      description: "A comprehensive course designed for aspiring aesthetic clinic owners. Covers skin anatomy, facial therapies, chemical peels, and handling high-tech clinical equipment."
    },
    {
      title: "Clinical Laser Therapist Certification",
      duration: "3 Months",
      type: "Clinical Practice",
      description: "Master advanced laser machines. Extensive practical training on Diode lasers for hair removal, Q-switched lasers for pigmentation/tattoos, and IPL devices."
    },
    {
      title: "Professional Bridal Makeup & HD Artistry",
      duration: "2 Months",
      type: "Studio Academy",
      description: "Learn high-definition (HD) makeup, airbrush techniques, hairstyle art, and modern bridal fashion looks from celebrity makeup tutors."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-charcoal font-sans selection:bg-rose-gold-light/40">
      
      {/* Sticky Luxury Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-gold-light/10 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <Link to="/" className="flex flex-col">
            <span className="font-heading font-bold text-lg sm:text-xl tracking-widest text-teal-accent">
              FEMINA <span className="text-rose-gold font-light">CLINIC & ACADEMY</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-charcoal-light font-semibold">
              Skin • Hair • Laser • Aesthetic • Makeup
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
            <a href="#hero" className="hover:text-rose-gold transition-colors">Home</a>
            <a href="#treatments" className="hover:text-rose-gold transition-colors">Treatments</a>
            <a href="#academy" className="hover:text-rose-gold transition-colors">Academy</a>
            <a href="#gallery" className="hover:text-rose-gold transition-colors">Gallery</a>
            <a href="#testimonials" className="hover:text-rose-gold transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-rose-gold transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="bg-cream-card border border-rose-gold/30 hover:border-rose-gold text-rose-gold text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider transition-all duration-200"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[80vh] flex items-center justify-center py-20 px-4 overflow-hidden bg-cream-dark/10">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBanner} 
            className="w-full h-full object-cover opacity-60 mix-blend-multiply" 
            alt="Femina Luxury Clinic" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0]/95 via-[#FAF6F0]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-rose-gold uppercase block bg-rose-gold-light/20 px-3.5 py-1.5 rounded-full w-max">
              Skin • Hair • Laser • Aesthetics
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-teal-accent leading-tight">
              Experience The Art Of <br />
              <span className="text-rose-gold font-light italic">Flawless, Radiant</span> Skin
            </h1>
            <p className="text-sm sm:text-md text-charcoal-light leading-relaxed font-medium">
              Femina Skin Clinic & Makeup Studio offers premium dermatological laser therapies, luxurious facials, and advanced anti-aging procedures tailored to unveil your natural beauty.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href={`tel:${phoneNo}`}
                className="flex items-center gap-2 bg-teal-accent hover:bg-teal-dark text-white text-xs font-bold uppercase tracking-wider px-7 py-3.5 rounded-full shadow-lg shadow-teal-900/10 transition-all hover:scale-[1.02]"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <a 
                href={whatsappUrl}
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-white border border-teal-accent/20 hover:border-teal-accent text-teal-accent text-xs font-bold uppercase tracking-wider px-7 py-3.5 rounded-full shadow-sm hover:bg-teal-50/20 transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="h-4 w-4 text-emerald-600" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Treatments Section */}
      <section id="treatments" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-rose-gold uppercase tracking-widest">Our Specialties</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-teal-accent">Luxury Clinic Treatments</h2>
          <div className="h-0.5 w-16 bg-rose-gold mx-auto"></div>
          <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
            All clinical procedures are conducted by certified laser therapists and aestheticians under dermatologist supervision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treatments.map((treatment) => {
            const IconComponent = treatment.icon;
            return (
              <div 
                key={treatment.id}
                onClick={() => setSelectedTreatment(treatment)}
                className={`group bg-white rounded-3xl p-8 border border-rose-gold-light/10 shadow-xs hover:shadow-md hover:border-rose-gold/30 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${treatment.gradient} rounded-bl-full opacity-60 group-hover:scale-110 transition-transform duration-300`}></div>
                
                <div className="space-y-4 relative z-10">
                  <div className="p-3.5 bg-rose-gold-light/20 rounded-2xl w-max text-rose-gold">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-teal-accent group-hover:text-rose-gold transition-colors">
                    {treatment.title}
                  </h3>
                  <p className="text-xs text-charcoal-light leading-relaxed line-clamp-3">
                    {treatment.summary}
                  </p>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-gold uppercase tracking-wider pt-6 mt-4 relative z-10 group-hover:gap-2.5 transition-all">
                  View Treatment <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Before/After Gallery Section */}
      <section id="gallery" className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-rose-gold uppercase tracking-widest">Clinical Transformations</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-teal-accent leading-tight">
              Real Transformations, <br />
              <span className="text-rose-gold font-light italic">Visible Results</span>
            </h2>
            <div className="h-0.5 w-16 bg-rose-gold"></div>
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
              Witness the power of advanced clinical aesthetics. These real, untouched clinical before and after patient transformations demonstrate the visible results of our customized skin treatment packages.
            </p>
            <div className="flex items-center gap-3 text-xs font-bold text-teal-accent bg-[#FAF6F0] p-4 rounded-2xl border border-rose-gold-light/10">
              <ShieldCheck className="h-5 w-5 text-rose-gold" />
              <span>Dermatologically monitored safe clinical techniques</span>
            </div>
          </div>

          <div className="lg:col-span-7 flex justify-center">
            <div className="bg-[#FAF6F0] p-4 sm:p-6 rounded-[2.5rem] border border-rose-gold-light/20 shadow-lg relative max-w-xl w-full">
              <div className="absolute -top-3 -left-3 bg-rose-gold text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-md">
                Unedited Results
              </div>
              <img 
                src={beforeAfterImg} 
                className="w-full h-auto rounded-[2rem] shadow-sm border border-white" 
                alt="Before and After Skin Glow Result" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Academy Section */}
      <section id="academy" className="py-24 px-4 bg-cream-dark/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-rose-gold uppercase tracking-widest">Femina Aesthetic Academy</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-teal-accent">Empower Your Beauty Career</h2>
            <div className="h-0.5 w-16 bg-rose-gold mx-auto"></div>
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
              Step into the highly lucrative field of aesthetics with our certified clinical cosmetology, laser therapy, and makeup courses featuring extensive hands-on practice.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-8 border border-rose-gold-light/10 shadow-xs flex flex-col justify-between relative hover:shadow-md hover:border-rose-gold/20 transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-extrabold uppercase bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
                      {course.duration}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 px-3 py-1 rounded-full">
                      {course.type}
                    </span>
                  </div>
                  <h3 className="text-md font-heading font-bold text-teal-accent">
                    {course.title}
                  </h3>
                  <p className="text-xs text-charcoal-light leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-rose-gold-light/10 mt-6 flex justify-between items-center text-xs">
                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-rose-gold hover:text-rose-gold-dark font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Enquire Now <ChevronRight className="h-4 w-4" />
                  </a>
                  <BookOpen className="h-4 w-4 text-rose-gold-light" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 bg-white rounded-3xl p-8 border border-rose-gold-light/15 max-w-4xl mx-auto shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left space-y-2">
              <h4 className="text-md font-heading font-bold text-teal-accent">Want to request a private counseling session?</h4>
              <p className="text-xs text-charcoal-light">Connect with our head cosmologist for dynamic guidance on batch timings and academy fees.</p>
            </div>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-teal-accent hover:bg-teal-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <MessageSquare className="h-4 w-4" /> Connect with Academy
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-rose-gold uppercase tracking-widest">Client Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-teal-accent">Loved By Our Clients</h2>
            <div className="h-0.5 w-16 bg-rose-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAF6F0]/50 p-8 rounded-3xl border border-rose-gold-light/10 space-y-4">
              <div className="flex text-amber-400 gap-0.5">
                {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <p className="text-xs text-charcoal-light leading-relaxed italic">
                "Absolutely loved my HydraFacial session. The staff is highly professional, and my skin has never felt this glowing!"
              </p>
              <h4 className="font-heading font-bold text-xs text-teal-accent">— Sneha K.</h4>
            </div>

            <div className="bg-[#FAF6F0]/50 p-8 rounded-3xl border border-rose-gold-light/10 space-y-4">
              <div className="flex text-amber-400 gap-0.5">
                {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <p className="text-xs text-charcoal-light leading-relaxed italic">
                "Getting my laser hair reduction done here. Safe, clean, and very effective. Dr. Anjali guides you at every step."
              </p>
              <h4 className="font-heading font-bold text-xs text-teal-accent">— Priyanka M.</h4>
            </div>

            <div className="bg-[#FAF6F0]/50 p-8 rounded-3xl border border-rose-gold-light/10 space-y-4">
              <div className="flex text-amber-400 gap-0.5">
                {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <p className="text-xs text-charcoal-light leading-relaxed italic">
                "Highly recommend the Academy. The clinical exposure and practical classes gave me the confidence to start my own salon!"
              </p>
              <h4 className="font-heading font-bold text-xs text-teal-accent">— Kiran J. (Cosmetology Graduate)</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section & Google Map */}
      <section id="contact" className="py-24 px-4 bg-cream-dark/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold text-rose-gold uppercase tracking-widest">Connect with Us</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-teal-accent">Visit Femina Studio</h2>
              <div className="h-0.5 w-16 bg-rose-gold"></div>
            </div>

            <div className="space-y-5 text-xs text-charcoal-light">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-rose-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-teal-accent mb-1">Our Location</h4>
                  <p className="leading-relaxed">Sahara City, Sillod, District Aurangabad (Chhatrapati Sambhajinagar), Maharashtra.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-rose-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-teal-accent mb-1">Call for Booking</h4>
                  <p className="font-bold text-rose-gold text-sm">{phoneNo}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-rose-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-teal-accent mb-1">Working Hours</h4>
                  <p>Open Daily: 10:00 AM — 07:00 PM</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 bg-white hover:bg-rose-50 text-rose-gold border border-rose-gold-light/20 rounded-2xl transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 bg-white hover:bg-emerald-50 text-emerald-600 border border-rose-gold-light/20 rounded-2xl transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 h-[400px] rounded-[2rem] overflow-hidden border border-rose-gold-light/20 shadow-md bg-white">
            <iframe 
              title="Google Map Location of Femina Skin Clinic"
              src="https://maps.google.com/maps?q=Femina%20Aesthetic%20skin,hair%20clinic%20%26%20makeup%20studio%20Sillod&t=&z=16&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="bg-white border-t border-rose-gold-light/15 py-12 px-4 text-center text-xs text-charcoal-light">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-left gap-1">
            <span className="font-heading font-extrabold text-sm text-teal-accent">FEMINA SKIN CLINIC & ACADEMY</span>
            <span className="text-[10px]">Aesthetic dermatology & makeup studio solutions.</span>
          </div>
          <div className="text-[10px] text-charcoal-light">
            © 2026 Femina Skin Clinic & Academy. Designed with premium luxury. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3.5 no-print">
        <a 
          href={`tel:${phoneNo}`} 
          className="h-12 w-12 rounded-full bg-rose-gold text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
          title="Call Clinic"
        >
          <Phone className="h-5 w-5" />
        </a>
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
          title="WhatsApp Clinic"
        >
          <MessageSquare className="h-5 w-5" />
        </a>
        <a 
          href={instagramUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="h-12 w-12 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
          title="Instagram Profile"
        >
          <Instagram className="h-5 w-5" />
        </a>
      </div>

      {/* Premium Treatment Modal */}
      {selectedTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative bg-white max-w-2xl w-full rounded-[2rem] border-2 border-rose-gold/30 shadow-2xl p-6 sm:p-8 text-left space-y-6 max-h-[90vh] overflow-y-auto animate-scaleUp">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedTreatment(null)}
              className="absolute top-4 right-4 p-2 bg-cream-bg hover:bg-rose-50 text-rose-gold rounded-full transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase bg-rose-gold-light/20 text-rose-gold px-3.5 py-1 rounded-full w-max inline-block">
                Session Duration: {selectedTreatment.duration}
              </span>
              <h3 className="text-2xl font-heading font-bold text-teal-accent">
                {selectedTreatment.title}
              </h3>
              <div className="h-0.5 w-16 bg-rose-gold"></div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-charcoal leading-relaxed font-medium">
                {selectedTreatment.description}
              </p>

              <div className="space-y-3 bg-[#FAF6F0] p-5 rounded-2xl border border-rose-gold-light/10">
                <h4 className="text-xs font-bold text-teal-accent uppercase tracking-wider">Key Benefits</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {selectedTreatment.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-charcoal-light">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-rose-gold-light/10">
              <a 
                href={`tel:${phoneNo}`}
                className="flex-1 flex items-center justify-center gap-2 bg-teal-accent hover:bg-teal-dark text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl shadow-md transition-all duration-200"
              >
                <Phone className="h-4 w-4" /> Call Clinic Now
              </a>
              <a 
                href={whatsappUrl}
                target="_blank" 
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl shadow-md transition-all duration-200"
              >
                <MessageSquare className="h-4 w-4" /> Enquire via WhatsApp
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
