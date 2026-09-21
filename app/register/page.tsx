"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useAuth } from "@/src/components/providers/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (user.role === "PATIENT") {
        router.push("/patient/dashboard");
      } else if (user.role === "SPECIALIST") {
        router.push("/specialist/dashboard");
      } else if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden bg-primary p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold">
              CarePoint
            </Link>
          </div>

          <div className="max-w-md">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-teal-100">
              Your healthcare, connected
            </p>

            <h1 className="text-4xl font-bold leading-tight">
              Start managing your healthcare in one place.
            </h1>

            <p className="mt-6 text-lg leading-8 text-teal-50">
              Create your patient account and get started with finding
              specialists and managing appointments.
            </p>
          </div>

          <p className="text-sm text-teal-100">
            © {new Date().getFullYear()} CarePoint
          </p>
        </section>

        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
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
                Create your account
              </h2>

              <p className="mt-2 text-muted">
                Get started with your CarePoint patient account.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-error/20 bg-red-50 px-4 py-3 text-sm text-error"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full name"
                name="name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />

              <Input
                label="Email address"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <Input
                label="Confirm password"
                name="password_confirmation"
                type="password"
                placeholder="Confirm your password"
                autoComplete="new-password"
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
                required
              />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
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
          </div>
        </section>
      </div>
    </main>
  );
}