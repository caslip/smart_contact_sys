const fs = require('fs');
const path = require('path');

async function upload() {
    const filePath = path.join(__dirname, 'test.txt');
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, 'test content');
    }

    const fileBlob = new Blob([fs.readFileSync(filePath)], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', fileBlob, 'test.txt');

    try {
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

upload();
