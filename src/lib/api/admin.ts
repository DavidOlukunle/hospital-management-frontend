import { apiClient } from "./client";

import type {
  AdminAppointment,
  AdminDashboardStats,
  AdminSpecialist,
  AdminUser,
} from "@/src/types/admin";

type SpecialistApprovalResponse = {
  message: string;
  specialist: {
    public_id: string;
    name: string;
    email: string;
    approval_status: "APPROVED" | "REJECTED";
    approved_at: string | null;
  };
};

export async function getAdminDashboard(
  token: string,
): Promise<AdminDashboardStats> {
  return apiClient<AdminDashboardStats>(
    "/admin/dashboard",
    {
      method: "GET",
      token,
    },
  );
}

export async function getAdminSpecialists(
  token: string,
): Promise<AdminSpecialist[]> {
  const response = await apiClient<{
    specialists: AdminSpecialist[];
  }>("/admin/specialists", {
    method: "GET",
    token,
  });

  return response.specialists;
}

export async function getAdminUsers(
  token: string,
): Promise<AdminUser[]> {
  const response = await apiClient<{
    users: AdminUser[];
  }>("/admin/users", {
    method: "GET",
    token,
  });

  return response.users;
}

export async function getAdminAppointments(
  token: string,
): Promise<AdminAppointment[]> {
  const response = await apiClient<{
    appointments: AdminAppointment[];
  }>("/admin/appointments", {
    method: "GET",
    token,
  });

  return response.appointments;
}

export async function approveSpecialist(
  token: string,
  publicId: string,
): Promise<SpecialistApprovalResponse> {
  return apiClient<SpecialistApprovalResponse>(
    `/admin/specialists/${publicId}/approve`,
    {
      method: "POST",
      token,
    },
  );
}

export async function rejectSpecialist(
  token: string,
  publicId: string,
): Promise<SpecialistApprovalResponse> {
  return apiClient<SpecialistApprovalResponse>(
    `/admin/specialists/${publicId}/reject`,
    {
      method: "POST",
      token,
    },
  );
}