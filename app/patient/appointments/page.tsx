"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ProtectedRoute } from "@/src/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { useAuth } from "@/src/components/providers/AuthProvider";
import {
  cancelPatientAppointment,
  getPatientAppointments,
} from "@/src/lib/api/appointment";

import type {
  Appointment,
  AppointmentStatus,
} from "@/src/types/appointment";

export default function PatientAppointmentsPage() {
  return (
    <ProtectedRoute allowedRoles={["PATIENT"]}>
      <AppointmentsPage />
    </ProtectedRoute>
  );
}

function AppointmentsPage() {
  const { token } = useAuth();

  const [appointments, setAppointments] = useState<
    Appointment[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancellingId, setCancellingId] =
    useState<string | null>(null);
useEffect(() => {
  if (!token) {
    return;
  }

  const authToken = token;

  async function loadAppointments() {
    try {
      const data = await getPatientAppointments(authToken);

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

  async function handleCancel(publicId: string) {
    if (!token) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) {
      return;
    }

    setCancellingId(publicId);
    setError("");

    try {
      const updatedAppointment =
        await cancelPatientAppointment(
          token,
          publicId,
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
          : "Unable to cancel appointment.",
      );
    } finally {
      setCancellingId(null);
    }
  }

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "PENDING" ||
      appointment.status === "APPROVED",
  );

  const pastAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "COMPLETED" ||
      appointment.status === "REJECTED" ||
      appointment.status === "CANCELLED",
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My appointments
          </h1>

          <p className="mt-2 text-muted">
            View and manage your appointments.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-error/20 bg-red-50 px-4 py-3 text-sm text-error"
          >
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-border bg-white p-10 text-center text-sm text-muted">
            Loading appointments...
          </div>
        ) : (
          <>
            <AppointmentSection
              title="Upcoming appointments"
              appointments={upcomingAppointments}
              emptyMessage="You don't have any upcoming appointments."
              cancellingId={cancellingId}
              onCancel={handleCancel}
            />

            <AppointmentSection
              title="Past appointments"
              appointments={pastAppointments}
              emptyMessage="You don't have any past appointments."
              cancellingId={cancellingId}
              onCancel={handleCancel}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

type AppointmentSectionProps = {
  title: string;
  appointments: Appointment[];
  emptyMessage: string;
  cancellingId: string | null;
  onCancel: (publicId: string) => void;
};

function AppointmentSection({
  title,
  appointments,
  emptyMessage,
  cancellingId,
  onCancel,
}: AppointmentSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">
        {title}
      </h2>

      {appointments.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-muted">
            {emptyMessage}
          </p>

          <Link
            href="/patient/specialists"
            className="mt-4 inline-flex"
          >
            <Button size="sm">
              Find a specialist
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.public_id}
              appointment={appointment}
              cancellingId={cancellingId}
              onCancel={onCancel}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type AppointmentCardProps = {
  appointment: Appointment;
  cancellingId: string | null;
  onCancel: (publicId: string) => void;
};

function AppointmentCard({
  appointment,
  cancellingId,
  onCancel,
}: AppointmentCardProps) {
  const canCancel =
    appointment.status === "PENDING" ||
    appointment.status === "APPROVED";

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold">
              {appointment.specialist?.name ?? "Unknown specialist"}
            </h3>

            <StatusBadge
              status={appointment.status}
            />
          </div>

          <p className="mt-1 text-sm font-medium text-primary">
            {appointment.specialist?.specialty.name ?? "Unknown specialty"}
          </p>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
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

            <InfoItem
              label="Room"
              value={appointment.specialist?.room_number ?? "Unknown room"}
            />
          </div>

          {appointment.notes && (
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Notes
              </p>

              <p className="mt-1 text-sm leading-6 text-foreground">
                {appointment.notes}
              </p>
            </div>
          )}
        </div>

        {canCancel && (
          <Button
            variant="danger"
            size="sm"
            disabled={
              cancellingId === appointment.public_id
            }
            onClick={() =>
              onCancel(appointment.public_id)
            }
          >
            {cancellingId === appointment.public_id
              ? "Cancelling..."
              : "Cancel"}
          </Button>
        )}
      </div>
    </Card>
  );
}

type StatusBadgeProps = {
  status: AppointmentStatus;
};

function StatusBadge({
  status,
}: StatusBadgeProps) {
  const variant =
    status === "APPROVED" ||
    status === "COMPLETED"
      ? "success"
      : status === "PENDING"
        ? "warning"
        : status === "REJECTED"
          ? "error"
          : "neutral";

  return (
    <Badge variant={variant}>
      {status}
    </Badge>
  );
}

type InfoItemProps = {
  label: string;
  value: string;
};

function InfoItem({
  label,
  value,
}: InfoItemProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value}
      </p>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatTime(value: string) {
  const [hours, minutes] = value
    .split(":")
    .map(Number);

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
