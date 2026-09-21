import { apiClient } from "./client";

import type {
  Appointment,
  CreateAppointmentData,
  SpecialistAppointment,
} from "@/src/types/appointment";

type AppointmentsResponse = {
  appointments: Appointment[];
};

type SpecialistAppointmentsResponse = {
  appointments: SpecialistAppointment[];
};

export async function getPatientAppointments(
  token: string,
): Promise<Appointment[]> {
  const response = await apiClient<AppointmentsResponse>(
    "/patient/appointments",
    {
      method: "GET",
      token,
    },
  );

  return response.appointments;
}

export async function createPatientAppointment(
  token: string,
  data: CreateAppointmentData,
): Promise<Appointment> {
  const response = await apiClient<{
    appointment: Appointment;
  }>("/patient/appointments", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });

  return response.appointment;
}

export async function cancelPatientAppointment(
  token: string,
  publicId: string,
): Promise<Appointment> {
  const response = await apiClient<{
    appointment: Appointment;
  }>(`/patient/appointments/${publicId}/cancel`, {
    method: "PATCH",
    token,
  });

  return response.appointment;
}

export async function getSpecialistAppointments(
  token: string,
): Promise<SpecialistAppointment[]> {
  const response = await apiClient<
    SpecialistAppointmentsResponse
  >("/specialist/appointments", {
    method: "GET",
    token,
  });

  return response.appointments;
}

export async function updateSpecialistAppointmentStatus(
  token: string,
  publicId: string,
  status:
    | "APPROVED"
    | "REJECTED"
    | "COMPLETED"
    | "CANCELLED",
): Promise<SpecialistAppointment> {
  const response = await apiClient<{
    appointment: SpecialistAppointment;
  }>(`/specialist/appointments/${publicId}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({
      status,
    }),
  });

  return response.appointment;
}



