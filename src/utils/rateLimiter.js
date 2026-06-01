class RateLimiter {
  constructor() {
    this.queues = {}; // modelId -> { tokens, lastRefill, queue }
    this.limits = {
      gemini: 15,
      grok: 60,
      mistral: 20,
      llama: 20,
    };
  }

  async throttle(modelId) {
    const rpm = this.limits[modelId] || 20;
    const intervalMs = (60 / rpm) * 1000;

    if (!this.queues[modelId]) {
      this.queues[modelId] = { lastCall: 0 };
    }

    const q = this.queues[modelId];
    const now = Date.now();
    const elapsed = now - q.lastCall;

    if (elapsed < intervalMs) {
      await sleep(intervalMs - elapsed);
    }

    this.queues[modelId].lastCall = Date.now();
  }
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export const rateLimiter = new RateLimiter();