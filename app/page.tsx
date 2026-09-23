import Link from "next/link";
const features = [
  {
    title: "Find the right specialist",
    description:
      "Explore verified specialists by specialty and find the right professional for your healthcare needs.",
  },
  {
    title: "Book with confidence",
    description:
      "Choose a convenient date and time and keep track of every appointment from one place.",
  },
  {
    title: "Stay in control",
    description:
      "Manage appointments, monitor their status, and keep your healthcare information organized.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
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

          <nav className="hidden items-center gap-8 md:flex">
            <Link 
              href="/specialist"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Find a Specialist
            </Link>

            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              How it works
            </Link>

            <Link
              href="#about"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              About
            </Link>
          </nav>

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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-light/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:pb-32 lg:pt-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-3 py-1.5 text-sm font-medium text-primary-dark">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Healthcare made simpler
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Better care starts with{" "}
              <span className="text-primary">the right connection.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
              Find trusted specialists, book appointments, and manage your
              healthcare journey from one simple platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/specialist"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
              >
                Find a specialist
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-slate-50"
              >
                Create an account
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-muted">
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                Verified specialists
              </div>

              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                Easy appointment booking
              </div>

              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                Secure accounts
              </div>
            </div>
          </div>

          {/* Healthcare visual */}
          <div className="relative">
            <div className="rounded-3xl border border-border bg-white p-4 shadow-xl shadow-slate-200/60">
              <div className="rounded-2xl bg-primary-light/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted">
                      Upcoming appointment
                    </p>
                    <p className="mt-1 text-xl font-semibold text-foreground">
                      Your healthcare, organized.
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-success shadow-sm">
                    Confirmed
                  </span>
                </div>

                <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                      SJ
                    </div>

                    <div>
                      <p className="font-semibold text-foreground">
                        Dr. Sarah Johnson
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        Dermatology Specialist
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-muted">Date</p>
                      <p className="mt-1 text-sm font-semibold">
                        September 24
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-muted">Time</p>
                      <p className="mt-1 text-sm font-semibold">10:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-border bg-white px-5 py-4 shadow-lg sm:block">
              <p className="text-xs text-muted">Appointment status</p>
              <p className="mt-1 text-sm font-semibold text-success">
                ● Everything looks good
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="how-it-works"
        className="border-y border-border bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Simple by design
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Everything you need to manage your care.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-sm font-bold text-primary-dark">
                  0{index + 1}
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="bg-background">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8 lg:py-28">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Take the next step in your healthcare journey.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Create your account and connect with healthcare specialists through
            a simpler appointment experience.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            Get started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="font-semibold text-foreground">CarePoint</div>

          <p>Healthcare management made simpler.</p>

          <p>© 2026 CarePoint</p>
        </div>
      </footer>
    </main>
  );
}