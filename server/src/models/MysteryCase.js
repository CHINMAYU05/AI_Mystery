import mongoose from 'mongoose';

const MysteryCaseSchema = new mongoose.Schema({
  schemaVersion: { type: String, default: '1.0' }, state: { type: String, enum: ['generating', 'ready', 'completed', 'failed'], required: true, index: true },
  accessTokenHash: { type: String, required: true, select: false }, request: { type: mongoose.Schema.Types.Mixed, required: true },
  publicCase: { type: mongoose.Schema.Types.Mixed, default: null }, accusation: { type: mongoose.Schema.Types.Mixed, default: null },
  generation: { type: mongoose.Schema.Types.Mixed, default: () => ({ attemptCount: 0, promptVersion: '1.0', model: 'mock' }) }
}, { timestamps: true, strict: true });
MysteryCaseSchema.add({ expiresAt: { type: Date } });
MysteryCaseSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $exists: true } } });
export const MysteryCase = mongoose.models.MysteryCase || mongoose.model('MysteryCase', MysteryCaseSchema);
