import mongoose from 'mongoose';
const schema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, name: { type: String, required: true, trim: true, maxlength: 80 }, parentFolder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null }, category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null } }, { timestamps: true });
schema.index({ user: 1, name: 1, parentFolder: 1 }, { unique: true }); export default mongoose.model('Folder', schema);
