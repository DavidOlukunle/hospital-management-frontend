export type AdminDashboardStats = {
  users: {
    total: number;
    patients: number;
    specialists: number;
    admins: number;
  };

  specialist_applications: {
    pending: number;
    approved: number;
    rejected: number;
  };

  appointments: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    completed: number;
    cancelled: number;
  };
};

export type AdminSpecialist = {
  public_id: string;
  name: string;
  doctor_number: string;
  room_number: string;
  bio: string | null;
  profile_image: string | null;
  approval_status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED";
  approved_at: string | null;
  specialty: {
    id: number;
    name: string;
    description: string | null;
  };
};

export type AdminUser = {
  public_id: string;
  name: string;
  email: string;
  role: "PATIENT" | "SPECIALIST" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  profile_image: string | null;

  specialist?: {
    doctor_number: string;
    room_number: string;
    approval_status:
      | "PENDING"
      | "APPROVED"
      | "REJECTED";
    approved_at: string | null;
    specialty: {
      id: number;
      name: string;
    };
  };
};

export type AdminAppointment = {
  public_id: string;
  appointment_date: string;
  appointment_time: string | null;
  reason: string;
  notes: string | null;

  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "COMPLETED"
    | "CANCELLED";

  patient: {
    public_id: string;
    name: string;
    email: string;
  };

  specialist: {
    public_id: string;
    name: string;
    doctor_number: string;
    room_number: string;
    specialty: {
      id: number;
      name: string;
    };
  };
};

