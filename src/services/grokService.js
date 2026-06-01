import { QuotaError } from './QuotaError';

export async function generateWithGrok(prompt, apiKey) {
  if (!apiKey) throw new Error('Grok API key not configured');

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048,
      temperature: 0.8,
    }),
  });

  if (response.status === 429) throw new QuotaError('grok', 'rpm');
  if (response.status === 503) throw new QuotaError('grok', 'daily');

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Grok error: ${err?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}