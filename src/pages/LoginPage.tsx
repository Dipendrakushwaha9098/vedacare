import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Leaf, Mail, Lock, ArrowRight, Activity, ShieldCheck, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import heroImage from "@/assets/hero-ayurveda.jpg";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("doctor@vedacare.com");
  const [password, setPassword] = useState("password123");
  const [isHovering, setIsHovering] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password.length > 5) {
      login({
        id: "dr-123",
        name: "Dr. Ananya Sharma",
        email: email,
        role: "doctor",
      });
      toast.success("Successfully logged in", {
        description: "Welcome back to vedaCare Dashboard.",
      });
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials", {
        description: "Please check your email and password.",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#FBF7F0] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-emerald-100/60 to-transparent blur-3xl opacity-50"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 150, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-amber-100/60 to-transparent blur-3xl opacity-50"
        />
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 relative z-10 grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left Side: Form */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="w-full max-w-md mx-auto md:mx-0"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center shadow-lg group-hover:shadow-emerald-200 transition-all duration-300">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl font-bold text-[#1C1008] tracking-tight group-hover:text-emerald-700 transition-colors">
                vedaCare
              </span>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1C1008] leading-tight mb-3">
              Welcome back
            </h1>
            <p className="text-[#8C7060] text-base">
              Enter your credentials to access your clinic's dashboard.
            </p>
          </motion.div>

          <motion.form variants={itemVariants} onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[#4A3828] font-semibold text-sm">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7060] group-focus-within:text-emerald-600 transition-colors" />
                <Input
                  type="email"
                  placeholder="doctor@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white border-[#E2D8C8] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[#4A3828] font-semibold text-sm">Password</Label>
                <a href="#" className="flex-shrink-0 text-xs text-emerald-600 font-medium hover:text-emerald-700">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7060] group-focus-within:text-emerald-600 transition-colors" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-white border-[#E2D8C8] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all rounded-xl"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-200/50 group text-base font-medium relative overflow-hidden transition-all"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <span className="relative z-10 flex items-center gap-2">
                Sign In to Dashboard
                <motion.span
                  animate={{ x: isHovering ? 5 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </span>
            </Button>
          </motion.form>
        </motion.div>

        {/* Right Side: Imagery and Features */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden md:flex relative justify-center items-center h-[70vh]"
        >
          {/* Main Visual Card */}
          <div className="relative w-full h-full max-h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/40 group">
            <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply z-10" />
            <img
              src={heroImage}
              alt="Ayurvedic Clinic"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            
            {/* Glassmorphic Overlay Features overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-8 pt-24 bg-gradient-to-t from-[#1C1008]/90 via-[#1C1008]/50 to-transparent">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-white text-xs font-medium mb-4">
                  <ShieldCheck className="w-3.5 h-3.5" /> HIPAA Compliant Data
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2 shadow-sm">
                  The Future of Panchkarma
                </h3>
                <p className="text-white/80 text-sm font-light max-w-sm">
                  Seamless patient management, AI-driven diet formulations, and insightful clinic analytics.
                </p>
              </motion.div>
            </div>
            
            {/* Floating Floating Badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-10 right-10 z-20 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Dr. Sharma</div>
                <div className="text-xs text-gray-500">Scheduled: 14 sessions</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-40 left-6 z-20 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">AI Active</div>
                <div className="text-xs text-gray-500">Prakriti Analysis Ready</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
