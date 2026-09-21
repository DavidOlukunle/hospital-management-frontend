export type SpecialistApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type Specialty = {
  id: number;
  name: string;
  description: string | null;
};

export type Specialist = {
  public_id: string;
  name: string;
  email: string;
  doctor_number: string;
  room_number: string;
  bio: string | null;
  profile_image: string | null;
  approval_status: SpecialistApprovalStatus;
  specialty: Specialty;
};

export type SpecialistProfile = {
  public_id: string;
  name: string;
  doctor_number: string;
  room_number: string;
  bio: string | null;
  profile_image: string | null;
  approval_status: SpecialistApprovalStatus;
  approved_at: string | null;
  specialty: Specialty;
};

