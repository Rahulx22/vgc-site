const https = require('https');

// Test all possible URL patterns
const pdfTests = [
  {
    job: '2.developer',
    urls: [
      'https://vgc.psofttechnologies.in/builder/01K7KSNSJH867R8M5QE9HBMT2H.pdf',
      'https://vgc.psofttechnologies.in/storage/builder/01K7KSNSJH867R8M5QE9HBMT2H.pdf',
      'https://vgc.psofttechnologies.in/uploads/builder/01K7KSNSJH867R8M5QE9HBMT2H.pdf',
      'https://vgc.psofttechnologies.in/files/builder/01K7KSNSJH867R8M5QE9HBMT2H.pdf'
    ]
  },
  {
    job: '1. Senior Accountant',
    urls: [
      'https://vgc.psofttechnologies.in/builder/01K7H5EVBBZ9X8GH7FC22XGCX0.pdf',
      'https://vgc.psofttechnologies.in/storage/builder/01K7H5EVBBZ9X8GH7FC22XGCX0.pdf',
      'https://vgc.psofttechnologies.in/uploads/builder/01K7H5EVBBZ9X8GH7FC22XGCX0.pdf',
      'https://vgc.psofttechnologies.in/files/builder/01K7H5EVBBZ9X8GH7FC22XGCX0.pdf'
    ]
  }
];

function testUrl(url, jobName, index) {
  return new Promise((resolve) => {
    console.log(`\nTesting ${jobName} - URL ${index + 1}: ${url}`);
    
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'HEAD'
    };

    const req = https.request(options, (res) => {
      console.log(`  Status Code: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log(`  SUCCESS! This URL works.`);
        resolve({ url, status: res.statusCode, success: true });
      } else {
        resolve({ url, status: res.statusCode, success: false });
      }
    });

    req.on('error', (error) => {
      console.log(`  Error: ${error.message}`);
      resolve({ url, error: error.message, success: false });
    });

    req.setTimeout(5000, () => {
      console.log(`  Timeout`);
      req.destroy();
      resolve({ url, error: 'timeout', success: false });
    });

    req.end();
  });
}

async function testAllUrls() {
  for (const testGroup of pdfTests) {
    console.log(`\n=== Testing URLs for ${testGroup.job} ===`);
    const results = [];
    
    for (let i = 0; i < testGroup.urls.length; i++) {
      const result = await testUrl(testGroup.urls[i], testGroup.job, i);
      results.push(result);
    }
    
    console.log(`\n--- Results for ${testGroup.job} ---`);
    const successful = results.filter(r => r.success);
    if (successful.length > 0) {
      console.log(`Found working URL(s):`);
      successful.forEach(r => console.log(`  ${r.url}`));
    } else {
      console.log(`No working URLs found.`);
    }
  }
}

testAllUrls();