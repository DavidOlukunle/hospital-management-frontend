"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ProtectedRoute } from "@/src/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Button } from "@/src/components/ui/Button";
import { getSpecialist } from "@/src/lib/api/specialists";

import type { Specialist } from "@/src/types/specialist";

type SpecialistPageProps = {
  params: Promise<{
    publicId: string;
  }>;
};

export default function SpecialistProfilePage({
  params,
}: SpecialistPageProps) {
  return (
    <ProtectedRoute allowedRoles={["PATIENT"]}>
      <SpecialistProfile params={params} />
    </ProtectedRoute>
  );
}

function SpecialistProfile({
  params,
}: SpecialistPageProps) {
  const [specialist, setSpecialist] =
    useState<Specialist | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSpecialist() {
      try {
        const { publicId } = await params;

        const data = await getSpecialist(publicId);

        setSpecialist(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load specialist.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadSpecialist();
  }, [params]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link
          href="/patient/specialists"
          className="inline-flex text-sm font-semibold text-primary hover:text-primary-dark"
        >
          ← Back to specialists
        </Link>

        {isLoading ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-muted">
            Loading specialist profile...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-lg border border-error/20 bg-red-50 px-4 py-3 text-sm text-error"
          >
            {error}
          </div>
        ) : specialist ? (
          <ProfileContent specialist={specialist} />
        ) : null}
      </div>
    </DashboardLayout>
  );

  type ProfileContentProps = {
  specialist: Specialist;
};

function ProfileContent({
  specialist,
}: ProfileContentProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-2xl font-bold text-primary">
            {specialist.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
              Approved specialist
            </span>

            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Dr. {specialist.name}
            </h1>

            <p className="mt-1 text-lg font-medium text-primary">
              {specialist.specialty.name}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <h2 className="text-lg font-bold">
            About
          </h2>

          <p className="mt-3 leading-7 text-muted">
            {specialist.bio ||
              "This specialist has not added a biography yet."}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <InfoItem
            label="Doctor number"
            value={specialist.doctor_number}
          />

          <InfoItem
            label="Consultation room"
            value={specialist.room_number}
          />
        </div>
      </section>

      <aside className="h-fit rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">
          Book an appointment
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Choose a date and time to request an appointment
          with Dr. {specialist.name}.
        </p>

        <Link
          href={`/patient/specialists/${specialist.public_id}/book`}
          className="mt-6 block"
        >
          <Button className="w-full">
            Book appointment
          </Button>
        </Link>
      </aside>
    </div>
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
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>

      <p className="mt-1 font-semibold">
        {value}
      </p>
    </div>
  );
}
}