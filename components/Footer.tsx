export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 text-center text-xs text-ink-400">
      <div className="mx-auto max-w-3xl px-6">
        <p>
          © {new Date().getFullYear()} Aaditya Venkateswaran ·{" "}
          <a
            href="https://github.com/aadityakv"
            target="_blank"
            rel="noreferrer"
            className="text-ink-300 hover:text-white"
          >
            github.com/aadityakv
          </a>
        </p>
      </div>
    </footer>
  );
}
