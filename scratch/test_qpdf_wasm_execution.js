import fs from 'fs';
import { Worker } from 'worker_threads';

// Polyfill Web API Worker and browser globals for Node test environment
global.Worker = class MockWorker {
  constructor(script, opts) {
    this.postMessage = () => {};
    this.addEventListener = () => {};
    this.onmessage = null;
    this.terminate = () => {};
  }
};
global.self = global;
global.self.location = { href: 'http://localhost/' };

async function testQpdfEncryption() {
  console.log("=== Testing QPDF WASM Encryption Engine ===");
  try {
    const createQpdfModule = (await import('qpdf-wasm')).default;
    const wasmPath = 'node_modules/qpdf-wasm/qpdf.wasm';
    const wasmBinary = fs.readFileSync(wasmPath);

    const qpdf = await createQpdfModule({
      wasmBinary,
      noInitialRun: true
    });
    console.log("QPDF WASM Module initialized successfully!");

    // Read test PDF
    const buf = fs.readFileSync('scratch/test_1_unprotected.pdf');
    const uint8Array = new Uint8Array(buf);

    // Write file into Emscripten Virtual File System (FS)
    qpdf.FS.writeFile('/input.pdf', uint8Array);

    // Run QPDF CLI command to encrypt with AES-256
    // qpdf --encrypt userpass ownerpass 256 --print=full --input.pdf output.pdf
    const args = [
      '--encrypt',
      'userpass123',
      'ownerpass123',
      '256',
      '--print=full',
      '--',
      '/input.pdf',
      '/output.pdf'
    ];

    console.log("Running QPDF args:", args.join(' '));
    qpdf.callMain(args);

    // Read generated output PDF from FS
    const outputBytes = qpdf.FS.readFile('/output.pdf');
    console.log("Protected PDF generated! Length:", outputBytes.length);

    fs.writeFileSync('scratch/test_protected_qpdf_output.pdf', outputBytes);
    console.log("Saved output to scratch/test_protected_qpdf_output.pdf");

  } catch (err) {
    console.error("QPDF execution error:", err);
  }
}

testQpdfEncryption();
