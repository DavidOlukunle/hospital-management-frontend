import { apiClient } from "./client";

import type { Specialist,   SpecialistProfile, } from "@/src/types/specialist";

type SpecialistsResponse = {
  specialists: Specialist[];
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

