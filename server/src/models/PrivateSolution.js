import mongoose from 'mongoose';

const PrivateSolutionSchema = new mongoose.Schema({ caseId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, index: true }, solution: { type: mongoose.Schema.Types.Mixed, required: true } }, { timestamps: true, strict: true });
export const PrivateSolution = mongoose.models.PrivateSolution || mongoose.model('PrivateSolution', PrivateSolutionSchema);
