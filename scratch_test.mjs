import { calculateTextStats } from './src/features/word-counter/utils/counter-engine.js';

const text = `Thank you for your reply. 😊

I actually created a sample website concept for Salon Divine.

Would you like me to send you the preview link?`;

try {
  const result = calculateTextStats(text);
  console.log("SUCCESS:", JSON.stringify(result, null, 2));
} catch (err) {
  console.error("ERROR:", err);
}
