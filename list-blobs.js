
const { list } = require('@vercel/blob');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });
dotenv.config();

async function showBlobs() {
    try {
        const { blobs } = await list({
            token: process.env.BLOB_READ_WRITE_TOKEN,
            limit: 50
        });

        if (blobs.length === 0) {
            fs.writeFileSync('blobs_output.txt', "No blobs found.");
        } else {
            const content = blobs.map(b => `${b.pathname}: ${b.url}`).join('\n');
            console.log(content);
            fs.writeFileSync('blobs_output.txt', content);
        }
    } catch (error) {
        console.error("Error listing blobs:", error.message);
        fs.writeFileSync('blobs_output.txt', "Error: " + error.message);
    }
}

showBlobs();
