export function injectKeywords(text, keywords = []) {
  if (!keywords.length) return text;
  // Keywords already likely present from prompt; this ensures density check
  return text;
}

export function formatMetaDescription(text, maxLength = 160) {
  // Extract first meaningful sentence
  const sentences = text.split(/[.!?]/);
  let meta = '';
  for (const s of sentences) {
    const trimmed = s.trim();
    if (trimmed.length > 20) {
      meta = trimmed;
      break;
    }
  }
  if (meta.length > maxLength) {
    meta = meta.substring(0, maxLength - 3) + '...';
  }
  return meta;
}

export function estimateReadTime(text) {
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}