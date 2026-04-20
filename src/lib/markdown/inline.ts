import type { ReactNode } from "react";
import { Fragment, createElement } from "react";

/**
 * Render a small, safe subset of inline markdown to React nodes:
 *   - **bold**               -> <strong>
 *   - [text](url)            -> <a href> (target=_blank for external)
 *   - bare http(s):// URLs   -> <a href>
 *
 * No dangerouslySetInnerHTML. No HTML passthrough. Ignores unbalanced markers.
 */
export function renderInlineMarkdown(input: string): ReactNode {
  // Order matters: link-with-label first (so its URL isn't re-linked as bare),
  // then bold, then bare URLs.
  const tokenRe =
    /(\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\))|(\*\*([^*]+)\*\*)|(https?:\/\/[^\s)<]+)/g;

  const nodes: ReactNode[] = [];
  let lastIdx = 0;
  let keyCounter = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRe.exec(input)) !== null) {
    if (match.index > lastIdx) {
      nodes.push(input.slice(lastIdx, match.index));
    }
    const linkLabel = match[2];
    const linkUrl = match[3];
    const boldText = match[5];
    const bareUrl = match[6];

    if (linkLabel && linkUrl) {
      nodes.push(
        createElement(
          "a",
          {
            key: `md-${keyCounter++}`,
            href: linkUrl,
            ...(linkUrl.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {}),
          },
          linkLabel,
        ),
      );
    } else if (boldText) {
      nodes.push(
        createElement("strong", { key: `md-${keyCounter++}` }, boldText),
      );
    } else if (bareUrl) {
      nodes.push(
        createElement(
          "a",
          {
            key: `md-${keyCounter++}`,
            href: bareUrl,
            target: "_blank",
            rel: "noopener noreferrer",
          },
          bareUrl,
        ),
      );
    }
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < input.length) {
    nodes.push(input.slice(lastIdx));
  }
  return createElement(Fragment, null, ...nodes);
}
