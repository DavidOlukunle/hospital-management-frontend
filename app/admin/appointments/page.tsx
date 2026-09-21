"use client";

import { useEffect, useMemo, useState } from "react";

import { ProtectedRoute } from "@/src/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { useAuth } from "@/src/components/providers/AuthProvider";

import { getAdminAppointments } from "@/src/lib/api/admin";

import type {
  AdminAppointment,
} from "@/src/types/admin";

type AppointmentFilter =
  | "ALL"
  | "PENDING"
  | "APPROVED"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

export default function AdminAppointmentsPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminAppointments />
    </ProtectedRoute>
  );
}

function AdminAppointments() {
  const { token } = useAuth();

  const [appointments, setAppointments] = useState<
    AdminAppointment[]
  >([]);

  const [filter, setFilter] =
    useState<AppointmentFilter>("ALL");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    const authToken = token;

    async function loadAppointments() {
      try {
        const data = await getAdminAppointments(
          authToken,
        );

        setAppointments(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load appointments.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadAppointments();
  }, [token]);

  const filteredAppointments = useMemo(() => {
    if (filter === "ALL") {
      return appointments;
    }

    return appointments.filter(
      (appointment) =>
        appointment.status === filter,
    );
  }, [appointments, filter]);

  const pendingCount = appointments.filter(
    (appointment) =>
      appointment.status === "PENDING",
  ).length;

  const approvedCount = appointments.filter(
    (appointment) =>
      appointment.status === "APPROVED",
  ).length;

  const completedCount = appointments.filter(
    (appointment) =>
      appointment.status === "COMPLETED",
  ).length;

  const cancelledCount = appointments.filter(
    (appointment) =>
      appointment.status === "CANCELLED",
  ).length;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-muted">
            Loading appointments...
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
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Appointments
          </h1>

          <p className="mt-2 text-sm text-muted">
            Monitor all patient appointments across
            CarePoint.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total"
            value={appointments.length}
            variant="neutral"
          />

          <SummaryCard
            label="Pending"
            value={pendingCount}
            variant="warning"
          />

          <SummaryCard
            label="Approved"
            value={approvedCount}
            variant="success"
          />

          <SummaryCard
            label="Completed"
            value={completedCount}
            variant="success"
          />

          <SummaryCard
            label="Cancelled"
            value={cancelledCount}
            variant="neutral"
          />
        </div>

        {/* Filters */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Appointment records
            </h2>

            <p className="mt-1 text-sm text-muted">
              Filter appointments by their current
              status.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterButton
              label="All"
              value="ALL"
              active={filter === "ALL"}
              onClick={setFilter}
            />

            <FilterButton
              label="Pending"
              value="PENDING"
              active={filter === "PENDING"}
              onClick={setFilter}
            />

            <FilterButton
              label="Approved"
              value="APPROVED"
              active={filter === "APPROVED"}
              onClick={setFilter}
            />

            <FilterButton
              label="Completed"
              value="COMPLETED"
              active={filter === "COMPLETED"}
              onClick={setFilter}
            />

            <FilterButton
              label="Rejected"
              value="REJECTED"
              active={filter === "REJECTED"}
              onClick={setFilter}
            />

            <FilterButton
              label="Cancelled"
              value="CANCELLED"
              active={filter === "CANCELLED"}
              onClick={setFilter}
            />
          </div>
        </section>

        {/* Appointment List */}
        <section>
          {filteredAppointments.length === 0 ? (
            <Card className="p-8">
              <p className="text-center text-sm text-muted">
                No appointments match the selected
                filter.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map(
                (appointment) => (
                  <AppointmentCard
                    key={appointment.public_id}
                    appointment={appointment}
                  />
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

function SummaryCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant:
    | "success"
    | "warning"
    | "error"
    | "neutral";
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted">
          {label}
        </p>

        <Badge variant={variant}>
          {label}
        </Badge>
      </div>

      <p className="mt-3 text-3xl font-bold text-foreground">
        {value}
      </p>
    </Card>
  );
}

function FilterButton({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: AppointmentFilter;
  active: boolean;
  onClick: (value: AppointmentFilter) => void;
}) {
  return (
    <Button
      variant={active ? "primary" : "secondary"}
      size="sm"
      onClick={() => onClick(value)}
    >
      {label}
    </Button>
  );
}

function AppointmentCard({
  appointment,
}: {
  appointment: AdminAppointment;
}) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-base font-semibold text-foreground">
                {appointment.reason}
              </h3>

              <StatusBadge
                status={appointment.status}
              />
            </div>

            <p className="mt-1 text-xs text-muted">
              Appointment ID: {appointment.public_id}
            </p>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <p className="text-sm font-semibold text-foreground">
              {formatDate(
                appointment.appointment_date,
              )}
            </p>

            <p className="mt-1 text-sm text-muted">
              {formatTime(
                appointment.appointment_time,
              )}
            </p>
          </div>
        </div>

        {/* Patient + Specialist */}
        <div className="grid gap-6 border-t border-border pt-5 md:grid-cols-2">
          <PersonSection
            title="Patient"
            name={appointment.patient.name}
            secondary={appointment.patient.email}
          />

          <PersonSection
            title="Specialist"
            name={appointment.specialist.name}
            secondary={`${appointment.specialist.specialty.name} · ${appointment.specialist.doctor_number}`}
          />
        </div>

        {/* Specialist room */}
        <div className="grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
          <InfoItem
            label="Room"
            value={appointment.specialist.room_number}
          />

          <InfoItem
            label="Specialty"
            value={
              appointment.specialist.specialty.name
            }
          />

          <InfoItem
            label="Date"
            value={formatDate(
              appointment.appointment_date,
            )}
          />
        </div>

        {/* Notes */}
        {appointment.notes && (
          <div className="border-t border-border pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Patient notes
            </p>

            <p className="mt-2 text-sm leading-6 text-foreground">
              {appointment.notes}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

function PersonSection({
  title,
  name,
  secondary,
}: {
  title: string;
  name: string;
  secondary: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {title}
      </p>

      <p className="mt-2 text-sm font-semibold text-foreground">
        {name}
      </p>

      <p className="mt-1 text-sm text-muted">
        {secondary}
      </p>
    </div>
  );
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

function StatusBadge({
  status,
}: {
  status: AdminAppointment["status"];
}) {
  const config: Record<
    AdminAppointment["status"],
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
    COMPLETED: {
      label: "Completed",
      variant: "success",
    },
    REJECTED: {
      label: "Rejected",
      variant: "error",
    },
    CANCELLED: {
      label: "Cancelled",
      variant: "neutral",
    },
  };

  const current = config[status];

  return (
    <Badge variant={current.variant}>
      {current.label}
    </Badge>
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

function formatTime(
  value: string | null | undefined,
) {
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
