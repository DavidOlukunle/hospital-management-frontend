"use client";

import { useEffect, useMemo, useState } from "react";

import { ProtectedRoute } from "@/src/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { useAuth } from "@/src/components/providers/AuthProvider";

import { getAdminUsers } from "@/src/lib/api/admin";

import type { AdminUser } from "@/src/types/admin";

type UserFilter =
  | "ALL"
  | "PATIENT"
  | "SPECIALIST"
  | "ADMIN";

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminUsers />
    </ProtectedRoute>
  );
}

function AdminUsers() {
  const { token } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);

  const [filter, setFilter] =
    useState<UserFilter>("ALL");

  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    const authToken = token;

    async function loadUsers() {
      try {
        const data = await getAdminUsers(authToken);

        setUsers(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load users.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, [token]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const matchesRole =
        filter === "ALL" ||
        user.role === filter;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        user.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        user.email
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesRole && matchesSearch;
    });
  }, [users, filter, search]);

  const patientCount = users.filter(
    (user) => user.role === "PATIENT",
  ).length;

  const specialistCount = users.filter(
    (user) => user.role === "SPECIALIST",
  ).length;

  const adminCount = users.filter(
    (user) => user.role === "ADMIN",
  ).length;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-muted">
            Loading users...
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
            Users
          </h1>

          <p className="mt-2 text-sm text-muted">
            View and manage registered CarePoint accounts.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Patients"
            value={patientCount}
            variant="info"
          />

          <SummaryCard
            label="Specialists"
            value={specialistCount}
            variant="success"
          />

          <SummaryCard
            label="Administrators"
            value={adminCount}
            variant="neutral"
          />
        </div>

        {/* Search and filters */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              User directory
            </h2>

            <p className="mt-1 text-sm text-muted">
              Search users or filter accounts by role.
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-md">
              <label
                htmlFor="user-search"
                className="sr-only"
              >
                Search users
              </label>

              <input
                id="user-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name or email..."
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterButton
                label="All"
                value="ALL"
                active={filter === "ALL"}
                onClick={setFilter}
              />

              <FilterButton
                label="Patients"
                value="PATIENT"
                active={filter === "PATIENT"}
                onClick={setFilter}
              />

              <FilterButton
                label="Specialists"
                value="SPECIALIST"
                active={filter === "SPECIALIST"}
                onClick={setFilter}
              />

              <FilterButton
                label="Admins"
                value="ADMIN"
                active={filter === "ADMIN"}
                onClick={setFilter}
              />
            </div>
          </div>
        </section>

        {/* Users */}
        <section>
          {filteredUsers.length === 0 ? (
            <Card className="p-8">
              <p className="text-center text-sm text-muted">
                No users match your search or filter.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.public_id}
                  user={user}
                />
              ))}
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
    | "neutral"
    | "info";
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
  value: UserFilter;
  active: boolean;
  onClick: (value: UserFilter) => void;
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

function UserCard({
  user,
}: {
  user: AdminUser;
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* User information */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-base font-semibold text-foreground">
              {user.name}
            </h3>

            <RoleBadge role={user.role} />

            <StatusBadge status={user.status} />
          </div>

          <p className="mt-2 text-sm text-muted">
            {user.email}
          </p>

          <p className="mt-1 text-xs text-muted">
            User ID: {user.public_id}
          </p>
        </div>

        {/* Specialist information */}
        {user.role === "SPECIALIST" &&
          user.specialist && (
            <div className="rounded-xl border border-border bg-slate-50 p-4 lg:min-w-72">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Specialist details
              </p>

              <div className="mt-3 space-y-2">
                <DetailRow
                  label="Doctor number"
                  value={
                    user.specialist.doctor_number
                  }
                />

                <DetailRow
                  label="Room"
                  value={
                    user.specialist.room_number
                  }
                />

                <DetailRow
                  label="Specialty"
                  value={
                    user.specialist.specialty.name
                  }
                />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted">
                    Approval
                  </span>

                  <ApprovalBadge
                    status={
                      user.specialist
                        .approval_status
                    }
                  />
                </div>
              </div>
            </div>
          )}
      </div>
    </Card>
  );
}

function RoleBadge({
  role,
}: {
  role: AdminUser["role"];
}) {
  const config: Record<
    AdminUser["role"],
    {
      label: string;
      variant:
        | "success"
        | "warning"
        | "error"
        | "neutral"
        | "info";
    }
  > = {
    PATIENT: {
      label: "Patient",
      variant: "info",
    },
    SPECIALIST: {
      label: "Specialist",
      variant: "success",
    },
    ADMIN: {
      label: "Administrator",
      variant: "neutral",
    },
  };

  const current = config[role];

  return (
    <Badge variant={current.variant}>
      {current.label}
    </Badge>
  );
}

function StatusBadge({
  status,
}: {
  status: AdminUser["status"];
}) {
  return (
    <Badge
      variant={
        status === "ACTIVE"
          ? "success"
          : "error"
      }
    >
      {status === "ACTIVE"
        ? "Active"
        : "Suspended"}
    </Badge>
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
  const config: Record<
    "PENDING" | "APPROVED" | "REJECTED",
    {
      label: string;
      variant:
        | "success"
        | "warning"
        | "error";
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
  };

  const current = config[status];

  return (
    <Badge variant={current.variant}>
      {current.label}
    </Badge>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted">
        {label}
      </span>

      <span className="text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}
