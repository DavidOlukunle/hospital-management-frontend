"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import {
  getSpecialties,
  registerSpecialist,
} from "@/src/lib/api/specialists";
import type { Specialty } from "@/src/types/specialist";

export default function SpecialistRegisterPage() {
  const router = useRouter();

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoadingSpecialties, setIsLoadingSpecialties] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [doctorNumber, setDoctorNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [bio, setBio] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    async function loadSpecialties() {
      try {
        const data = await getSpecialties();

        setSpecialties(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load specialties. Please try again.",
        );
      } finally {
        setIsLoadingSpecialties(false);
      }
    }

    loadSpecialties();
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    if (!specialtyId) {
      setError("Please select your specialty.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerSpecialist({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        specialty_id: Number(specialtyId),
        doctor_number: doctorNumber,
        ...(roomNumber.trim()
          ? { room_number: roomNumber.trim() }
          : {}),
        ...(bio.trim() ? { bio: bio.trim() } : {}),
      });

      setIsRegistered(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit your registration. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isRegistered) {
    return (
      <main className="min-h-screen bg-background">
        <div className="grid min-h-screen lg:grid-cols-2">
          <section className="hidden bg-primary p-10 text-white lg:flex lg:flex-col lg:items-start lg:justify-between xl:p-12">
            <div>
              <Link
                href="/"
                className="text-2xl font-bold"
              >
                CarePoint
              </Link>
            </div>

            <div className="max-w-md">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-teal-100">
                Join CarePoint
              </p>

              <h1 className="text-4xl font-bold leading-tight">
                Connect with patients who need your expertise.
              </h1>

              <p className="mt-5 text-lg leading-8 text-teal-50">
                Your specialist application will be reviewed
                before you can access the specialist dashboard.
              </p>
            </div>

            <p className="text-sm text-teal-100">
              © {new Date().getFullYear()} CarePoint
            </p>
          </section>

          <section className="flex min-h-screen items-center justify-center px-6 py-12">
            <div className="w-full max-w-md text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-8 w-8"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5 12 4 4L19 6"
                  />
                </svg>
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight">
                Application submitted
              </h2>

              <p className="mt-3 leading-7 text-muted">
                Your specialist account has been created and is
                currently pending approval. You&apos;ll be able to
                access specialist features after an administrator
                reviews your application.
              </p>

              <Button
                type="button"
                size="lg"
                className="mt-8 w-full"
                onClick={() => router.push("/login")}
              >
                Continue to sign in
              </Button>

              <p className="mt-5 text-sm text-muted">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:text-primary-dark"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)]">
        {/* Desktop information panel */}
        <aside className="hidden bg-primary text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-hidden lg:p-10 xl:p-12">
          <div>
            <Link
              href="/"
              className="text-2xl font-bold"
            >
              CarePoint
            </Link>

            <div className="mt-10 max-w-md">
              <p className="text-sm font-semibold uppercase tracking-wider text-teal-100">
                Specialist registration
              </p>

              <h1 className="mt-3 text-4xl font-bold leading-tight">
                Bring your expertise to CarePoint.
              </h1>

              <p className="mt-4 text-base leading-7 text-teal-50">
                Create your specialist profile and submit your
                application for review by the CarePoint
                administration team.
              </p>

              <div className="mt-7 space-y-4 text-sm text-teal-50">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                    1
                  </span>

                  <span className="pt-0.5">
                    Create your specialist account.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                    2
                  </span>

                  <span className="pt-0.5">
                    Submit your professional information.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                    3
                  </span>

                  <span className="pt-0.5">
                    Wait for administrator approval.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-auto text-sm text-teal-100">
            © {new Date().getFullYear()} CarePoint
          </p>
        </aside>

        {/* Registration form */}
        <section className="min-h-screen px-6 py-10 sm:px-8 lg:h-screen lg:overflow-y-auto lg:px-12 lg:py-12 xl:px-16">
          <div className="mx-auto w-full max-w-xl">
            <div className="mb-8 lg:hidden">
              <Link
                href="/"
                className="text-2xl font-bold text-primary"
              >
                CarePoint
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">
                Register as a specialist
              </h2>

              <p className="mt-2 text-muted">
                Submit your professional information for review.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-error/20 bg-red-50 px-4 py-3 text-sm leading-6 text-error"
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  Account information
                </h3>

                <div className="mt-4 space-y-5">
                  <Input
                    label="Full name"
                    name="name"
                    type="text"
                    placeholder="Dr. John Doe"
                    autoComplete="name"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    required
                  />

                  <Input
                    label="Email address"
                    name="email"
                    type="email"
                    placeholder="doctor@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      required
                    />

                    <Input
                      label="Confirm password"
                      name="password_confirmation"
                      type="password"
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      value={passwordConfirmation}
                      onChange={(event) =>
                        setPasswordConfirmation(
                          event.target.value,
                        )
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  Professional information
                </h3>

                <div className="mt-4 space-y-5">
                  <div>
                    <label
                      htmlFor="specialty_id"
                      className="mb-2 block text-sm font-medium"
                    >
                      Specialty
                    </label>

                    <select
                      id="specialty_id"
                      name="specialty_id"
                      value={specialtyId}
                      onChange={(event) =>
                        setSpecialtyId(event.target.value)
                      }
                      disabled={isLoadingSpecialties}
                      required
                      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="">
                        {isLoadingSpecialties
                          ? "Loading specialties..."
                          : "Select your specialty"}
                      </option>

                      {specialties.map((specialty) => (
                        <option
                          key={specialty.id}
                          value={specialty.id}
                        >
                          {specialty.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Doctor number"
                      name="doctor_number"
                      type="text"
                      placeholder="DOC-001"
                      value={doctorNumber}
                      onChange={(event) =>
                        setDoctorNumber(event.target.value)
                      }
                      required
                    />

                    <Input
                      label="Room number"
                      name="room_number"
                      type="text"
                      placeholder="Room 204"
                      value={roomNumber}
                      onChange={(event) =>
                        setRoomNumber(event.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bio"
                      className="mb-2 block text-sm font-medium"
                    >
                      Professional bio
                    </label>

                    <textarea
                      id="bio"
                      name="bio"
                      rows={5}
                      placeholder="Tell patients a little about your experience and area of practice."
                      value={bio}
                      onChange={(event) =>
                        setBio(event.target.value)
                      }
                      className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm leading-6 text-muted">
                Your application will remain pending until an
                administrator reviews and approves your specialist
                profile.
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={
                  isSubmitting ||
                  isLoadingSpecialties ||
                  specialties.length === 0
                }
              >
                {isSubmitting
                  ? "Submitting application..."
                  : "Submit specialist application"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:text-primary-dark"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-3 text-center text-sm text-muted">
              Looking for a patient account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:text-primary-dark"
              >
                Register as a patient
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

