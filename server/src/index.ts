import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for local dev
  },
});
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("Client connected", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// Patients API
app.get("/api/patients", async (req, res) => {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(patients);
});

app.post("/api/patients", async (req, res) => {
  const newPatient = await prisma.patient.create({
    data: req.body,
  });
  io.emit("patientCreated", newPatient);
  res.status(201).json(newPatient);
});

// Appointments API
app.get("/api/appointments", async (req, res) => {
  const appointments = await prisma.appointment.findMany({
    include: { patient: true },
    orderBy: { createdAt: "desc" },
  });
  // Format to match frontend structure loosely
  const formatted = appointments.map((a) => ({
    id: a.id,
    patient: a.patient.name,
    patientId: a.patientId,
    therapy: a.therapy,
    date: a.date,
    time: a.time,
    status: a.status,
  }));
  res.json(formatted);
});

app.post("/api/appointments", async (req, res) => {
  const { patientId, ...data } = req.body;
  const newAppointment = await prisma.appointment.create({
    data: {
      ...data,
      patient: {
        connect: { id: patientId },
      },
    },
    include: { patient: true },
  });

  const formatted = {
    id: newAppointment.id,
    patient: newAppointment.patient.name,
    patientId: newAppointment.patientId,
    therapy: newAppointment.therapy,
    date: newAppointment.date,
    time: newAppointment.time,
    status: newAppointment.status,
  };

  io.emit("appointmentCreated", formatted);

  // Auto create a notification for scheduling
  const notif = await prisma.notification.create({
    data: {
      title: "New Appointment",
      message: `Appointment scheduled for ${formatted.patient} on ${formatted.date} at ${formatted.time}`,
      type: "info",
    },
  });
  io.emit("notificationCreated", notif);

  res.status(201).json(formatted);
});

// Notifications API
app.get("/api/notifications", async (req, res) => {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(notifications);
});

app.patch("/api/notifications/:id/read", async (req, res) => {
  const notif = await prisma.notification.update({
    where: { id: req.params.id },
    data: { read: true },
  });
  io.emit("notificationUpdated", notif);
  res.json(notif);
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
