import PageTitle from "@/components/PageTitle";
import Section from "@/components/Section";

type Project = {
  title: string;
  blurb: string;
  tags: string[];
  href?: string;
  year?: string;
};

const projects: Project[] = [
  {
    title: "Project One",
    blurb: "Placeholder — replace with a real project description.",
    tags: ["TypeScript", "Infra"],
    year: "2026",
  },
  {
    title: "Project Two",
    blurb: "Placeholder — replace with a real project description.",
    tags: ["Python", "ML"],
    year: "2025",
  },
  {
    title: "Project Three",
    blurb: "Placeholder — replace with a real project description.",
    tags: ["Distributed Systems"],
    year: "2024",
  },
];

export default function PortfolioPage() {
  return (
    <div>
      <PageTitle
        eyebrow="Work"
        title="Things I've"
        emphasis="built."
        subtitle="A short selection. Some are shipped, some are sketches I keep returning to."
      />
      <ol className="divide-y divide-rule border-y border-rule">
        {projects.map((project, i) => (
          <Section key={project.title} delay={0.05 * i}>
            <ProjectRow project={project} index={i + 1} />
          </Section>
        ))}
      </ol>
    </div>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const inner = (
    <div className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-6 py-7 transition-colors hover:bg-card/40">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
        {String(index).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <h3 className="text-xl text-ink">
          {project.title}
          {project.href && (
            <span className="ml-2 inline-block text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent-soft">
              ↗
            </span>
          )}
        </h3>
        <p className="mt-1.5 text-sm text-ink-dim">{project.blurb}</p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          {project.tags.map((tag, i) => (
            <span key={tag}>
              {tag}
              {i < project.tags.length - 1 && <span className="ml-3 text-ink-faint/40">·</span>}
            </span>
          ))}
        </div>
      </div>
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
        {project.year}
      </span>
    </div>
  );
  return (
    <li>
      {project.href ? (
        <a href={project.href} target="_blank" rel="noreferrer" className="block">
          {inner}
        </a>
      ) : (
        inner
      )}
    </li>
  );
}
