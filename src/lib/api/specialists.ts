import { apiClient } from "./client";

import type {
  Specialist,
  SpecialistProfile,
  Specialty,
} from "@/src/types/specialist";

type SpecialistsResponse = {
  specialists: Specialist[];
};

type SpecialtiesResponse = {
  specialties: Specialty[];
};

export type RegisterSpecialistPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  specialty_id: number;
  doctor_number: string;
  room_number?: string;
  bio?: string;
};

export type RegisterSpecialistResponse = {
  message: string;
  user: {
    public_id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };
  specialist_profile: {
    doctor_number: string;
    room_number: string | null;
    bio: string | null;
    approval_status: string;
    specialty: {
      id: number;
      name: string;
    };
  };
};

export async function getSpecialists(): Promise<Specialist[]> {
  const response = await apiClient<SpecialistsResponse>(
    "/specialists",
    {
      method: "GET",
    },
  );

  return response.specialists;
}

export async function getSpecialist(
  publicId: string,
): Promise<Specialist> {
  const response = await apiClient<{
    specialist: Specialist;
  }>(`/specialists/${publicId}`, {
    method: "GET",
  });

  return response.specialist;
}

export async function getSpecialties(): Promise<Specialty[]> {
  const response = await apiClient<SpecialtiesResponse>(
    "/specialties",
    {
      method: "GET",
    },
  );

  return response.specialties;
}

export async function registerSpecialist(
  payload: RegisterSpecialistPayload,
): Promise<RegisterSpecialistResponse> {
  return apiClient<RegisterSpecialistResponse>(
    "/specialists/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function getSpecialistProfile(
  token: string,
): Promise<SpecialistProfile> {
  const response = await apiClient<{
    specialist: SpecialistProfile;
  }>("/specialist/profile", {
    method: "GET",
    token,
  });

  return response.specialist;
}

