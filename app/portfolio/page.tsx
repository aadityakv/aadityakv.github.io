import PageTitle from "@/components/PageTitle";
import Section from "@/components/Section";

type Project = {
  title: string;
  blurb: string;
  tags: string[];
  href?: string;
};

const projects: Project[] = [
  {
    title: "Project One",
    blurb: "Placeholder — replace with a real project description.",
    tags: ["TypeScript", "Infra"],
  },
  {
    title: "Project Two",
    blurb: "Placeholder — replace with a real project description.",
    tags: ["Python", "ML"],
  },
  {
    title: "Project Three",
    blurb: "Placeholder — replace with a real project description.",
    tags: ["Distributed Systems"],
  },
];

export default function PortfolioPage() {
  return (
    <div>
      <PageTitle
        eyebrow="Portfolio"
        title="Things I've built"
        subtitle="A small collection of projects worth sharing."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Section key={project.title} delay={0.05 * i}>
            <ProjectCard project={project} />
          </Section>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const inner = (
    <div className="glass group relative h-full overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.07]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-medium text-white">{project.title}</h3>
        {project.href && (
          <span className="text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white">↗</span>
        )}
      </div>
      <p className="mt-2 text-sm text-ink-300">{project.blurb}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-ink-200"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
  return project.href ? (
    <a href={project.href} target="_blank" rel="noreferrer" className="block h-full">
      {inner}
    </a>
  ) : (
    inner
  );
}
