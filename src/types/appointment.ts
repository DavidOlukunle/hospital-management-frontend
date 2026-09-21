export type AppointmentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export type AppointmentSpecialty = {
  name: string;
};

export type AppointmentSpecialist = {
  public_id: string;
  name: string;
  doctor_number: string;
  room_number: string;
  specialty: AppointmentSpecialty;
};

export type AppointmentPatient = {
  public_id: string;
  name: string;
  email: string;
};

export type Appointment = {
  public_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  notes: string | null;
  status: AppointmentStatus;
  specialist: AppointmentSpecialist;
  patient?: AppointmentPatient;
};


export type SpecialistAppointment = {
  public_id: string;
  appointment_date: string;
  appointment_time: string | null;
  reason: string;
  notes: string | null;
  status: AppointmentStatus;
  patient: AppointmentPatient;
};



export type CreateAppointmentData = {
  specialist_public_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  notes?: string;
};

