import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

import {
  Leaf, CalendarDays, Users, Brain, Shield, ArrowRight, Star,
  ChevronRight, Package, BarChart3, MessageSquare, FileText,
  Wind, Flame, Droplets, Bot, CheckCircle, XCircle, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-ayurveda.jpg";

// ── Animation variants ──────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};


// ── Data ────────────────────────────────────────────────────────────
const features = [
  { icon: Users, title: "Patient Management", desc: "Complete digital records with Prakriti/Vikriti assessment, medical history, and dosha profiling.", color: "sage" },
  { icon: CalendarDays, title: "Smart Scheduling", desc: "Drag-and-drop calendar with multi-therapist support, real-time availability, and automated reminders.", color: "saffron" },
  { icon: Leaf, title: "Panchkarma Protocols", desc: "12+ predefined treatment protocols — Abhyanga, Shirodhara, Vamana, Basti, Nasya and more.", color: "coral" },
  { icon: Brain, title: "AI Treatment Engine", desc: "Personalized herb combinations, diet plans, and lifestyle recommendations based on live dosha assessment.", color: "sage" },
  { icon: Shield, title: "Role-Based Access", desc: "Granular permissions for Admin, Doctor, and Therapist roles with audit trails and data encryption.", color: "saffron" },
  { icon: FileText, title: "Digital Prescriptions", desc: "Generate branded prescriptions, invoices, and detailed treatment reports as PDF documents in one click.", color: "coral" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Revenue trends, patient retention, therapy popularity, and seasonal demand forecasting in real-time.", color: "sage" },
  { icon: Package, title: "Inventory & Herbs", desc: "Track oil stocks, herbal formulations, and consumables. Auto-alerts when supplies run low.", color: "saffron" },
  { icon: MessageSquare, title: "Patient Portal", desc: "Let patients view their treatment journey, receive daily diet recommendations, and message their practitioner.", color: "coral" },
];

const steps = [
  { num: "01", title: "Patient Intake", desc: "Capture Prakriti assessment, symptoms, and medical history with structured digital intake forms." },
  { num: "02", title: "AI Analysis", desc: "Our engine analyses dosha imbalance and suggests tailored Panchkarma protocols instantly." },
  { num: "03", title: "Schedule & Treat", desc: "Book sessions, assign therapists, and track daily progress seamlessly across your clinic." },
  { num: "04", title: "Prescribe & Report", desc: "Generate prescriptions, collect payment, and send detailed recovery reports to patients." },
];

const doshas = [
  {
    icon: Wind, name: "Vata", elements: "Air + Space",
    traits: ["Creative", "Energetic", "Variable digestion", "Light sleep", "Abhyanga therapy"],
    bg: "from-blue-50 to-blue-100", border: "border-blue-200",
    nameColor: "text-blue-900", elementColor: "text-blue-600",
    traitBg: "bg-blue-100", traitText: "text-blue-800", iconColor: "text-blue-500",
  },
  {
    icon: Flame, name: "Pitta", elements: "Fire + Water",
    traits: ["Ambitious", "Intense focus", "Strong digestion", "Shirodhara therapy"],
    bg: "from-amber-50 to-amber-100", border: "border-amber-200",
    nameColor: "text-amber-900", elementColor: "text-amber-600",
    traitBg: "bg-amber-100", traitText: "text-amber-800", iconColor: "text-amber-500",
  },
  {
    icon: Droplets, name: "Kapha", elements: "Water + Earth",
    traits: ["Stable", "Compassionate", "Slow metabolism", "Vamana therapy"],
    bg: "from-emerald-50 to-emerald-100", border: "border-emerald-200",
    nameColor: "text-emerald-900", elementColor: "text-emerald-600",
    traitBg: "bg-emerald-100", traitText: "text-emerald-800", iconColor: "text-emerald-500",
  },
];

const therapies = [
  { emoji: "🫙", name: "Abhyanga", dur: "60–90 min" },
  { emoji: "🪔", name: "Shirodhara", dur: "45–60 min" },
  { emoji: "🌿", name: "Vamana", dur: "Half day" },
  { emoji: "🫖", name: "Basti", dur: "30–45 min" },
  { emoji: "🌸", name: "Nasya", dur: "20–30 min" },
  { emoji: "💧", name: "Raktamoksha", dur: "30 min" },
  { emoji: "🌾", name: "Pinda Sweda", dur: "45 min" },
  { emoji: "🌺", name: "Kizhi", dur: "45 min" },
  { emoji: "🌻", name: "Udvartana", dur: "45–60 min" },
  { emoji: "🧘", name: "Kati Basti", dur: "30–40 min" },
  { emoji: "💆", name: "Greeva Basti", dur: "30 min" },
  { emoji: "👁️", name: "Netra Tarpana", dur: "20 min" },
];

const testimonials = [
  { initials: "AS", name: "Dr. Ananya Sharma", role: "Clinic Director, Pune", text: "vedaCare transformed how we manage our clinic. The AI recommendations are remarkably accurate, and my patients love the personalised diet plans.", rating: 5, bg: "bg-emerald-100", color: "text-emerald-800" },
  { initials: "RP", name: "Rajesh Patel", role: "Clinic Director, Ahmedabad", text: "The scheduling system alone saved us 10+ hours per week. Managing multiple therapists across two clinics is now effortless. Beautiful, intuitive interface.", rating: 5, bg: "bg-amber-100", color: "text-amber-800" },
  { initials: "PM", name: "Priya Menon", role: "Senior Therapist, Kochi", text: "Tracking daily therapy progress and generating patient reports has never been easier. The Panchkarma protocol templates saved months of setup work.", rating: 5, bg: "bg-rose-100", color: "text-rose-800" },
  { initials: "VN", name: "Vikram Nair", role: "Pharmacy Manager, Chennai", text: "The inventory management for our herbal oils is a game-changer. No more manual stock-taking. Auto-alerts ensure we never run out mid-treatment.", rating: 5, bg: "bg-blue-100", color: "text-blue-800" },
  { initials: "SJ", name: "Sunita Joshi", role: "Clinic Owner, Jaipur", text: "Revenue analytics revealed our most profitable therapies. We restructured our pricing using vedaCare insights and saw a 28% increase in monthly revenue.", rating: 5, bg: "bg-green-100", color: "text-green-800" },
  { initials: "AR", name: "Dr. Arun Raj", role: "Integrative Medicine, Bengaluru", text: "The patient portal is wonderful — my patients stay engaged between sessions. They see their progress and feel part of their healing journey.", rating: 5, bg: "bg-orange-100", color: "text-orange-800" },
];

const plans = [
  {
    name: "Starter", price: "₹999", period: "/month", sub: "Up to 1 practitioner", featured: false,
    features: [
      { label: "100 active patients", ok: true },
      { label: "Basic scheduling", ok: true },
      { label: "5 therapy protocols", ok: true },
      { label: "PDF prescriptions", ok: true },
      { label: "AI recommendations", ok: false },
      { label: "Patient portal", ok: false },
      { label: "Inventory tracking", ok: false },
    ],
    cta: "Get Started",
  },
  {
    name: "Professional", price: "₹2,499", period: "/month", sub: "Up to 5 practitioners", featured: true,
    features: [
      { label: "Unlimited patients", ok: true },
      { label: "Smart scheduling + reminders", ok: true },
      { label: "All 12 therapy protocols", ok: true },
      { label: "AI recommendations", ok: true },
      { label: "Patient portal", ok: true },
      { label: "Inventory tracking", ok: true },
      { label: "Advanced analytics", ok: true },
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise", price: "Custom", period: "", sub: "Multi-clinic chains", featured: false,
    features: [
      { label: "Everything in Pro", ok: true },
      { label: "Multi-branch management", ok: true },
      { label: "White-label option", ok: true },
      { label: "Dedicated account manager", ok: true },
      { label: "API integrations", ok: true },
      { label: "SLA support", ok: true },
      { label: "Custom onboarding", ok: true },
    ],
    cta: "Contact Sales",
  },
];

const stats = [
  { n: "2,500+", l: "Patients Managed" },
  { n: "98%", l: "Satisfaction Rate" },
  { n: "150+", l: "Clinics Trust Us" },
  { n: "12+", l: "Panchkarma Therapies" },
];

// ── Helpers ─────────────────────────────────────────────────────────
const featureIconBg: Record<string, string> = {
  sage: "bg-emerald-100 text-emerald-700",
  saffron: "bg-amber-100 text-amber-700",
  coral: "bg-rose-100 text-rose-700",
};

// ── Animated counter ─────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: string }) {
  return <span>{value}</span>;
}

// ── 3D Scroll Section ───────────────────────────────────────────────
const Scroll3DSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [25, -25]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const z = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 150]);

  return (
    <section ref={containerRef} className="py-32 px-4 bg-gradient-to-b from-[#F2EBD9] to-[#FBF7F0] overflow-hidden relative" style={{ perspective: "1200px" }}>
      <div className="max-w-7xl mx-auto text-center mb-16 relative z-20">
        <div className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">Immersive Experience</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1C1008]">
          A Deep Dive Into <span className="italic text-emerald-700">Healing</span>
        </h2>
      </div>

      <div className="flex justify-center items-center h-[500px] md:h-[600px] w-full relative z-10" style={{ transformStyle: "preserve-3d" }}>
        {/* Main Center Image */}
        <motion.div
          style={{ rotateX, rotateY, z, scale }}
          className="absolute w-[280px] h-[380px] md:w-[450px] md:h-[550px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50"
        >
          <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop" alt="Yoga center" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
        </motion.div>

        {/* Floating Left Image */}
        <motion.div
          style={{ y: y1, z: 30, rotateZ: -6 }}
          className="absolute left-2 md:left-[10%] lg:left-[18%] w-[160px] h-[220px] md:w-[240px] md:h-[320px] rounded-2xl overflow-hidden shadow-xl border border-white/60"
        >
          <img src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=400&auto=format&fit=crop" alt="Meditation" className="w-full h-full object-cover" />
        </motion.div>

        {/* Floating Right Image */}
        <motion.div
          style={{ y: y2, z: -30, rotateZ: 6 }}
          className="absolute right-2 md:right-[10%] lg:right-[18%] w-[180px] h-[240px] md:w-[260px] md:h-[340px] rounded-2xl overflow-hidden shadow-xl border border-white/60"
        >
          <img src="https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=400&auto=format&fit=crop" alt="Herbs" className="w-full h-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF7F0] font-body overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#FBF7F0]/90 backdrop-blur-md shadow-sm border-b border-[#E2D8C8]" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center shadow-sm">
              <Leaf className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-[#1C1008] tracking-tight">vedaCare</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7 text-sm text-[#6B5E52]">
            {["Features", "Doshas", "Therapies", "Pricing", "Reviews"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-emerald-700 transition-colors">{l}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="hidden md:block">
              <Button className="bg-emerald-700 hover:bg-emerald-600 text-white border-0 text-sm px-5 h-9 rounded-lg shadow-sm">
                Open Dashboard <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <button className="md:hidden p-2 rounded-lg text-[#6B5E52]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FBF7F0]/95 backdrop-blur border-b border-[#E2D8C8] px-4 py-4 flex flex-col gap-4">
            {["Features", "Doshas", "Therapies", "Pricing", "Reviews"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-[#4A3828] py-1" onClick={() => setMobileMenuOpen(false)}>{l}</a>
            ))}
            <Link to="/dashboard"><Button className="bg-emerald-700 text-white w-full">Open Dashboard</Button></Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 px-4 overflow-hidden bg-gradient-to-br from-[#FBF7F0] via-[#FBF7F0] to-emerald-50">
        {/* Background orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-amber-100/40 blur-3xl pointer-events-none -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left */}
          <div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-medium mb-6 tracking-wide uppercase">
                🪷 AI-Powered Panchkarma Management
              </span>
            </motion.div>

            <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[#1C1008] leading-[1.05] mb-6">
              Heal with <span className="italic text-emerald-700">Tradition</span>,<br />
              Manage with <span className="text-amber-600">Technology</span>
            </motion.h1>

            <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="text-lg text-[#6B5E52] leading-relaxed mb-8 max-w-lg font-light">
              vedaCare unifies ancient Panchkarma wisdom with modern AI — seamless patient care, dosha-based insights, and effortless clinic management in one beautiful platform.
            </motion.p>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="flex gap-4 flex-wrap">
              <Link to="/dashboard">
                <Button size="lg" className="bg-emerald-700 hover:bg-emerald-600 text-white border-0 px-8 h-12 rounded-xl text-base shadow-md shadow-emerald-200">
                  Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-[#C8B89A] text-[#4A3828] hover:bg-[#F2EBD9] px-8 h-12 rounded-xl text-base">
                Watch Demo ▶
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}
              className="mt-12 pt-8 border-t border-[#E2D8C8] grid grid-cols-4 gap-4">
              {stats.map(s => (
                <div key={s.l}>
                  <div className="font-display text-2xl font-bold text-emerald-700">{s.n}</div>
                  <div className="text-xs text-[#8C7060] mt-1">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right – Dashboard preview */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="relative hidden lg:block">
            {/* Floating badge top-right */}
            <motion.div
              animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -top-5 -right-4 z-20 bg-white rounded-2xl shadow-lg border border-[#E2D8C8] px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-base">🧘</div>
              <div>
                <div className="text-sm font-medium text-[#1C1008]">Today's Sessions</div>
                <div className="text-xs text-[#8C7060]">14 scheduled · 3 in progress</div>
              </div>
            </motion.div>

            {/* Main card */}
            <div className="bg-white rounded-2xl border border-[#E2D8C8] shadow-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="font-display text-lg font-bold text-[#1C1008]">Patient Dashboard</div>
                <div className="text-xs text-[#8C7060] bg-[#F2EBD9] px-3 py-1 rounded-full">26 Mar 2026</div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { dot: "bg-emerald-500", val: "142", lbl: "Active Patients" },
                  { dot: "bg-amber-500", val: "28", lbl: "This Week" },
                  { dot: "bg-rose-400", val: "₹1.4L", lbl: "Revenue" },
                ].map(m => (
                  <div key={m.lbl} className="bg-[#FBF7F0] rounded-xl p-3 border border-[#E2D8C8]">
                    <div className={`w-2 h-2 rounded-full ${m.dot} mb-2`} />
                    <div className="font-display text-xl font-bold text-[#1C1008]">{m.val}</div>
                    <div className="text-[10px] text-[#8C7060] mt-0.5">{m.lbl}</div>
                  </div>
                ))}
              </div>

              {/* Patient list */}
              <div className="flex flex-col gap-2.5">
                {[
                  { init: "PS", name: "Priya Sharma", therapy: "Abhyanga · Day 5", status: "Active", statusBg: "bg-emerald-100 text-emerald-800", avatarBg: "bg-emerald-100 text-emerald-700" },
                  { init: "RK", name: "Rajan Kumar", therapy: "Shirodhara · Day 2", status: "Scheduled", statusBg: "bg-amber-100 text-amber-800", avatarBg: "bg-amber-100 text-amber-700" },
                  { init: "AM", name: "Anita Mehta", therapy: "Nasya · Day 7", status: "Active", statusBg: "bg-emerald-100 text-emerald-800", avatarBg: "bg-rose-100 text-rose-700" },
                ].map(p => (
                  <div key={p.name} className="flex items-center gap-3 bg-[#FBF7F0] rounded-xl p-3 border border-[#E2D8C8]">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${p.avatarBg}`}>{p.init}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#1C1008] truncate">{p.name}</div>
                      <div className="text-xs text-[#8C7060]">{p.therapy}</div>
                    </div>
                    <div className={`text-[10px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${p.statusBg}`}>{p.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge bottom-left */}
            <motion.div
              animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-5 -left-5 z-20 bg-white rounded-2xl shadow-lg border border-[#E2D8C8] p-4 max-w-[220px]">
              <div className="text-sm font-medium text-[#1C1008] mb-1">🤖 AI Recommendation</div>
              <div className="text-xs text-[#8C7060] mb-2">For Priya · Vata Dosha</div>
              <div className="flex flex-wrap gap-1.5">
                {["🌿 Sesame oil", "🍵 Ginger tea", "🧘 Rest"].map(c => (
                  <span key={c} className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">{c}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 3D SCROLL EXPERIENCE ── */}
      <Scroll3DSection />

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4 bg-[#FBF7F0]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-16">
            <div className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-3">Everything You Need</div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1C1008] leading-tight">
                Built for the Modern<br />Ayurvedic Practitioner
              </h2>
              <p className="text-[#6B5E52] text-base max-w-sm leading-relaxed font-light">
                From patient intake to AI-powered treatment plans — a complete ecosystem in one elegant platform.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
                className="bg-white border border-[#E2D8C8] rounded-2xl p-6 group hover:-translate-y-1 hover:shadow-md transition-all duration-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${featureIconBg[f.color]}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#1C1008] mb-2">{f.title}</h3>
                <p className="text-sm text-[#8C7060] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 bg-[#F2EBD9]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <div className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-3">How It Works</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1C1008]">Simple. Powerful. Intelligent.</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-emerald-300 via-amber-300 to-emerald-300 opacity-60" />
            {steps.map((s, i) => (
              <motion.div key={s.num}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}
                className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center mx-auto mb-5 relative z-10 shadow-sm">
                  <span className="font-display text-xl font-bold text-emerald-700">{s.num}</span>
                </div>
                <h3 className="text-base font-semibold text-[#1C1008] mb-2">{s.title}</h3>
                <p className="text-sm text-[#8C7060] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOSHAS ── */}
      <section id="doshas" className="py-24 px-4 bg-[#FBF7F0]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-16">
            <div className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-3">Dosha Intelligence</div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1C1008] leading-tight">
                Prakruti-Based<br />Patient Profiles
              </h2>
              <p className="text-[#6B5E52] text-base max-w-sm leading-relaxed font-light">
                vedaCare automatically identifies each patient's constitutional type and adapts treatment suggestions accordingly.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-7">
            {doshas.map((d, i) => (
              <motion.div key={d.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}
                className={`rounded-2xl p-8 border ${d.border} bg-gradient-to-br ${d.bg} hover:-translate-y-1 transition-transform duration-200 cursor-pointer`}>
                <d.icon className={`w-10 h-10 mb-4 ${d.iconColor}`} />
                <div className={`font-display text-3xl font-bold mb-1 ${d.nameColor}`}>{d.name}</div>
                <div className={`text-xs font-medium uppercase tracking-wider mb-5 ${d.elementColor}`}>{d.elements}</div>
                <div className="flex flex-wrap gap-2">
                  {d.traits.map(t => (
                    <span key={t} className={`text-xs px-3 py-1 rounded-full ${d.traitBg} ${d.traitText}`}>{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI SECTION ── */}
      <section className="py-24 px-4 bg-[#F2EBD9]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Chat UI */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="bg-white rounded-2xl border border-[#E2D8C8] shadow-lg p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#E2D8C8]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-amber-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#1C1008]">vedaCare AI Assistant</div>
                    <div className="text-xs text-emerald-600">● Online · Powered by Claude</div>
                  </div>
                </div>

                {/* Bubbles */}
                <div className="space-y-4">
                  <div className="max-w-[85%]">
                    <div className="text-[10px] text-[#8C7060] mb-1 ml-1">AI</div>
                    <div className="bg-[#FBF7F0] border border-[#E2D8C8] rounded-tl-sm rounded-tr-2xl rounded-b-2xl p-3.5 text-sm text-[#4A3828] leading-relaxed">
                      Patient Rajan shows elevated Pitta with heat-aggravated symptoms. I recommend Shirodhara with cooling oils for 7 days.
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {["🌹 Brahmi oil", "🥒 Cooling diet", "🌙 Evening sessions"].map(c => (
                          <span key={c} className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-[10px] text-[#8C7060] mb-1 mr-1">Dr. Sharma</div>
                    <div className="bg-emerald-700 text-white rounded-tl-2xl rounded-tr-sm rounded-b-2xl p-3.5 text-sm leading-relaxed max-w-[80%]">
                      Generate a full treatment plan and prescription PDF for this patient.
                    </div>
                  </div>
                  <div className="max-w-[85%]">
                    <div className="text-[10px] text-[#8C7060] mb-1 ml-1">AI</div>
                    <div className="bg-[#FBF7F0] border border-[#E2D8C8] rounded-tl-sm rounded-tr-2xl rounded-b-2xl p-3.5 text-sm text-[#4A3828] leading-relaxed">
                      Done! 7-day Shirodhara protocol created with daily oil specs, dietary guidelines, and lifestyle recommendations. PDF ready for download. 📄
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right text */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-3">AI-Powered Care</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1C1008] leading-tight mb-8">Your Intelligent<br />Clinic Assistant</h2>
              <div className="flex flex-col gap-6">
                {[
                  { emoji: "🧠", title: "Smart Dosha Analysis", desc: "Real-time Prakriti assessment with symptom correlation and seasonal adjustments for precise diagnosis." },
                  { emoji: "🌿", title: "Herb & Diet Recommendations", desc: "Personalised herbal formulations and Ahara plans based on individual constitution and imbalances." },
                  { emoji: "📋", title: "Auto-Generated Reports", desc: "Clinical notes, progress summaries, and follow-up plans drafted automatically — saving hours of documentation." },
                  { emoji: "📈", title: "Predictive Health Insights", desc: "Identify patterns across your patient population to prevent recurrence and optimise treatment timelines." },
                ].map(f => (
                  <div key={f.title} className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl bg-white border border-[#E2D8C8] flex items-center justify-center text-xl flex-shrink-0 shadow-sm">{f.emoji}</div>
                    <div>
                      <div className="text-sm font-semibold text-[#1C1008] mb-1">{f.title}</div>
                      <div className="text-sm text-[#8C7060] leading-relaxed">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── THERAPIES ── */}
      <section id="therapies" className="py-24 px-4 bg-[#FBF7F0]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
            <div className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-3">Treatment Catalogue</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1C1008]">
              12 Panchkarma Therapies,<br />Digitally Managed
            </h2>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {therapies.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.4 }}
                className="bg-white border border-[#E2D8C8] rounded-2xl p-4 text-center hover:border-emerald-400 hover:bg-emerald-50 hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
                <div className="text-3xl mb-2.5">{t.emoji}</div>
                <div className="text-xs font-semibold text-[#1C1008] mb-1 group-hover:text-emerald-700">{t.name}</div>
                <div className="text-[10px] text-[#8C7060]">{t.dur}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="reviews" className="py-24 px-4 bg-[#F2EBD9]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <div className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-3">Testimonials</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1C1008]">
              Trusted Across India's<br />Top Ayurvedic Clinics
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-white border border-[#E2D8C8] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-4 right-5 font-display text-7xl text-[#F2EBD9] leading-none select-none">"</div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-4 ${t.bg} ${t.color}`}>
                  {t.initials}
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[#4A3828] leading-relaxed italic mb-5 relative z-10">{t.text}</p>
                <div>
                  <div className="text-sm font-semibold text-[#1C1008]">{t.name}</div>
                  <div className="text-xs text-[#8C7060]">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-4 bg-[#FBF7F0]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <div className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-3">Simple Pricing</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1C1008] mb-4">Plans for Every Clinic</h2>
            <p className="text-[#6B5E52] font-light">No hidden fees. Cancel anytime. All plans include free onboarding support.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((p, i) => (
              <motion.div key={p.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`rounded-2xl p-7 relative ${p.featured
                  ? "border-2 border-emerald-600 bg-gradient-to-br from-white to-emerald-50 shadow-lg shadow-emerald-100"
                  : "border border-[#E2D8C8] bg-white"}`}>
                {p.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-xs font-medium px-4 py-1 rounded-full whitespace-nowrap">
                    ✦ Most Popular
                  </div>
                )}
                <div className="text-xs font-semibold uppercase tracking-wider text-[#8C7060] mb-2">{p.name}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-4xl font-bold text-[#1C1008]">{p.price}</span>
                  <span className="text-sm text-[#8C7060]">{p.period}</span>
                </div>
                <div className="text-xs text-[#8C7060] mb-5">{p.sub}</div>
                <div className="h-px bg-[#E2D8C8] mb-5" />
                <div className="space-y-3 mb-6">
                  {p.features.map(f => (
                    <div key={f.label} className="flex items-center gap-2.5 text-sm">
                      {f.ok
                        ? <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        : <XCircle className="w-4 h-4 text-[#C8B89A] flex-shrink-0" />}
                      <span className={f.ok ? "text-[#4A3828]" : "text-[#B0A090]"}>{f.label}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className={`w-full rounded-xl h-11 text-sm font-medium ${p.featured
                    ? "bg-emerald-700 hover:bg-emerald-600 text-white border-0 shadow-md shadow-emerald-200"
                    : "bg-transparent border border-emerald-600 text-emerald-700 hover:bg-emerald-50"}`}>
                  {p.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 bg-gradient-to-br from-emerald-800 via-emerald-900 to-[#1A3A2A]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Ready to Transform<br />Your Clinic?
            </h2>
            <p className="text-emerald-200/80 text-lg font-light mb-10 max-w-xl mx-auto leading-relaxed">
              Join 150+ Ayurvedic practitioners managing their clinics smarter, faster, and with deeper patient insight — powered by AI and ancient wisdom.
            </p>
            <div className="flex gap-4 justify-center flex-wrap mb-10">
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50 border-0 px-9 h-12 rounded-xl text-base font-semibold shadow-lg">
                  Start Free Trial →
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-9 h-12 rounded-xl text-base">
                Book a Demo
              </Button>
            </div>
            <div className="flex gap-6 justify-center flex-wrap text-sm text-emerald-300/70">
              {["No credit card required", "14-day free trial", "Free data migration", "Cancel anytime"].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✦</span> {t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#2C1A0E] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-display text-lg font-bold text-white/80">vedaCare</span>
              </div>
              <p className="text-sm text-white/35 leading-relaxed max-w-[220px]">
                Bridging ancient wellness wisdom with modern clinic technology. Built for practitioners across India.
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Roadmap", "Changelog"] },
              { title: "Resources", links: ["Documentation", "API Reference", "Blog", "Case Studies"] },
              { title: "Company", links: ["About Us", "Contact", "Privacy Policy", "Terms of Service"] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">{col.title}</div>
                {col.links.map(l => (
                  <a key={l} href="#" className="block text-sm text-white/45 hover:text-white/80 transition-colors mb-2.5">{l}</a>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/25">
            <div>© 2026 vedaCare. All rights reserved.</div>
            <div>Panchkarma Patient Management System · Made in India 🇮🇳</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
