import { useState, useEffect, createElement } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Plus, Clock, CheckCircle2, AlertCircle, Calendar,
  Search, X, Phone, MessageSquare, Eye, ChevronDown,
  Trash2, Edit2, Eye as EyeIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAppointments, createAppointment } from "@/lib/api";
import { useSocket } from "@/hooks/useSocket";
import { AnimatedCubes3D } from "@/components/AnimatedCubes3D";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type AppointmentStatus = "Scheduled" | "Ongoing" | "Completed";

type Appointment = {
  id: string;
  patient: string;
  patientId: string;
  therapy: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  therapist?: string;
  notes?: string;
};

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  Scheduled: "bg-blue-100 text-blue-800",
  Ongoing: "bg-green-100 text-green-800",
  Completed: "bg-gray-100 text-gray-800",
};

const STATUS_ICONS: Record<AppointmentStatus, React.ElementType> = {
  Scheduled: Clock,
  Ongoing: AlertCircle,
  Completed: CheckCircle2,
};


export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "All">("All");
  const [dateFilter, setDateFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    patient: "",
    therapy: "",
    date: "",
    time: "",
    notes: "",
  });
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
    staleTime: 5 * 60 * 1000,
  });

  const { socket } = useSocket();

  // Listen for appointment updates
  useEffect(() => {
    if (!socket) return;
    socket.on("appointment:update", () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    });
    return () => {
      socket.off("appointment:update");
    };
  }, [socket, queryClient]);

  const createMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setDialogOpen(false);
      setNewForm({ patient: "", therapy: "", date: "", time: "", notes: "" });
    },
  });

  const handleCreate = async () => {
    if (!newForm.patient || !newForm.therapy || !newForm.date || !newForm.time) {
      alert("Please fill in all required fields");
      return;
    }

    createMutation.mutate({
      patientId: newForm.patient,
      therapy: newForm.therapy,
      date: newForm.date,
      time: newForm.time,
      notes: newForm.notes,
    });
  };

  // Filter appointments
  let filteredAppointments = appointments.filter((appt: Appointment) => {
    const matchesSearch =
      appt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.therapy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || appt.status === statusFilter;
    const matchesDate = !dateFilter || appt.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const groupedByDate: Record<string, Appointment[]> = {};
  filteredAppointments.forEach((appt: Appointment) => {
    if (!groupedByDate[appt.date]) {
      groupedByDate[appt.date] = [];
    }
    groupedByDate[appt.date].push(appt);
  });

  const sortedDates = Object.keys(groupedByDate).sort();

  return (
    <div className="min-h-screen bg-background">
      {/* 3D Animated Background */}
      <div className="fixed top-0 left-0 w-screen h-screen opacity-15 pointer-events-none z-0">
        <AnimatedCubes3D />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Appointments
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {appointments.length} total appointments
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="gradient-sage text-primary-foreground border-0 btn-ripple w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Schedule Appointment
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="bg-card border-border w-full max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">Schedule New Appointment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="patient" className="text-sm font-medium">Patient *</Label>
                    <Input
                      id="patient"
                      placeholder="Select patient"
                      value={newForm.patient}
                      onChange={(e) => setNewForm({ ...newForm, patient: e.target.value })}
                      className="mt-1.5 bg-background border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="therapy" className="text-sm font-medium">Therapy *</Label>
                    <Select value={newForm.therapy} onValueChange={(val) => setNewForm({ ...newForm, therapy: val })}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select therapy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Abhyanga">Abhyanga</SelectItem>
                        <SelectItem value="Shirodhara">Shirodhara</SelectItem>
                        <SelectItem value="Vamana">Vamana</SelectItem>
                        <SelectItem value="Virechana">Virechana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date" className="text-sm font-medium">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newForm.date}
                        onChange={(e) => setNewForm({ ...newForm, date: e.target.value })}
                        className="mt-1.5 bg-background border-border"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-sm font-medium">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newForm.time}
                        onChange={(e) => setNewForm({ ...newForm, time: e.target.value })}
                        className="mt-1.5 bg-background border-border"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                    <Input
                      id="notes"
                      placeholder="Additional notes..."
                      value={newForm.notes}
                      onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
                      className="mt-1.5 bg-background border-border"
                    />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button
                      onClick={handleCreate}
                      disabled={createMutation.isPending}
                      className="w-full gradient-sage text-primary-foreground border-0"
                    >
                      {createMutation.isPending ? "Scheduling..." : "Schedule"}
                    </Button>
                  </motion.div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by patient or therapy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
              <SelectTrigger className="w-full sm:w-40 bg-background border-border">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-40 bg-background border-border"
            />
          </div>
        </motion.div>

        {/* Appointments by Date */}
        <AnimatePresence mode="popLayout">
          {sortedDates.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">No appointments found</p>
            </motion.div>
          ) : (
            sortedDates.map((date) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {groupedByDate[date].map((appt: Appointment, idx: number) => {
                        const StatusIcon = STATUS_ICONS[appt.status];
                        return (
                          <motion.div
                            key={appt.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedAppointment(appt)}
                            className="group relative p-4 rounded-lg border border-border bg-card/50 backdrop-blur hover:bg-card/80 cursor-pointer transition-all"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-foreground">{appt.patient}</h3>
                                  <Badge className={`${STATUS_COLORS[appt.status]} border-0 text-xs`}>
                                    {createElement(StatusIcon, { className: "w-3 h-3 mr-1" })}
                                    {appt.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{appt.therapy}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {appt.time}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                                >
                                  <Phone className="w-4 h-4 text-muted-foreground" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                                >
                                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setDeleteConfirm(appt.id)}
                                  className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card border border-border rounded-lg max-w-sm w-full overflow-hidden shadow-xl"
              >
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-red-100">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <h2 className="font-display text-lg font-bold text-foreground text-center mb-2">
                    Cancel Appointment?
                  </h2>
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    This appointment will be cancelled. This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors font-medium"
                    >
                      Keep Appointment
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
