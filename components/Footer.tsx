export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-2xl flex-col gap-2 px-6 py-10 text-xs text-ink-faint sm:flex-row sm:items-baseline sm:justify-between">
        <p className="font-mono uppercase tracking-[0.22em]">
          © {new Date().getFullYear()} Aaditya Venkateswaran
        </p>
        <p className="flex items-center gap-4 font-mono">
          <a
            href="https://github.com/aadityakv"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            github
          </a>
          <span aria-hidden className="text-ink-faint/60">/</span>
          <a
            href="https://www.linkedin.com/in/aaditya-k-venkateswaran/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            linkedin
          </a>
        </p>
      </div>
    </footer>
  );
}
