"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/src/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Badge } from "@/src/components/ui/Badge";
import { Card } from "@/src/components/ui/Card";
import { useAuth } from "@/src/components/providers/AuthProvider";

import { getAdminDashboard } from "@/src/lib/api/admin";

import type { AdminDashboardStats } from "@/src/types/admin";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}

function AdminDashboard() {
  const { user, token } = useAuth();

  const [stats, setStats] =
    useState<AdminDashboardStats | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    const authToken = token;

    async function loadDashboard() {
      try {
        const dashboard = await getAdminDashboard(
          authToken,
        );

        setStats(dashboard);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load admin dashboard.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [token]);

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
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.name ?? "Administrator"}
          </h1>

          <p className="mt-2 text-sm text-muted">
            Monitor users, specialists, and appointments
            across CarePoint.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        {!stats ? (
          <Card className="p-8">
            <p className="text-center text-sm text-muted">
              Dashboard information is unavailable.
            </p>
          </Card>
        ) : (
          <>
            {/* User Statistics */}
            <section>
              <SectionHeading
                title="Users"
                description="Overview of registered CarePoint accounts."
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="Total users"
                  value={stats.users.total}
                />

                <StatCard
                  label="Patients"
                  value={stats.users.patients}
                />

                <StatCard
                  label="Specialists"
                  value={stats.users.specialists}
                />

                <StatCard
                  label="Administrators"
                  value={stats.users.admins}
                />
              </div>
            </section>

            {/* Appointment Statistics */}
            <section>
              <SectionHeading
                title="Appointments"
                description="Current appointment activity across the system."
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  label="Total appointments"
                  value={stats.appointments.total}
                />

                <StatCard
                  label="Pending"
                  value={stats.appointments.pending}
                  variant="warning"
                />

                <StatCard
                  label="Approved"
                  value={stats.appointments.approved}
                  variant="success"
                />

                <StatCard
                  label="Completed"
                  value={stats.appointments.completed}
                  variant="success"
                />

                <StatCard
                  label="Rejected"
                  value={stats.appointments.rejected}
                  variant="error"
                />

                <StatCard
                  label="Cancelled"
                  value={stats.appointments.cancelled}
                  variant="neutral"
                />
              </div>
            </section>

            {/* Specialist Applications */}
            <section>
              <SectionHeading
                title="Specialist applications"
                description="Track specialist approval activity."
              />

              <Card className="p-6">
                <div className="grid gap-6 sm:grid-cols-3">
                  <ApplicationStat
                    label="Pending"
                    value={
                      stats.specialist_applications.pending
                    }
                    variant="warning"
                  />

                  <ApplicationStat
                    label="Approved"
                    value={
                      stats.specialist_applications.approved
                    }
                    variant="success"
                  />

                  <ApplicationStat
                    label="Rejected"
                    value={
                      stats.specialist_applications.rejected
                    }
                    variant="error"
                  />
                </div>
              </Card>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-foreground">
        {title}
      </h2>

      <p className="mt-1 text-sm text-muted">
        {description}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number;
  variant?:
    | "default"
    | "success"
    | "warning"
    | "error"
    | "neutral";
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-foreground">
            {value}
          </p>
        </div>

        {variant !== "default" && (
          <StatusIndicator variant={variant} />
        )}
      </div>
    </Card>
  );
}

function ApplicationStat({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: "success" | "warning" | "error";
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <StatusIndicator variant={variant} />

        <span className="text-sm font-medium text-foreground">
          {label}
        </span>
      </div>

      <span className="text-xl font-bold text-foreground">
        {value}
      </span>
    </div>
  );
}

function StatusIndicator({
  variant,
}: {
  variant:
    | "success"
    | "warning"
    | "error"
    | "neutral";
}) {
  const config = {
    success: {
      label: "Active",
      badge: "success" as const,
    },
    warning: {
      label: "Attention",
      badge: "warning" as const,
    },
    error: {
      label: "Issue",
      badge: "error" as const,
    },
    neutral: {
      label: "Info",
      badge: "neutral" as const,
    },
  };

  const current = config[variant];

  return (
    <Badge variant={current.badge}>
      {current.label}
    </Badge>
  );
}

