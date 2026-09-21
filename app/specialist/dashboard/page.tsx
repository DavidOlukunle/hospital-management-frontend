"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/src/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { useAuth } from "@/src/components/providers/AuthProvider";

import {
  getSpecialistAppointments,
  updateSpecialistAppointmentStatus,
} from "@/src/lib/api/appointment";

import { getSpecialistProfile } from "@/src/lib/api/specialists";

import type {
  AppointmentStatus,
  SpecialistAppointment,
} from "@/src/types/appointment";

import type { SpecialistProfile } from "@/src/types/specialist";

export default function SpecialistDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["SPECIALIST"]}>
      <SpecialistDashboard />
    </ProtectedRoute>
  );
}

function SpecialistDashboard() {
  const { user, token } = useAuth();

  const [profile, setProfile] =
    useState<SpecialistProfile | null>(null);

  const [appointments, setAppointments] = useState<
    SpecialistAppointment[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    const authToken = token;

    async function loadDashboard() {
      try {
        const profileData = await getSpecialistProfile(
          authToken,
        );

        setProfile(profileData);

        if (profileData.approval_status === "APPROVED") {
          const appointmentsData =
            await getSpecialistAppointments(authToken);

          setAppointments(appointmentsData);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [token]);

  async function handleStatusUpdate(
    publicId: string,
    status:
      | "APPROVED"
      | "REJECTED"
      | "COMPLETED"
      | "CANCELLED",
  ) {
    if (!token) {
      return;
    }

    const authToken = token;

    setUpdatingId(publicId);
    setError("");

    try {
      const updatedAppointment =
        await updateSpecialistAppointmentStatus(
          authToken,
          publicId,
          status,
        );

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.public_id === publicId
            ? updatedAppointment
            : appointment,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update appointment.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "PENDING",
  ).length;

  const approvedCount = appointments.filter(
    (appointment) => appointment.status === "APPROVED",
  ).length;

  const completedCount = appointments.filter(
    (appointment) => appointment.status === "COMPLETED",
  ).length;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-muted">
            Loading your dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-primary">
            Specialist Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {profile?.name ?? user?.name}
          </h1>

          <p className="mt-2 text-sm text-muted">
            Manage your specialist profile and appointments.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        {/* Specialist Profile */}
        {profile && (
          <SpecialistProfileCard profile={profile} />
        )}

        {/* Statistics */}
        {profile?.approval_status === "APPROVED" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total appointments"
              value={appointments.length}
            />

            <StatCard
              label="Pending"
              value={pendingCount}
            />

            <StatCard
              label="Approved"
              value={approvedCount}
            />

            <StatCard
              label="Completed"
              value={completedCount}
            />
          </div>
        )}

        {/* Appointments / Approval Notice */}
        {profile?.approval_status === "APPROVED" ? (
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Appointments
              </h2>

              <p className="mt-1 text-sm text-muted">
                Review and manage your patient appointments.
              </p>
            </div>

            {appointments.length === 0 ? (
              <Card className="p-8">
                <p className="text-center text-sm text-muted">
                  You do not have any appointments yet.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.public_id}
                    appointment={appointment}
                    isUpdating={
                      updatingId === appointment.public_id
                    }
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          <ApprovalNotice
            status={profile?.approval_status}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

function SpecialistProfileCard({
  profile,
}: {
  profile: SpecialistProfile;
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {profile.name}
            </h2>

            <p className="mt-1 text-sm text-muted">
              {profile.specialty.name}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              label="Doctor number"
              value={profile.doctor_number}
            />

            <InfoItem
              label="Room number"
              value={profile.room_number}
            />

            <InfoItem
              label="Specialty"
              value={profile.specialty.name}
            />
          </div>

          {profile.bio && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                About
              </p>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-foreground">
                {profile.bio}
              </p>
            </div>
          )}
        </div>

        <ApprovalStatus
          status={profile.approval_status}
          approvedAt={profile.approved_at}
        />
      </div>
    </Card>
  );
}

function ApprovalStatus({
  status,
  approvedAt,
}: {
  status: SpecialistProfile["approval_status"];
  approvedAt: string | null;
}) {
  if (status === "APPROVED") {
    return (
      <div className="shrink-0 rounded-xl border border-green-200 bg-green-50 p-4">
        <Badge variant="success">Approved</Badge>

        {approvedAt && (
          <p className="mt-2 text-xs text-green-700">
            Approved {formatDate(approvedAt)}
          </p>
        )}
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="shrink-0 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <Badge variant="warning">
          Pending approval
        </Badge>

        <p className="mt-2 max-w-xs text-xs leading-5 text-amber-700">
          Your specialist account is awaiting administrator
          approval.
        </p>
      </div>
    );
  }

  return (
    <div className="shrink-0 rounded-xl border border-red-200 bg-red-50 p-4">
      <Badge variant="error">
        Application rejected
      </Badge>

      <p className="mt-2 max-w-xs text-xs leading-5 text-red-700">
        Your specialist application has not been approved.
      </p>
    </div>
  );
}

function ApprovalNotice({
  status,
}: {
  status: "PENDING" | "REJECTED" | undefined;
}) {
  if (status === "PENDING") {
    return (
      <Card className="border-amber-200 bg-amber-50 p-8">
        <div className="max-w-2xl">
          <Badge variant="warning">
            Pending approval
          </Badge>

          <h2 className="mt-3 text-lg font-semibold text-foreground">
            Your specialist account is awaiting approval
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            Your profile has been submitted successfully.
            An administrator needs to approve your specialist
            account before you can manage patient
            appointments.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-red-200 bg-red-50 p-8">
      <div className="max-w-2xl">
        <Badge variant="error">
          Application rejected
        </Badge>

        <h2 className="mt-3 text-lg font-semibold text-foreground">
          Your specialist application was rejected
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Your specialist profile is currently not
          approved for appointment management. Please
          contact the hospital administrator for more
          information.
        </p>
      </div>
    </Card>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-muted">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-foreground">
        {value}
      </p>
    </Card>
  );
}

function AppointmentCard({
  appointment,
  isUpdating,
  onStatusUpdate,
}: {
  appointment: SpecialistAppointment;
  isUpdating: boolean;
  onStatusUpdate: (
    publicId: string,
    status:
      | "APPROVED"
      | "REJECTED"
      | "COMPLETED"
      | "CANCELLED",
  ) => Promise<void>;
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-5">
          {/* Patient */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-base font-semibold text-foreground">
                {appointment.patient.name}
              </h3>

              <StatusBadge status={appointment.status} />
            </div>

            <p className="mt-1 text-sm text-muted">
              {appointment.patient.email}
            </p>
          </div>

          {/* Appointment details */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              label="Date"
              value={formatDate(
                appointment.appointment_date,
              )}
            />

            <InfoItem
              label="Time"
              value={formatTime(
                appointment.appointment_time,
              )}
            />

            <InfoItem
              label="Reason"
              value={appointment.reason}
            />
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Patient notes
              </p>

              <p className="mt-1 text-sm leading-6 text-foreground">
                {appointment.notes}
              </p>
            </div>
          )}
        </div>

        <AppointmentActions
          appointment={appointment}
          isUpdating={isUpdating}
          onStatusUpdate={onStatusUpdate}
        />
      </div>
    </Card>
  );
}

function AppointmentActions({
  appointment,
  isUpdating,
  onStatusUpdate,
}: {
  appointment: SpecialistAppointment;
  isUpdating: boolean;
  onStatusUpdate: (
    publicId: string,
    status:
      | "APPROVED"
      | "REJECTED"
      | "COMPLETED"
      | "CANCELLED",
  ) => Promise<void>;
}) {
  if (appointment.status === "PENDING") {
    return (
      <div className="flex shrink-0 gap-2">
        <Button
          size="sm"
          disabled={isUpdating}
          onClick={() =>
            onStatusUpdate(
              appointment.public_id,
              "APPROVED",
            )
          }
        >
          Approve
        </Button>

        <Button
          variant="danger"
          size="sm"
          disabled={isUpdating}
          onClick={() =>
            onStatusUpdate(
              appointment.public_id,
              "REJECTED",
            )
          }
        >
          Reject
        </Button>
      </div>
    );
  }

  if (appointment.status === "APPROVED") {
    return (
      <div className="flex shrink-0 gap-2">
        <Button
          size="sm"
          disabled={isUpdating}
          onClick={() =>
            onStatusUpdate(
              appointment.public_id,
              "COMPLETED",
            )
          }
        >
          Complete
        </Button>

        <Button
          variant="danger"
          size="sm"
          disabled={isUpdating}
          onClick={() =>
            onStatusUpdate(
              appointment.public_id,
              "CANCELLED",
            )
          }
        >
          Cancel
        </Button>
      </div>
    );
  }

  return null;
}

function StatusBadge({
  status,
}: {
  status: AppointmentStatus;
}) {
  const config: Record<
    AppointmentStatus,
    {
      label: string;
      variant:
        | "success"
        | "warning"
        | "error"
        | "neutral";
    }
  > = {
    PENDING: {
      label: "Pending",
      variant: "warning",
    },
    APPROVED: {
      label: "Approved",
      variant: "success",
    },
    REJECTED: {
      label: "Rejected",
      variant: "error",
    },
    COMPLETED: {
      label: "Completed",
      variant: "success",
    },
    CANCELLED: {
      label: "Cancelled",
      variant: "neutral",
    },
  };

  const { label, variant } = config[status];

  return <Badge variant={variant}>{label}</Badge>;
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
}

function formatTime(value: string | null | undefined) {
  if (!value || typeof value !== "string") {
    return "Time unavailable";
  }

  const [hours, minutes] = value
    .split(":")
    .map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return "Time unavailable";
  }

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

