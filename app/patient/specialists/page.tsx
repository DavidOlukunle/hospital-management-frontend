"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ProtectedRoute } from "@/src/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { getSpecialists } from "@/src/lib/api/specialists";

import type { Specialist } from "@/src/types/specialist";

export default function SpecialistsPage() {
  return (
    <ProtectedRoute allowedRoles={["PATIENT"]}>
      <SpecialistsContent />
    </ProtectedRoute>
  );
}

function SpecialistsContent() {
  const [specialists, setSpecialists] = useState<
    Specialist[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSpecialists() {
      try {
        setError("");

        const data = await getSpecialists();

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
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section>
          <p className="text-sm font-medium text-primary">
            Specialists
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Find a specialist
          </h1>

          <p className="mt-2 max-w-2xl text-muted">
            Browse approved healthcare specialists and find the
            right professional for your needs.
          </p>
        </section>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-error/20 bg-red-50 px-4 py-3 text-sm text-error"
          >
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-muted">
            Loading specialists...
          </div>
        ) : specialists.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
            <h2 className="font-semibold">
              No specialists available
            </h2>

            <p className="mt-2 text-sm text-muted">
              There are currently no approved specialists to
              display.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {specialists.map((specialist) => (
              <SpecialistCard
                key={specialist.public_id}
                specialist={specialist}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

type SpecialistCardProps = {
  specialist: Specialist;
};

function SpecialistCard({
  specialist,
}: SpecialistCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-bold">
            Dr. {specialist.name}
          </h2>

          <p className="mt-1 text-sm font-medium text-primary">
            {specialist.specialty.name}
          </p>
        </div>

        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
          Available
        </span>
      </div>

      {specialist.bio && (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">
          {specialist.bio}
        </p>
      )}

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs text-muted">
          Room {specialist.room_number}
        </p>

        <Link
          href={`/patient/specialists/${specialist.public_id}`}
          className="mt-4 block text-sm font-semibold text-primary hover:text-primary-dark"
        >
          View profile →
        </Link>
      </div>
    </div>
  );
}