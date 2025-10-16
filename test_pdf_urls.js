const https = require('https');

// Test the PDF URLs directly
const pdfUrls = [
  'https://vgc.psofttechnologies.in/builder/01K7KSNSJH867R8M5QE9HBMT2H.pdf',
  'https://vgc.psofttechnologies.in/builder/01K7H5EVBBZ9X8GH7FC22XGCX0.pdf'
];

pdfUrls.forEach((url, index) => {
  console.log(`\nTesting PDF URL ${index + 1}: ${url}`);
  
  const urlObj = new URL(url);
  const options = {
    hostname: urlObj.hostname,
    port: 443,
    path: urlObj.pathname,
    method: 'HEAD'
  };

  const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  });

  req.on('error', (error) => {
    console.error(`Error testing URL: ${error.message}`);
  });

  req.end();
});