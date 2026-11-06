import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Users,
  LayoutDashboard,
  FileSpreadsheet,
  Search,
  LockKeyhole,
  Database,
  Code2,
  Server,
  Layers3,
  Workflow,
  CheckCircle2,
//   GitHub,
  Terminal,
  Fingerprint,
  RefreshCw,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure authentication",
    description:
      "JWT-based authentication, protected routes and controlled access to application resources.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Fingerprint,
    title: "Single active session",
    description:
      "A database-backed session policy prevents simultaneous logins from multiple devices.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Users,
    title: "Lead management",
    description:
      "A centralized workspace for organizing, tracking and managing business leads.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: RefreshCw,
    title: "Session lifecycle",
    description:
      "Access-token renewal, heartbeat monitoring and controlled session termination.",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    icon: FileSpreadsheet,
    title: "Data operations",
    description:
      "Designed to support spreadsheet import and export for practical business workflows.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Search,
    title: "Organized data access",
    description:
      "A foundation for searching, filtering, sorting and paginating business records.",
    color: "bg-orange-50 text-orange-600",
  },
];

const technologies = [
  {
    category: "Frontend",
    icon: Code2,
    color: "text-cyan-600",
    tools: ["React", "Vite", "JavaScript", "Tailwind CSS"],
  },
  {
    category: "Backend",
    icon: Server,
    color: "text-green-600",
    tools: ["Node.js", "Express.js", "REST API"],
  },
  {
    category: "Database",
    icon: Database,
    color: "text-blue-600",
    tools: ["PostgreSQL", "Sequelize ORM"],
  },
  {
    category: "Security",
    icon: LockKeyhole,
    color: "text-violet-600",
    tools: ["JWT", "Bcrypt", "HTTP-only Cookies"],
  },
];

const architecture = [
  {
    number: "01",
    title: "React frontend",
    description: "User interface, forms, routing and application state.",
  },
  {
    number: "02",
    title: "Express API",
    description: "Receives requests and applies validation and business logic.",
  },
  {
    number: "03",
    title: "Authentication layer",
    description: "Verifies tokens, users and active session ownership.",
  },
  {
    number: "04",
    title: "PostgreSQL database",
    description:
      "Persists users, sessions, password resets and business records.",
  },
];

const guide = [
  {
    number: "01",
    title: "Explore the homepage",
    description:
      "Understand the product, its features and technical architecture.",
  },
  {
    number: "02",
    title: "Create an account",
    description: "Register with your name, email address and password.",
  },
  {
    number: "03",
    title: "Sign in securely",
    description: "Authenticate and access your protected workspace.",
  },
  {
    number: "04",
    title: "Explore the dashboard",
    description:
      "Navigate the ERP workspace and explore its available modules.",
  },
];

const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="mx-auto mb-14 max-w-2xl text-center">
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
      {eyebrow}
    </p>
    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
      {title}
    </h2>
    <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
      {description}
    </p>
  </div>
);

