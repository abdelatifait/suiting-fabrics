const fs = require('fs');
const path = require('path');

async function testUpload() {
  const filePath = path.join(__dirname, 'test-image.txt');
  fs.writeFileSync(filePath, Buffer.alloc(1024 * 1024, 'a')); // 1MB

  const formData = new FormData();
  const fileToUpload = new File([fs.readFileSync(filePath)], 'test-image.jpg', { type: 'image/jpeg' });
  formData.append('images', fileToUpload);

  try {
    console.log('Sending upload request to Railway...');
    const res = await fetch('https://suiting-fabrics-production.up.railway.app/api/admin/upload', {
      method: 'POST',
      headers: {
        'x-admin-password': 'suiting2026'
      },
      body: formData
    });
    
    const data = await res.text();
    console.log('Response body:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  } finally {
    fs.unlinkSync(filePath);
  }
}

testUpload();
