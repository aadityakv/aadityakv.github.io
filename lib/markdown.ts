// Tiny, dependency-free Markdown -> HTML for the small subset used in posts.
// Handles: headings, paragraphs, bold/italic, inline code, fenced code blocks,
// unordered lists, and blockquotes. Good enough for a personal blog; swap in a
// real renderer (remark/marked) when posts grow more complex.

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const inline = (s: string) =>
  escapeHtml(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");

export function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;
  let inList = false;
  let inQuote = false;
  const closeOpenBlocks = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
    if (inQuote) {
      out.push("</blockquote>");
      inQuote = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      closeOpenBlocks();
      const lang = line.slice(3).trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      out.push(
        `<pre><code${lang ? ` class="language-${lang}"` : ""}>${escapeHtml(buf.join("\n"))}</code></pre>`,
      );
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      closeOpenBlocks();
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^\s*-\s+/.test(line)) {
      if (!inList) {
        closeOpenBlocks();
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inline(line.replace(/^\s*-\s+/, ""))}</li>`);
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      if (!inQuote) {
        closeOpenBlocks();
        out.push("<blockquote>");
        inQuote = true;
      }
      out.push(`<p>${inline(line.replace(/^>\s?/, ""))}</p>`);
      i++;
      continue;
    }

    if (line.trim() === "") {
      closeOpenBlocks();
      i++;
      continue;
    }

    closeOpenBlocks();
    const buf: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,6}\s|```|>\s?|\s*-\s+)/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(buf.join(" "))}</p>`);
  }

  closeOpenBlocks();
  return out.join("\n");
}
