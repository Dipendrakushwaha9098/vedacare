import { motion } from "framer-motion";
import { Leaf, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnimatedTorii3D } from "@/components/AnimatedTorii3D";


const therapies = [
  {
    name: "Abhyanga",
    sanskrit: "अभ्यंग",
    desc: "Full body warm oil massage that nourishes tissues, improves circulation, and calms the nervous system.",
    duration: "60-90 min",
    dosha: "All Doshas",
    sessions: 7,
    completed: 5,
  },
  {
    name: "Shirodhara",
    sanskrit: "शिरोधारा",
    desc: "Continuous stream of warm oil on the forehead to relieve stress, insomnia, and mental fatigue.",
    duration: "45-60 min",
    dosha: "Vata & Pitta",
    sessions: 5,
    completed: 3,
  },
  {
    name: "Vamana",
    sanskrit: "वमन",
    desc: "Therapeutic emesis to eliminate excess Kapha dosha from the body and respiratory system.",
    duration: "3-4 hrs",
    dosha: "Kapha",
    sessions: 1,
    completed: 0,
  },
  {
    name: "Virechana",
    sanskrit: "विरेचन",
    desc: "Purgation therapy that cleanses the digestive tract and eliminates Pitta-related toxins.",
    duration: "Full day",
    dosha: "Pitta",
    sessions: 1,
    completed: 1,
  },
  {
    name: "Basti",
    sanskrit: "बस्ती",
    desc: "Medicated enema therapy considered the most effective Panchkarma for Vata disorders.",
    duration: "30-45 min",
    dosha: "Vata",
    sessions: 8,
    completed: 6,
  },
  {
    name: "Nasya",
    sanskrit: "नस्य",
    desc: "Nasal administration of medicated oils to treat sinusitis, migraines, and ENT disorders.",
    duration: "15-30 min",
    dosha: "Kapha & Vata",
    sessions: 7,
    completed: 4,
  },
];

export default function TreatmentsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 3D Animated Background */}
      <div className="fixed top-0 left-0 w-screen h-screen opacity-12 pointer-events-none z-0">
        <AnimatedTorii3D />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Treatments & Therapies</h1>
          <p className="text-sm text-muted-foreground mt-1">Panchkarma therapy modules and progress tracking</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-5"
        >
        {therapies.map((t, i) => {
          const progress = Math.round((t.completed / t.sessions) * 100);
          return (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              className="glass-card-hover p-6 flex flex-col rounded-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl gradient-sage flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{t.name}</h3>
                    <span className="text-xs text-muted-foreground">{t.sanskrit}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground">{t.dosha}</Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.desc}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t.duration}</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {t.completed}/{t.sessions} sessions</span>
              </div>
              <div className="mt-auto">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </motion.div>
          );
        })}
        </motion.div>
      </div>
    </div>
  );
}
