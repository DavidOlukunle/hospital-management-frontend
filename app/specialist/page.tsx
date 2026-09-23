"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getSpecialists } from "@/src/lib/api/specialists";
import type { Specialist } from "@/src/types/specialist";

export default function SpecialistsPage() {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
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

      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Our specialists
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Find the right specialist
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Explore our approved healthcare specialists and find a
            professional who matches your healthcare needs.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
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
            Loading specialists...
          </div>
        ) : specialists.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
            <h2 className="font-semibold">
              No specialists available
            </h2>

            <p className="mt-2 text-sm text-muted">
              There are currently no approved specialists to
              display.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted">
                {specialists.length}{" "}
                {specialists.length === 1
                  ? "specialist"
                  : "specialists"}{" "}
                available
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {specialists.map((specialist) => (
                <SpecialistCard
                  key={specialist.public_id}
                  specialist={specialist}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="border-t border-border bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to manage your healthcare?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-muted">
            Create your CarePoint account to book appointments and
            manage your healthcare journey.
          </p>

          <Link
            href="/register"
            className="mt-7 inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            Create an account
          </Link>
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

type SpecialistCardProps = {
  specialist: Specialist;
};

function SpecialistCard({
  specialist,
}: SpecialistCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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
          Verified
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
          href={`/specialist/${specialist.public_id}`}
          className="mt-4 block text-sm font-semibold text-primary hover:text-primary-dark"
        >
          View profile →
        </Link>
      </div>
    </article>
  );
}

