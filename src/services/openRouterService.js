import { QuotaError } from './QuotaError';

const FREE_MODELS = {
  mistral: 'nvidia/nemotron-3-super-120b-a12b:free',
  llama: 'openai/gpt-oss-120b:free',
};

async function callOpenRouter(prompt, modelKey, apiKey) {
  if (!apiKey) throw new Error('OpenRouter API key not configured');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Contagent',
    },
    body: JSON.stringify({
      model: FREE_MODELS[modelKey],
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048,
      temperature: 0.8,
    }),
  });

  if (response.status === 429) throw new QuotaError(modelKey, 'rpm');
  if (response.status === 503) throw new QuotaError(modelKey, 'daily');

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`OpenRouter error: ${err?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function generateWithMistral(prompt, apiKey) {
  return callOpenRouter(prompt, 'mistral', apiKey);
}

export async function generateWithLlama(prompt, apiKey) {
  return callOpenRouter(prompt, 'llama', apiKey);
}