import path from "path";
import { fileURLToPath } from "url";
import { createWorker } from "tesseract.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testTesseractV7() {
  const imagePath = path.resolve(__dirname, "../node_modules/tesseract.js/tests/assets/images/cosmic.png");
  console.log("Creating Tesseract worker for image:", imagePath);
  const worker = await createWorker("eng");

  console.log("\n=========================================");
  console.log("TEST 1: Calling recognize WITHOUT output arg (default)");
  console.log("=========================================");
  const res1 = await worker.recognize(imagePath);
  console.log("res1.data keys:", Object.keys(res1.data));
  console.log("res1.data.text length:", res1.data.text ? res1.data.text.length : 0);
  console.log("res1.data.words type/length:", typeof res1.data.words, Array.isArray(res1.data.words) ? res1.data.words.length : res1.data.words);
  console.log("res1.data.blocks type/length:", typeof res1.data.blocks, Array.isArray(res1.data.blocks) ? res1.data.blocks.length : res1.data.blocks);
  console.log("res1.data.lines type/length:", typeof res1.data.lines, Array.isArray(res1.data.lines) ? res1.data.lines.length : res1.data.lines);

  console.log("\n=========================================");
  console.log("TEST 2: Calling recognize WITH { text: true, blocks: true }");
  console.log("=========================================");
  const res2 = await worker.recognize(imagePath, {}, { text: true, blocks: true });
  console.log("res2.data keys:", Object.keys(res2.data));
  console.log("res2.data.text length:", res2.data.text ? res2.data.text.length : 0);
  console.log("res2.data.words type/length:", typeof res2.data.words, Array.isArray(res2.data.words) ? res2.data.words.length : res2.data.words);
  console.log("res2.data.blocks type/length:", typeof res2.data.blocks, Array.isArray(res2.data.blocks) ? res2.data.blocks.length : res2.data.blocks);
  if (res2.data.blocks && res2.data.blocks.length > 0) {
    const block0 = res2.data.blocks[0];
    console.log("block0 keys:", Object.keys(block0));
    if (block0.paragraphs && block0.paragraphs.length > 0) {
      const para0 = block0.paragraphs[0];
      console.log("para0 keys:", Object.keys(para0));
      if (para0.lines && para0.lines.length > 0) {
        const line0 = para0.lines[0];
        console.log("line0 keys:", Object.keys(line0));
        if (line0.words && line0.words.length > 0) {
          const word0 = line0.words[0];
          console.log("word0 keys:", Object.keys(word0));
          console.log("word0 sample:", JSON.stringify(word0));
        }
      }
    }
  }

  await worker.terminate();
  console.log("\nDone.");
}

testTesseractV7().catch(console.error);
