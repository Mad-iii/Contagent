export class QuotaError extends Error {
  constructor(model, resetIn = 60000) {
    super(`Quota exhausted for model: ${model}`);
    this.name = 'QuotaError';
    this.model = model;
    this.resetIn = resetIn;
  }
}