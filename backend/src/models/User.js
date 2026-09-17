import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({ name: { type: String, trim: true, required: true, maxlength: 80 }, email: { type: String, trim: true, lowercase: true, unique: true, required: true }, passwordHash: { type: String, required: true, select: false } }, { timestamps: true });
userSchema.methods.verifyPassword = function (password) { return bcrypt.compare(password, this.passwordHash); };
export default mongoose.model('User', userSchema);
