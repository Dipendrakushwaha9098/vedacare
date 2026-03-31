import { motion } from "framer-motion";
import { FileText, Download, IndianRupee, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedCubes3D } from "@/components/AnimatedCubes3D";


const prescriptions = [
  { id: "RX-001", patient: "Ramesh Kumar", doctor: "Dr. Ananya Sharma", date: "2026-03-25", medicines: ["Ashwagandha", "Triphala", "Brahmi"], status: "Active" },
  { id: "RX-002", patient: "Priya Sharma", doctor: "Dr. Ananya Sharma", date: "2026-03-24", medicines: ["Shatavari", "Guduchi", "Amalaki"], status: "Active" },
  { id: "RX-003", patient: "Suresh Singh", doctor: "Dr. Vikram Joshi", date: "2026-03-22", medicines: ["Guggulu", "Haritaki", "Pippali"], status: "Completed" },
  { id: "RX-004", patient: "Anita Patel", doctor: "Dr. Ananya Sharma", date: "2026-03-20", medicines: ["Neem", "Turmeric", "Amla"], status: "Active" },
];


const invoices = [
  { id: "INV-1001", patient: "Ramesh Kumar", amount: "₹5,500", date: "2026-03-25", paid: true },
  { id: "INV-1002", patient: "Priya Sharma", amount: "₹3,800", date: "2026-03-24", paid: true },
  { id: "INV-1003", patient: "Suresh Singh", amount: "₹7,200", date: "2026-03-22", paid: false },
  { id: "INV-1004", patient: "Anita Patel", amount: "₹4,500", date: "2026-03-20", paid: true },
];


export default function PrescriptionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 3D Animated Background */}
      <div className="fixed top-0 left-0 w-screen h-screen opacity-10 pointer-events-none z-0">
        <AnimatedCubes3D />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Prescriptions & Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">Digital prescriptions and invoices</p>
      </div>

      {/* Prescriptions */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground">Prescriptions</h2>
        <div className="grid gap-3">
          {prescriptions.map((rx, i) => (
            <motion.div
              key={rx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card-hover p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl gradient-sage flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm">{rx.id}</span>
                  <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 ${rx.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}>
                    {rx.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{rx.patient} • {rx.doctor} • {rx.date}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {rx.medicines.map((m) => (
                    <span key={m} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{m}</span>
                  ))}
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Download className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground">Invoices</h2>
        <div className="grid gap-3">
          {invoices.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card-hover p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl gradient-saffron flex items-center justify-center flex-shrink-0">
                <IndianRupee className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground text-sm">{inv.id} — {inv.patient}</div>
                <p className="text-xs text-muted-foreground">{inv.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display font-semibold text-foreground">{inv.amount}</span>
                {inv.paid ? (
                  <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-800">
                    <Clock className="w-3 h-3 mr-1" /> Pending
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
