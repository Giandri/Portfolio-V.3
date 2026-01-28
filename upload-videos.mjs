
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const videos = [
    'public/videos/loggs maps.mp4',
    'public/videos/loggs video.mp4'
];

async function upload() {
    console.log('Starting upload using token:', process.env.BLOB_READ_WRITE_TOKEN ? 'FOUND' : 'MISSING');

    for (const videoPath of videos) {
        if (!fs.existsSync(videoPath)) {
            console.error(`File not found: ${videoPath}`);
            continue;
        }

        console.log(`Uploading ${videoPath}...`);
        try {
            const file = fs.readFileSync(videoPath);
            const filename = path.basename(videoPath);

            const blob = await put(filename, file, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN
            });

            console.log(`✅ Uploaded: ${blob.url}`);
        } catch (error) {
            console.error(`❌ Failed to upload ${videoPath}:`, error);
        }
    }
}

upload();
