"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
              C
            </span>

            <span className="text-lg font-semibold tracking-tight">
              CarePoint
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary sm:block"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <Link
          href="/specialists"
          className="inline-flex text-sm font-semibold text-primary hover:text-primary-dark"
        >
          ← Back to specialists
        </Link>

        <div className="mt-6">
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
      </section>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="font-semibold text-foreground">
            CarePoint
          </div>

          <p>Healthcare management made simpler.</p>

          <p>© {new Date().getFullYear()} CarePoint</p>
        </div>
      </footer>
    </main>
  );
}

type ProfileContentProps = {
  specialist: Specialist;
};

function ProfileContent({
  specialist,
}: ProfileContentProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
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
          Create a patient account or log in to book an
          appointment with Dr. {specialist.name}.
        </p>

        <Link
          href="/login"
          className="mt-6 block rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Log in to book
        </Link>

        <Link
          href="/register"
          className="mt-3 block text-center text-sm font-semibold text-primary hover:text-primary-dark"
        >
          Create a patient account
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

