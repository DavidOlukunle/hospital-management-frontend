"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ProtectedRoute } from "@/src/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { useAuth } from "@/src/components/providers/AuthProvider";
import { getPatientAppointments } from "@/src/lib/api/appointment";

import type { Appointment } from "@/src/types/appointment";

export default function PatientDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["PATIENT"]}>
      <PatientDashboard />
    </ProtectedRoute>
  );
}

function PatientDashboard() {
  const { user, token } = useAuth();

  const [appointments, setAppointments] = useState<
    Appointment[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      
      return;
    }

    const authToken = token;

    async function loadAppointments() {
      try {
        const data =
          await getPatientAppointments(authToken);

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

  const upcomingAppointments = appointments
    .filter(
      (appointment) =>
        appointment.status === "PENDING" ||
        appointment.status === "APPROVED",
    )
    .sort(
      (a, b) =>
        new Date(a.appointment_date).getTime() -
        new Date(b.appointment_date).getTime(),
    );

  const completedCount = appointments.filter(
    (appointment) =>
      appointment.status === "COMPLETED",
  ).length;

  const cancelledCount = appointments.filter(
    (appointment) =>
      appointment.status === "CANCELLED",
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <section>
          <p className="text-sm font-medium text-primary">
            Patient dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}
          </h1>

          <p className="mt-2 text-muted">
            Keep track of your appointments and find
            the right specialist for your healthcare needs.
          </p>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-error/20 bg-red-50 px-4 py-3 text-sm text-error"
          >
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Upcoming"
            value={
              isLoading
                ? "—"
                : upcomingAppointments.length
            }
            description="Pending or approved"
          />

          <StatCard
            label="Completed"
            value={
              isLoading
                ? "—"
                : completedCount
            }
            description="Completed appointments"
          />

          <StatCard
            label="Cancelled"
            value={
              isLoading
                ? "—"
                : cancelledCount
            }
            description="Cancelled appointments"
          />
        </section>

        {/* Upcoming appointments */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                Upcoming appointments
              </h2>

              <p className="mt-1 text-sm text-muted">
                Your next scheduled appointments.
              </p>
            </div>

            <Link
              href="/patient/appointments"
              className="text-sm font-semibold text-primary hover:text-primary-dark"
            >
              View all
            </Link>
          </div>

          {isLoading ? (
            <Card className="p-8 text-center">
              <p className="text-sm text-muted">
                Loading appointments...
              </p>
            </Card>
          ) : upcomingAppointments.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <h3 className="font-semibold">
                  No upcoming appointments
                </h3>

                <p className="mt-2 text-sm text-muted">
                  Find a specialist and book an
                  appointment when you need one.
                </p>

                <Link
                  href="/patient/specialists"
                  className="mt-5 inline-flex"
                >
                  <Button>
                    Find a specialist
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {upcomingAppointments
                .slice(0, 3)
                .map((appointment) => (
                  <UpcomingAppointment
                    key={appointment.public_id}
                    appointment={appointment}
                  />
                ))}
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="text-xl font-bold">
            Quick actions
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <QuickAction
              href="/patient/specialists"
              title="Find a specialist"
              description="Browse approved specialists and view their profiles."
            />

            <QuickAction
              href="/patient/appointments"
              title="View appointments"
              description="See your upcoming and past appointments."
            />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

type StatCardProps = {
  label: string;
  value: number | string;
  description: string;
};

function StatCard({
  label,
  value,
  description,
}: StatCardProps) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-muted">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted">
        {description}
      </p>
    </Card>
  );
}

type UpcomingAppointmentProps = {
  appointment: Appointment;
};

function UpcomingAppointment({
  appointment,
}: UpcomingAppointmentProps) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light font-bold text-primary">
            {appointment.specialist.name
              .replace(/^Dr\.\s*/i, "")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-bold">
                {appointment.specialist.name}
              </h3>

              <StatusBadge
                status={appointment.status}
              />
            </div>

            <p className="mt-1 text-sm font-medium text-primary">
              {appointment.specialist.specialty.name}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              <span>
                {formatDate(
                  appointment.appointment_date,
                )}
              </span>

              <span>
                {formatTime(
                  appointment.appointment_time,
                )}
              </span>

              <span>
                Room {appointment.specialist.room_number}
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/patient/appointments"
          className="shrink-0"
        >
          <Button
            variant="secondary"
            size="sm"
          >
            View appointments
          </Button>
        </Link>
      </div>
    </Card>
  );
}

type QuickActionProps = {
  href: string;
  title: string;
  description: string;
};

function QuickAction({
  href,
  title,
  description,
}: QuickActionProps) {
  return (
    <Link href={href}>
      <Card className="h-full p-5 transition-shadow hover:shadow-md">
        <h3 className="font-bold">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted">
          {description}
        </p>

        <span className="mt-4 inline-flex text-sm font-semibold text-primary">
          Open →
        </span>
      </Card>
    </Link>
  );
}

function StatusBadge({
  status,
}: {
  status: Appointment["status"];
}) {
  const variant =
    status === "APPROVED"
      ? "success"
      : "warning";

  return (
    <Badge variant={variant}>
      {status}
    </Badge>
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

