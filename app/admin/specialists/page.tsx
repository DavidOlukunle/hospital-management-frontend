"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/src/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { useAuth } from "@/src/components/providers/AuthProvider";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";

import {
  approveSpecialist,
  getAdminSpecialists,
  rejectSpecialist,
} from "@/src/lib/api/admin";

import type { AdminSpecialist } from "@/src/types/admin";

export default function AdminSpecialistsPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminSpecialists />
    </ProtectedRoute>
  );
}

function AdminSpecialists() {
  const { token } = useAuth();

  const [specialists, setSpecialists] = useState<
    AdminSpecialist[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [processingId, setProcessingId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    const authToken = token;

    async function loadSpecialists() {
      try {
        const data = await getAdminSpecialists(
          authToken,
        );

        setSpecialists(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load specialists.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadSpecialists();
  }, [token]);

  async function handleApprove(publicId: string) {
    if (!token) {
      return;
    }

    setProcessingId(publicId);
    setError("");

    try {
      const response = await approveSpecialist(
        token,
        publicId,
      );

      setSpecialists((currentSpecialists) =>
        currentSpecialists.map((specialist) =>
          specialist.public_id ===
          response.specialist.public_id
            ? {
                ...specialist,
                approval_status:
                  response.specialist.approval_status,
                approved_at:
                  response.specialist.approved_at,
              }
            : specialist,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to approve specialist.",
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(publicId: string) {
    if (!token) {
      return;
    }

    setProcessingId(publicId);
    setError("");

    try {
      const response = await rejectSpecialist(
        token,
        publicId,
      );

      setSpecialists((currentSpecialists) =>
        currentSpecialists.map((specialist) =>
          specialist.public_id ===
          response.specialist.public_id
            ? {
                ...specialist,
                approval_status:
                  response.specialist.approval_status,
                approved_at:
                  response.specialist.approved_at,
              }
            : specialist,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to reject specialist.",
      );
    } finally {
      setProcessingId(null);
    }
  }

  const pendingCount = specialists.filter(
    (specialist) =>
      specialist.approval_status === "PENDING",
  ).length;

  const approvedCount = specialists.filter(
    (specialist) =>
      specialist.approval_status === "APPROVED",
  ).length;

  const rejectedCount = specialists.filter(
    (specialist) =>
      specialist.approval_status === "REJECTED",
  ).length;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-muted">
            Loading specialists...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-medium text-primary">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Specialists
          </h1>

          <p className="mt-2 text-sm text-muted">
            Review specialist profiles and manage their
            approval status.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
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
            label="Rejected"
            value={rejectedCount}
            variant="error"
          />
        </div>

        {specialists.length === 0 ? (
          <Card className="p-8">
            <p className="text-center text-sm text-muted">
              No specialists have registered yet.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {specialists.map((specialist) => {
              const isProcessing =
                processingId === specialist.public_id;

              return (
                <Card
                  key={specialist.public_id}
                  className="p-6"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-semibold text-foreground">
                          {specialist.name}
                        </h2>

                        <ApprovalBadge
                          status={
                            specialist.approval_status
                          }
                        />
                      </div>

                      <p className="mt-1 text-sm text-muted">
                        {specialist.specialty.name}
                      </p>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <DetailItem
                          label="Doctor number"
                          value={
                            specialist.doctor_number
                          }
                        />

                        <DetailItem
                          label="Room"
                          value={
                            specialist.room_number
                          }
                        />
                      </div>

                      {specialist.bio && (
                        <div className="mt-5">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                            Bio
                          </p>

                          <p className="mt-1 max-w-3xl text-sm leading-6 text-foreground">
                            {specialist.bio}
                          </p>
                        </div>
                      )}

                      {specialist.approved_at && (
                        <p className="mt-4 text-xs text-muted">
                          Approved{" "}
                          {formatDate(
                            specialist.approved_at,
                          )}
                        </p>
                      )}
                    </div>

                    {specialist.approval_status ===
                      "PENDING" && (
                      <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleApprove(
                              specialist.public_id,
                            )
                          }
                          disabled={isProcessing}
                        >
                          {isProcessing
                            ? "Processing..."
                            : "Approve"}
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            handleReject(
                              specialist.public_id,
                            )
                          }
                          disabled={isProcessing}
                        >
                          {isProcessing
                            ? "Processing..."
                            : "Reject"}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
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
  variant: "success" | "warning" | "error";
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-foreground">
            {value}
          </p>
        </div>

        <ApprovalBadge
          status={
            variant === "success"
              ? "APPROVED"
              : variant === "warning"
                ? "PENDING"
                : "REJECTED"
          }
        />
      </div>
    </Card>
  );
}

function ApprovalBadge({
  status,
}: {
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED";
}) {
  const config = {
    PENDING: {
      label: "Pending",
      variant: "warning" as const,
    },
    APPROVED: {
      label: "Approved",
      variant: "success" as const,
    },
    REJECTED: {
      label: "Rejected",
      variant: "error" as const,
    },
  };

  const current = config[status];

  return (
    <Badge variant={current.variant}>
      {current.label}
    </Badge>
  );
}

function DetailItem({
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
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}