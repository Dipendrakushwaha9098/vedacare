const API_URL = "http://localhost:3001/api";

export const fetchPatients = async () => {
  const res = await fetch(`${API_URL}/patients`);
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
};

export const createPatient = async (data: any) => {
  const res = await fetch(`${API_URL}/patients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create patient");
  return res.json();
};

export const deletePatient = async (id: string) => {
  const res = await fetch(`${API_URL}/patients/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to delete patient");
  return res.json();
};

export const fetchAppointments = async () => {
  const res = await fetch(`${API_URL}/appointments`);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
};

export const createAppointment = async (data: any) => {
  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create appointment");
  return res.json();
};

export const fetchNotifications = async () => {
  const res = await fetch(`${API_URL}/notifications`);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
};

export const markNotificationRead = async (id: string) => {
  const res = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to mark notification read");
  return res.json();
};
