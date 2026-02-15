// Placeholder for file utility functions
import * as fs from 'fs';
import * as crypto from 'crypto';

export async function calculateFileHash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop() || '';
}
