import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import {
  Users,
  CalendarDays,
  Leaf,
  IndianRupee,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  CheckCircle,
  AlertCircle,
  PhoneCall,
  Plus,
  Calendar,
  Send,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchPatients, fetchAppointments } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AnimatedBackground3D } from "@/components/AnimatedBackground3D";

// ✅ TYPES
type Patient = {
  id: string;
  name: string;
  createdAt: string;
};

type Appointment = {
  id: string;
  patient: string;
  therapy?: string;
  status?: "Ongoing" | "Completed" | "Scheduled";
  amount?: number;
  time?: string;
  createdAt?: string;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedStat, setSelectedStat] = useState<number | null>(null);
  const [filterActivity, setFilterActivity] = useState<"all" | "success" | "completed">("all");

  // ✅ FETCH DATA
  const { data: patients = [], isLoading: isLoadingPatients, error: patientsError } =
    useQuery<Patient[]>({
      queryKey: ["patients"],
      queryFn: fetchPatients,
    });

  const {
    data: appointments = [],
    isLoading: isLoadingAppointments,
    error: appointmentsError,
  } = useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });

  // ✅ REVENUE
  const totalRevenue = useMemo(() => {
    return appointments.reduce((sum, a) => sum + (a.amount || 0), 0);
  }, [appointments]);

  // ✅ MONTHLY DATA
  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    return months.map((month, index) => {
      const count = patients.filter(p => {
        if (!p.createdAt) return false;
        return new Date(p.createdAt).getMonth() === index;
      }).length;

      return { month, patients: count };
    });
  }, [patients]);

  // ✅ THERAPY DATA
  const therapyData = useMemo(() => {
    const map: Record<string, number> = {};

    appointments.forEach(a => {
      const therapy = a.therapy || "Other";
      map[therapy] = (map[therapy] || 0) + 1;
    });

    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [appointments]);

  // ✅ AI INSIGHTS
  const aiInsights = useMemo(() => {
    if (!appointments.length) return [];

    const completed = appointments.filter(a => a.status === "Completed").length;
    const successRate = ((completed / appointments.length) * 100).toFixed(1);

    return [
      `📈 Success Rate: ${successRate}%`,
      `💰 Revenue: ₹${totalRevenue}`,
      `🧘 Top Therapy: ${therapyData[0]?.name || "N/A"}`,
    ];
  }, [appointments, totalRevenue, therapyData]);

  // ✅ STATS
  const stats = [
    {
      icon: Users,
      label: "Patients",
      value: isLoadingPatients ? "..." : patients.length,
      change: "+12%",
      trend: "up",
    },
    {
      icon: CalendarDays,
      label: "Appointments",
      value: isLoadingAppointments ? "..." : appointments.length,
      change: "+8%",
      trend: "up",
    },
    {
      icon: Leaf,
      label: "Active",
      value: appointments.filter(a => a?.status === "Ongoing").length,
      change: "+5%",
      trend: "up",
    },
    {
      icon: IndianRupee,
      label: "Revenue",
      value: isLoadingAppointments ? "..." : `₹${totalRevenue}`,
      change: "+18%",
      trend: "up",
    },
  ];

  // ✅ TOAST
  useEffect(() => {
    if (appointments.length > 0) {
      toast(`📅 ${appointments.length} appointments loaded`);
    }
  }, [appointments]);

  const hasErrors = patientsError || appointmentsError;

  return (
    <div className="min-h-screen bg-background">

      {/* Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <AnimatedBackground3D />
      </div>

      <div className="relative z-10 p-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p>Welcome back, {user?.name || "Doctor"} 👋</p>
        </div>

        {/* Error */}
        {hasErrors && (
          <div className="bg-red-100 p-3 rounded">
            {patientsError?.message || appointmentsError?.message}
          </div>
        )}

        {/* AI INSIGHTS */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">AI Insights 🤖</h3>
          {aiInsights.map((i, idx) => (
            <p key={idx}>{i}</p>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="p-4 bg-white rounded-xl shadow">
              <s.icon />
              <p>{s.value}</p>
              <p>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Area */}
          <div className="bg-white p-4 rounded-xl">
            <h3>Patient Growth</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area dataKey="patients" stroke="#4ade80" fill="#4ade80" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar */}
          <div className="bg-white p-4 rounded-xl">
            <h3>Therapies</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={therapyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Empty State */}
        {!appointments.length && (
          <div className="text-center">
            <p>No appointments yet</p>
            <Button onClick={() => navigate("/appointments")}>
              Create Appointment
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
