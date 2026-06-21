import encode, { init } from '@jsquash/avif/encode';

self.onmessage = async (e) => {
  const { type, imageData, wasmBuffer } = e.data;

  try {
    if (type === 'init') {
      await init(wasmBuffer);
      self.postMessage({ type: 'init-ready' });
    } else if (type === 'encode') {
      // Quality goes from 0-100. Default Squoosh quality is 75.
      // Speed ranges from 0-10 (higher is faster, lower is more compressed). We use 8 for fast browser UI response.
      const avifBuffer = await encode(imageData, {
        quality: 75,
        speed: 8
      });
      self.postMessage({ type: 'success', buffer: avifBuffer }, [avifBuffer]);
    }
  } catch (err) {
    self.postMessage({ type: 'error', message: err.message || err.toString() });
  }
};
