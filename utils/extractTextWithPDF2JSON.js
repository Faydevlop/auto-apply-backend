const pdfExtract = require('pdf-extract');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function extractTextWithPdfExtract(buffer) {
  const tmpFilePath = path.join(os.tmpdir(), `temp-${Date.now()}.pdf`);
  fs.writeFileSync(tmpFilePath, buffer);

  return new Promise((resolve, reject) => {
    const options = { type: 'text' };
    const processor = pdfExtract(tmpFilePath, options, (err) => {
      if (err) return reject(err);
    });

    processor.on('complete', data => {
      const text = data.text_pages.join('\n');
      fs.unlinkSync(tmpFilePath); // clean temp file
      resolve(text);
    });

    processor.on('error', err => {
      fs.unlinkSync(tmpFilePath);
      reject(err);
    });
  });
}

module.exports = extractTextWithPdfExtract;
