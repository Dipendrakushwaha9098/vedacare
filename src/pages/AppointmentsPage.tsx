import { useState, useEffect, createElement } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Plus, Clock, CheckCircle2, AlertCircle, Calendar,
  Search, Phone, MessageSquare, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ✅ Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("appointments");
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  // ✅ Create Appointment
  const handleCreate = () => {
    if (!newForm.patient || !newForm.therapy || !newForm.date || !newForm.time) {
      alert("Please fill all fields");
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patient: newForm.patient,
      patientId: newForm.patient,
      therapy: newForm.therapy,
      date: newForm.date,
      time: newForm.time,
      status: "Scheduled",
      notes: newForm.notes,
    };

    setAppointments((prev) => [...prev, newAppointment]);

    setDialogOpen(false);
    setNewForm({ patient: "", therapy: "", date: "", time: "", notes: "" });
  };

  // ✅ Delete Appointment
  const handleDelete = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirm(null);
  };

  // ✅ Filtering
  const filtered = appointments.filter((appt) => {
    return (
      (appt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.therapy.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "All" || appt.status === statusFilter) &&
      (!dateFilter || appt.date === dateFilter)
    );
  });

  const grouped: Record<string, Appointment[]> = {};
  filtered.forEach((a) => {
    if (!grouped[a.date]) grouped[a.date] = [];
    grouped[a.date].push(a);
  });

  const dates = Object.keys(grouped).sort();

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 opacity-10">
        <AnimatedCubes3D />
      </div>

      <div className="relative z-10 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Appointments</h1>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Appointment</DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                <Input placeholder="Patient"
                  value={newForm.patient}
                  onChange={(e) => setNewForm({ ...newForm, patient: e.target.value })}
                />

                <Select onValueChange={(v) => setNewForm({ ...newForm, therapy: v })}>
                  <SelectTrigger><SelectValue placeholder="Therapy" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Abhyanga">Abhyanga (Oil Massage)</SelectItem>
                      <SelectItem value="Shirodhara">Shirodhara</SelectItem>
                      <SelectItem value="Vamana">Vamana (Therapeutic Emesis)</SelectItem>
                      <SelectItem value="Virechana">Virechana (Purgation Therapy)</SelectItem>
                      <SelectItem value="Basti">Basti (Medicated Enema)</SelectItem>
                      <SelectItem value="Nasya">Nasya (Nasal Therapy)</SelectItem>
                      <SelectItem value="Raktamokshana">Raktamokshana (Blood Detox)</SelectItem>
                      <SelectItem value="Pizhichil">Pizhichil (Oil Bath Therapy)</SelectItem>
                      <SelectItem value="Kati Basti">Kati Basti (Back Pain Therapy)</SelectItem>
                      <SelectItem value="Udwarthanam">Udwarthanam (Herbal Powder Massage)</SelectItem>
                  </SelectContent>
                </Select>

                <Input type="date"
                  value={newForm.date}
                  onChange={(e) => setNewForm({ ...newForm, date: e.target.value })}
                />

                <Input type="time"
                  value={newForm.time}
                  onChange={(e) => setNewForm({ ...newForm, time: e.target.value })}
                />

                <Button onClick={handleCreate}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* List */}
        {dates.length === 0 ? (
          <p>No appointments</p>
        ) : (
          dates.map((date) => (
            <div key={date}>
              <h2 className="font-bold">{date}</h2>

              {grouped[date].map((appt) => {
                const Icon = STATUS_ICONS[appt.status];

                return (
                  <div key={appt.id} className="p-3 border rounded flex justify-between">
                    <div>
                      <p>{appt.patient}</p>
                      <p className="text-sm">{appt.therapy}</p>
                    </div>

                    <div className="flex gap-2">
                      <Badge className={STATUS_COLORS[appt.status]}>
                        {createElement(Icon, { className: "w-3 h-3 mr-1" })}
                        {appt.status}
                      </Badge>

                      <button onClick={() => setDeleteConfirm(appt.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}

        {/* Delete Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-4 rounded">
              <p>Delete this appointment?</p>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => handleDelete(deleteConfirm)}>Yes</Button>
                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>No</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}