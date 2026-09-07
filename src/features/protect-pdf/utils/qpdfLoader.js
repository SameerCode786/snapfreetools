/**
 * Client-Side QPDF WebAssembly Loader & Helper
 * Loads qpdf-wasm in browser environment to perform ISO 32000-compliant PDF encryption.
 */

let cachedQpdfModule = null;

export const loadQpdfModule = async () => {
  if (cachedQpdfModule) return cachedQpdfModule;

  if (typeof window === "undefined") {
    throw new Error("QPDF WASM engine can only run in client-side browser environment.");
  }

  // Runtime Isolation Warning
  if (!window.crossOriginIsolated) {
    console.warn("window.crossOriginIsolated is false. SharedArrayBuffer requires COOP and COEP headers.");
  }

  // Polyfills for Emscripten runtime
  if (typeof window.self === "undefined") {
    window.self = window;
  }

  try {
    const createQpdfModule = (await import("qpdf-wasm")).default;
    
    const options = {
      noInitialRun: true,
      locateFile: (path) => {
        if (path.endsWith(".wasm")) {
          return "/wasm/qpdf.wasm";
        }
        if (path.endsWith(".js")) {
          return "/wasm/qpdf.js";
        }
        return path;
      }
    };

    const qpdf = await createQpdfModule(options);

    cachedQpdfModule = qpdf;
    return qpdf;
  } catch (err) {
    console.error("Failed to load QPDF WASM Module:", err);
    throw new Error("Unable to load client-side PDF encryption WASM engine. Please refresh and try again.");
  }
};

/**
 * Executes QPDF encryption in client-side virtual filesystem
 */
export const executeQpdfEncryption = async ({
  arrayBuffer,
  userPassword,
  ownerPassword,
  keyLength = "256",
  permissions = {
    printing: false,
    copying: false,
    modifying: false,
    annotating: false
  }
}) => {
  const qpdf = await loadQpdfModule();

  const inputPath = `/input_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.pdf`;
  const outputPath = `/output_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.pdf`;

  try {
    const inputBytes = new Uint8Array(arrayBuffer);
    qpdf.FS.writeFile(inputPath, inputBytes);

    const actualOwnerPass = (ownerPassword && ownerPassword.trim()) ? ownerPassword.trim() : userPassword;
    const actualUserPass = userPassword ? userPassword.trim() : "";

    // Build QPDF CLI command arguments
    const args = [
      "--encrypt",
      actualUserPass,
      actualOwnerPass,
      keyLength === "128" ? "128" : "256",
      permissions.printing ? "--print=full" : "--print=none",
      permissions.copying ? "--extract=y" : "--extract=n",
      permissions.modifying ? "--modify=all" : "--modify=none",
      permissions.annotating ? "--annotate=y" : "--annotate=n",
      "--",
      inputPath,
      outputPath
    ];

    // Call QPDF C++ main entrypoint inside WASM sandbox
    qpdf.callMain(args);

    // Read generated encrypted PDF from Emscripten Virtual File System
    const outputBytes = qpdf.FS.readFile(outputPath);

    // Clean up Virtual File System
    try {
      qpdf.FS.unlink(inputPath);
      qpdf.FS.unlink(outputPath);
    } catch (cleanErr) {}

    return outputBytes;
  } catch (err) {
    // Cleanup files on error
    try {
      qpdf.FS.unlink(inputPath);
      qpdf.FS.unlink(outputPath);
    } catch (e) {}
    console.error("QPDF WASM Execution Failure:", err);
    throw new Error("PDF encryption failed during client-side processing.");
  }
};
