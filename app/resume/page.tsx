import PageTitle from "@/components/PageTitle";
import Section from "@/components/Section";

type Role = {
  company: string;
  title: string;
  period: string;
  location?: string;
  summary?: string;
  bullets?: string[];
};

const roles: Role[] = [
  {
    company: "Meta",
    title: "Software Engineer",
    period: "Present",
    location: "—",
    summary: "Placeholder — describe team, scope, and impact.",
    bullets: [
      "Replace with a concrete shipped result.",
      "Replace with a concrete shipped result.",
    ],
  },
];

const education: Role[] = [
  {
    company: "University",
    title: "Degree",
    period: "Year – Year",
    summary: "Placeholder — fill in your school and degree.",
  },
];

const skills = ["Placeholder", "Replace", "With", "Real", "Skills"];

export default function ResumePage() {
  return (
    <div className="space-y-16">
      <PageTitle
        eyebrow="Résumé"
        title="A short version"
        emphasis="of where I've been."
        subtitle="The long version lives on LinkedIn."
      />

      <Section>
        <SectionHeader label="Experience" count={roles.length} />
        <div className="divide-y divide-rule border-y border-rule">
          {roles.map((role) => (
            <RoleRow key={role.company + role.title} role={role} />
          ))}
        </div>
      </Section>

      <Section delay={0.05}>
        <SectionHeader label="Education" count={education.length} />
        <div className="divide-y divide-rule border-y border-rule">
          {education.map((role) => (
            <RoleRow key={role.company + role.title} role={role} />
          ))}
        </div>
      </Section>

      <Section delay={0.1}>
        <SectionHeader label="Skills" count={skills.length} />
        <div className="flex flex-wrap gap-x-4 gap-y-2 py-2 font-mono text-[12px] uppercase tracking-[0.18em] text-ink-dim">
          {skills.map((skill, i) => (
            <span key={skill} className="inline-flex items-center gap-3">
              {skill}
              {i < skills.length - 1 && <span aria-hidden className="text-ink-faint/40">·</span>}
            </span>
          ))}
        </div>
      </Section>

      <Section delay={0.15}>
        <p className="text-sm text-ink-dim">
          For the full work history, see{" "}
          <a
            href="https://www.linkedin.com/in/aaditya-k-venkateswaran/"
            target="_blank"
            rel="noreferrer"
            className="link text-ink"
          >
            LinkedIn
          </a>
          .
        </p>
      </Section>
    </div>
  );
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="mb-5 flex items-baseline justify-between">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">{label}</h2>
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
        {String(count).padStart(2, "0")}
      </span>
    </div>
  );
}

function RoleRow({ role }: { role: Role }) {
  return (
    <div className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[8rem_1fr]">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
          {role.period}
        </p>
        {role.location && (
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint/70">
            {role.location}
          </p>
        )}
      </div>
      <div>
        <h3 className="text-lg text-ink">
          {role.title}
          <span className="text-ink-dim"> · {role.company}</span>
        </h3>
        {role.summary && <p className="mt-1.5 text-sm text-ink-dim">{role.summary}</p>}
        {role.bullets && role.bullets.length > 0 && (
          <ul className="mt-3 space-y-1.5 text-sm text-ink/90">
            {role.bullets.map((bullet, i) => (
              <li key={i} className="relative pl-5 before:absolute before:left-0 before:top-[0.65em] before:h-px before:w-3 before:bg-accent/70">
                {bullet}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
