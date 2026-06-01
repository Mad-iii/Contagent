import { QuotaError } from './QuotaError';

export async function generateWithGemini(prompt, apiKey) {
  if (!apiKey) throw new Error('Gemini API key not configured. Add it in Settings.');

  let response;
  try {
    response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
      }
    );
  } catch (networkErr) {
    throw new Error(`Gemini network error: ${networkErr.message}`);
  }

  // Quota / rate limit
  if (response.status === 429) {
    throw new QuotaError('gemini', 'rpm');
  }

  // Daily quota exhausted (Gemini returns 503 when daily limit hit)
  if (response.status === 503) {
    throw new QuotaError('gemini', 'daily');
  }

  // Auth error — bad key
  if (response.status === 400 || response.status === 401 || response.status === 403) {
    const body = await response.json().catch(() => ({}));
    const msg  = body?.error?.message || response.statusText;
    throw new Error(`Gemini auth error (${response.status}): ${msg}`);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(`Gemini error ${response.status}: ${body?.error?.message || response.statusText}`);
  }

  const data = await response.json();

  // Safety block
  const candidate = data.candidates?.[0];
  if (candidate?.finishReason === 'SAFETY') {
    throw new Error('Gemini blocked this prompt for safety reasons. Try rephrasing.');
  }

  const text = candidate?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned an empty response.');

  return text;
}