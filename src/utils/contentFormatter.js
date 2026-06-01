/**
 * Removes all markdown syntax and returns clean plain text.
 * Use for: plain text display, simple copy, SMS, plain email.
 */
export function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s+/gm, '')           // headings
    .replace(/\*\*(.*?)\*\*/g, '$1')        // bold
    .replace(/\*(.*?)\*/g, '$1')            // italic
    .replace(/`{1,3}[^`]*`{1,3}/g, '$1')   // inline & block code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')     // links → label only
    .replace(/^[-*+]\s+/gm, '')             // unordered list markers
    .replace(/^\d+\.\s+/gm, '')             // ordered list markers
    .replace(/^>{1,}\s*/gm, '')             // blockquotes
    .replace(/---+/g, '')                   // horizontal rules
    .replace(/\n{3,}/g, '\n\n')             // collapse excess blank lines
    .trim();
}

/**
 * Converts markdown to semantic HTML.
 * Use for: CMS editors, rich text fields, blog publishing.
 */
export function formatForCMS(text) {
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    // Unordered lists
    .replace(/((?:^[-*+] .+\n?)+)/gm, (match) => {
      const items = match.trim().split('\n').map(l => `  <li>${l.replace(/^[-*+]\s+/, '')}</li>`).join('\n');
      return `<ul>\n${items}\n</ul>`;
    })
    // Ordered lists
    .replace(/((?:^\d+\. .+\n?)+)/gm, (match) => {
      const items = match.trim().split('\n').map(l => `  <li>${l.replace(/^\d+\.\s+/, '')}</li>`).join('\n');
      return `<ol>\n${items}\n</ol>`;
    })
    // Wrap plain paragraphs (lines not already wrapped in an HTML tag)
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<[a-z]/.test(trimmed)) return trimmed; // already HTML
      return `<p>${trimmed}</p>`;
    })
    .filter(Boolean)
    .join('\n\n');
}

/**
 * Strips markdown and formats into clean readable paragraphs.
 * Use for: plain-text email clients, plain copy export.
 */
export function formatForEmail(text) {
  return stripMarkdown(text)
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)
    .join('\n\n');
}

/**
 * Parses ad copy output into structured objects.
 * Expects labeled lines: Headline: / Body: / CTA:
 */
export function parseAdCopy(text) {
  const ads = [];
  const variants = text.split(/\n{2,}/);

  for (const block of variants) {
    if (!block.trim()) continue;
    const headline = block.match(/^Headline:\s*(.+)$/m)?.[1]?.trim() ?? '';
    const body = block.match(/^Body:\s*(.+)$/m)?.[1]?.trim() ?? '';
    const cta = block.match(/^CTA:\s*(.+)$/m)?.[1]?.trim() ?? '';
    if (headline || body) ads.push({ headline, body, cta });
  }

  return ads;
}

/**
 * Parses email output into subject, preview, and body.
 * Expects: Subject: / Preview: on first two lines.
 */
export function parseEmail(text) {
  const lines = text.trim().split('\n');
  const subject = lines.find(l => l.startsWith('Subject:'))?.replace('Subject:', '').trim() ?? '';
  const preview = lines.find(l => l.startsWith('Preview:'))?.replace('Preview:', '').trim() ?? '';
  const bodyStart = lines.findIndex(l => l.startsWith('Preview:')) + 1;
  const body = lines.slice(bodyStart).join('\n').trim();

  return { subject, preview, body };
}

/**
 * Parses social media output into per-platform objects.
 * Expects labeled blocks: Instagram: / LinkedIn: / Twitter/X:
 */
export function parseSocialPosts(text) {
  const platforms = ['Instagram', 'LinkedIn', 'Twitter/X', 'Twitter', 'Facebook'];
  const result = {};

  for (const platform of platforms) {
    const regex = new RegExp(`${platform}:\\s*\\n([\\s\\S]*?)(?=\\n(?:${platforms.join('|')}):|\$)`);
    const match = text.match(regex);
    if (match) {
      const content = match[1].trim();
      const hashtagLine = content.match(/^(#\w+\s*)+$/m)?.[0]?.trim() ?? '';
      const postText = content.replace(hashtagLine, '').trim();
      result[platform] = { text: postText, hashtags: hashtagLine };
    }
  }

  return result;
}

/**
 * Copies text to the clipboard.
 */
export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}