import PageTitle from "@/components/PageTitle";
import Section from "@/components/Section";

type Role = {
  company: string;
  title: string;
  period: string;
  summary?: string;
  bullets?: string[];
};

const roles: Role[] = [
  {
    company: "Meta",
    title: "Software Engineer",
    period: "Present",
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

const skills = [
  "Placeholder",
  "Replace",
  "With",
  "Real",
  "Skills",
];

export default function ResumePage() {
  return (
    <div className="space-y-12">
      <PageTitle
        eyebrow="Resume"
        title="Aaditya Venkateswaran"
        subtitle="Software Engineer at Meta. A short version of where I've been."
      />

      <Section>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-accent-glow">
          Experience
        </h2>
        <div className="space-y-4">
          {roles.map((role) => (
            <RoleCard key={role.company + role.title} role={role} />
          ))}
        </div>
      </Section>

      <Section delay={0.05}>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-accent-glow">
          Education
        </h2>
        <div className="space-y-4">
          {education.map((role) => (
            <RoleCard key={role.company + role.title} role={role} />
          ))}
        </div>
      </Section>

      <Section delay={0.1}>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-accent-glow">
          Skills
        </h2>
        <div className="glass flex flex-wrap gap-2 rounded-2xl p-5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-ink-100"
            >
              {skill}
            </span>
          ))}
        </div>
      </Section>
    </div>
  );
}

function RoleCard({ role }: { role: Role }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="text-base font-medium text-white">{role.title}</h3>
          <p className="text-sm text-ink-300">{role.company}</p>
        </div>
        <span className="font-mono text-xs text-ink-400">{role.period}</span>
      </div>
      {role.summary && <p className="mt-3 text-sm text-ink-200">{role.summary}</p>}
      {role.bullets && role.bullets.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-200 marker:text-ink-500">
          {role.bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