const Home = () => {
  return (
    <div className="overflow-hidden bg-white text-slate-900">
      {/* HERO */}
      <section className="relative isolate bg-[#f7f8ff]">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-600">
                A modern business management platform
              </span>
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.13] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Bring your business operations
              <span className="mt-2 block bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                into one flow.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Meet NexaFlow — a full-stack business management project designed
              to simplify workflows, strengthen application security and bring
              business information together.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-indigo-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 transition hover:-translate-y-1 hover:bg-indigo-700"
              >
                Explore workspace
                <ArrowRight size={18} />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
              >
                Discover features
                <ArrowUpRight size={17} />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Full-stack architecture
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Secure authentication
              </span>
            </div>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-indigo-200/50 to-blue-200/40 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-indigo-950/10">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                    N
                  </div>
                  <span className="text-sm font-bold">NexaFlow</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                </div>
              </div>

              <div className="grid grid-cols-[62px_1fr] sm:grid-cols-[155px_1fr]">
                <aside className="border-r border-slate-100 bg-slate-50 p-2 sm:p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 rounded-lg bg-indigo-50 p-2 text-indigo-700">
                      <LayoutDashboard size={16} />
                      <span className="hidden text-xs font-semibold sm:block">
                        Dashboard
                      </span>
                    </div>
                    {["Leads", "Customers", "Settings"].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 p-2 text-slate-400"
                      >
                        <div className="h-3.5 w-3.5 rounded bg-slate-200" />
                        <span className="hidden text-xs sm:block">{item}</span>
                      </div>
                    ))}
                  </div>
                </aside>

                <div className="min-w-0 p-3 sm:p-5">
                  <p className="text-[10px] font-medium text-slate-400">
                    WORKSPACE / OVERVIEW
                  </p>
                  <h3 className="mt-2 text-lg font-bold sm:text-xl">
                    Dashboard
                  </h3>
                  <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                    Your business overview at a glance.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
                    {[
                      {
                        label: "Total Leads",
                        value: "—",
                        color: "bg-indigo-50",
                      },
                      { label: "Customers", value: "—", color: "bg-blue-50" },
                      {
                        label: "Activities",
                        value: "—",
                        color: "bg-violet-50",
                      },
                      { label: "Growth", value: "—", color: "bg-emerald-50" },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className="rounded-xl border border-slate-100 p-3"
                      >
                        <div
                          className={`mb-3 h-7 w-7 rounded-lg ${card.color}`}
                        />
                        <p className="text-[9px] text-slate-400 sm:text-[11px]">
                          {card.label}
                        </p>
                        <p className="mt-1 text-lg font-bold text-slate-800">
                          {card.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-100 p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">
                        Workspace activity
                      </span>
                      <span className="text-[9px] text-slate-400">Preview</span>
                    </div>
                    <div className="mt-5 flex h-16 items-end gap-2 sm:h-24">
                      {[35, 60, 45, 80, 55, 95, 70, 100, 65, 85, 55, 90].map(
                        (height, index) => (
                          <div
                            key={index}
                            style={{ height: `${height}%` }}
                            className="flex-1 rounded-t-sm bg-gradient-to-t from-indigo-500 to-blue-400 opacity-80"
                          />
                        ),
                      )}
                    </div>
                    <p className="mt-3 text-[9px] text-slate-400">
                      Illustrative dashboard preview — live metrics are not
                      connected here.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-7 -left-3 hidden items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xl sm:flex lg:-left-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={21} />
              </div>
              <div>
                <p className="text-xs font-bold">Session protected</p>
                <p className="mt-1 text-[10px] text-slate-400">
                  Authentication architecture
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO STRIP */}
      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p className="text-sm font-semibold text-slate-600">
            Built to demonstrate practical full-stack engineering.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-slate-400">
            <span>REACT</span>
            <span>NODE.JS</span>
            <span>EXPRESS</span>
            <span>POSTGRESQL</span>
            <span>JWT</span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="scroll-mt-24 px-5 py-24 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What powers NexaFlow"
            title="Built around essential business workflows."
            description="The project combines practical application features with security-focused backend engineering."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5"
                >
                  <div
                    className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
                  >
                    <Icon size={23} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {feature.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-bold text-indigo-600 opacity-0 transition group-hover:opacity-100">
                    Explore project <ArrowRight size={14} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECURITY SECTION */}
      <section className="bg-[#101a35] px-5 py-24 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
              Security by design
            </p>
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Authentication is more than just a login screen.
            </h2>
            <p className="mt-6 text-sm leading-8 text-slate-300 sm:text-base">
              NexaFlow implements a server-validated session model alongside JWT
              authentication. It is designed to control active sessions, manage
              token renewal and protect authenticated resources.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
            >
              Access secure workspace <ArrowRight size={17} />
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 sm:p-8">
            {[
              {
                icon: LockKeyhole,
                title: "JWT access tokens",
                text: "Short-lived access credentials.",
              },
              {
                icon: RefreshCw,
                title: "Refresh-token rotation",
                text: "Controlled renewal of authentication.",
              },
              {
                icon: Fingerprint,
                title: "Database-backed sessions",
                text: "One active session per user.",
              },
              {
                icon: ShieldCheck,
                title: "Protected API routes",
                text: "Authenticated access to resources.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`flex items-center gap-4 py-5 ${index !== 3 ? "border-b border-white/10" : ""}`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-400">{item.text}</p>
                  </div>
                  <CheckCircle2
                    size={18}
                    className="ml-auto shrink-0 text-emerald-400"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section
        id="technology"
        className="scroll-mt-24 bg-slate-50 px-5 py-24 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Technology stack"
            title="The tools behind the platform."
            description="A JavaScript full-stack architecture backed by a relational database and modern authentication practices."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {technologies.map((tech) => {
              const Icon = tech.icon;

              return (
                <div
                  key={tech.category}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <Icon size={27} className={tech.color} />
                  <h3 className="mt-5 text-lg font-bold">{tech.category}</h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tech.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Application architecture"
            title="From interface to database."
            description="A layered architecture separates the user interface, API responsibilities, authentication checks and persistent storage."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {architecture.map((item, index) => (
              <div
                key={item.number}
                className="relative rounded-2xl border border-slate-200 p-6"
              >
                <span className="text-sm font-extrabold tracking-widest text-indigo-500">
                  {item.number}
                </span>
                <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {item.description}
                </p>
                {index !== architecture.length - 1 && (
                  <ArrowRight
                    className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-indigo-400 lg:block"
                    size={22}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl bg-indigo-50 p-6 text-center sm:flex-row">
            <Workflow className="text-indigo-600" size={24} />
            <p className="text-sm font-semibold text-indigo-900">
              React UI → Express API → Authentication Middleware → PostgreSQL
            </p>
          </div>
        </div>
      </section>

      {/* PROJECT GUIDE */}
      <section
        id="guide"
        className="scroll-mt-24 bg-slate-50 px-5 py-24 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Getting started"
            title="Explore the application step by step."
            description="A simple guide for anyone reviewing the project for the first time."
          />

          <div className="mx-auto max-w-3xl">
            {guide.map((item, index) => (
              <div
                key={item.number}
                className="relative flex gap-5 pb-9 last:pb-0"
              >
                {index !== guide.length - 1 && (
                  <div className="absolute left-[21px] top-12 h-full w-px bg-indigo-200" />
                )}
                <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-white text-sm font-bold text-indigo-600 shadow-sm">
                  {item.number}
                </div>
                <div className="pt-1">
                  <h3 className="text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Terminal size={23} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Developer documentation</h3>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                    Setup instructions, environment configuration, database
                    details and API documentation will be maintained in the
                    project README.
                  </p>
                </div>
              </div>
              {/* <a
                href="https://github.com/Subbu0071"
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
              >
                <GitHub size={18} /> GitHub profile <ArrowUpRight size={15} />
              </a> */}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 px-6 py-16 text-center text-white shadow-2xl shadow-indigo-900/15 sm:px-12 sm:py-20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
            <Layers3 size={28} />
          </div>
          <h2 className="mx-auto mt-7 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Ready to explore NexaFlow?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">
            Step inside the workspace and explore the application built around
            secure authentication and business management.
          </p>
          <Link
            to="/login"
            className="mt-9 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-1 hover:bg-indigo-50"
          >
            Enter workspace <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
