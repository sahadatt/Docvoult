import fs from 'node:fs/promises'; import path from 'node:path'; import crypto from 'node:crypto';
const root = path.resolve('src/uploads');
export const storageService = { async save(file) { await fs.mkdir(root, { recursive: true }); const key = `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`; await fs.writeFile(path.join(root, key), file.buffer); return key; }, getPath(key) { return path.join(root, path.basename(key)); }, async remove(key) { await fs.rm(this.getPath(key), { force: true }); } };
