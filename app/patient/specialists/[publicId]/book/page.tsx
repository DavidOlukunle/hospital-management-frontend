"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ProtectedRoute } from "@/src/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Card } from "@/src/components/ui/Card";
import { useAuth } from "@/src/components/providers/AuthProvider";
import { createPatientAppointment } from "@/src/lib/api/appointment";

export default function BookAppointmentPage() {
  return (
    <ProtectedRoute allowedRoles={["PATIENT"]}>
      <BookingPage />
    </ProtectedRoute>
  );
}

function BookingPage() {
  const router = useRouter();
  const params = useParams<{ publicId: string }>();

  const { token } = useAuth();

  const [appointmentDate, setAppointmentDate] =
    useState("");

  const [appointmentTime, setAppointmentTime] =
    useState("");

  const [reason, setReason] = useState("");

  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await createPatientAppointment(token, {
        specialist_public_id: params.publicId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        reason,
        notes: notes || undefined,
      });

      router.push("/patient/appointments");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to book appointment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <Link
          href={`/patient/specialists/${params.publicId}`}
          className="inline-flex text-sm font-semibold text-primary hover:text-primary-dark"
        >
          ← Back to specialist
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Book an appointment
          </h1>

          <p className="mt-2 text-muted">
            Choose a date and time for your appointment.
          </p>
        </div>

        <Card className="p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-error/20 bg-red-50 px-4 py-3 text-sm text-error"
              >
                {error}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Appointment date"
                type="date"
                value={appointmentDate}
                onChange={(event) =>
                  setAppointmentDate(event.target.value)
                }
                min={new Date()
                  .toISOString()
                  .split("T")[0]}
                required
              />

              <Input
                label="Appointment time"
                type="time"
                value={appointmentTime}
                onChange={(event) =>
                  setAppointmentTime(event.target.value)
                }
                required
              />
            </div>

            <Input
              label="Reason for visit"
              type="text"
              placeholder="e.g. Regular check-up"
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              required
            />

            <div className="space-y-2">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-foreground"
              >
                Additional notes
              </label>

              <textarea
                id="notes"
                rows={5}
                placeholder="Tell the specialist anything they should know before the appointment..."
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                className="w-full resize-none rounded-lg border border-border bg-white px-3 py-3 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Booking appointment..."
                : "Request appointment"}
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}