export function calculateTextStats(text) {
  const trimmedText = text.trim();
  const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
  const characters = text.length;
  const sentences = trimmedText ? trimmedText.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = trimmedText ? trimmedText.split(/\n+/).filter(Boolean).length : 0;
  
  // Formatting helper for reading & speaking times
  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds} sec`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
  };

  // Average reading speed: 275 words per minute
  const readingSeconds = words > 0 ? Math.max(1, Math.round((words / 275) * 60)) : 0;
  const readingTime = formatTime(readingSeconds);

  // Average speaking speed: 180 words per minute
  const speakingSeconds = words > 0 ? Math.max(1, Math.round((words / 180) * 60)) : 0;
  const speakingTime = formatTime(speakingSeconds);

  const charsNoSpaces = text.replace(/\s/g, "").length;

  const avgWordLength = words > 0 ? parseFloat((charsNoSpaces / words).toFixed(1)) : 0;
  const avgSentenceLength = sentences > 0 ? parseFloat((words / sentences).toFixed(1)) : 0;

  // Text normalization: lowercase & strip punctuation (what's -> whats, don't -> dont)
  const normalized = text.toLowerCase().replace(/[^\w\s]|_/g, "");
  const rawWords = normalized.split(/\s+/).filter(w => w.length > 0);

  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by", "of", "is", "are", 
    "was", "were", "it", "its", "this", "that", "these", "those", "as", "from", "about", "your", "my", 
    "our", "their", "he", "she", "they", "we", "you", "i", "me", "him", "her", "us", "them", "has", "have", 
    "had", "do", "does", "did", "will", "would", "shall", "should", "can", "could", "may", "might", "must", 
    "if", "then", "else", "than", "so", "very", "too", "also", "just", "any", "some", "no", "not", "only", 
    "other", "been", "being", "here", "there", "when", "where", "why", "how", "all", "both", "each", "few", 
    "more", "most", "such", "own", "same", "now", "re", "ve", "ll", "d", "am"
  ]);

  const cleanWords = rawWords.filter(w => !stopWords.has(w));

  // Helper functions for generating and sorting n-grams
  const generateNGrams = (wordsArr, n) => {
    const nGrams = [];
    for (let i = 0; i <= wordsArr.length - n; i++) {
      nGrams.push(wordsArr.slice(i, i + n).join(" "));
    }
    return nGrams;
  };

  const getSortedDensity = (nGrams) => {
    const total = nGrams.length;
    if (total === 0) return [];

    const counts = {};
    nGrams.forEach(gram => {
      counts[gram] = (counts[gram] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([word, count]) => ({
        word,
        count,
        density: parseFloat(((count / total) * 100).toFixed(1))
      }))
      .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
  };

  // Generate density metrics
  const densityAll = {
    words: getSortedDensity(rawWords),
    phrases2: getSortedDensity(generateNGrams(rawWords, 2)),
    phrases3: getSortedDensity(generateNGrams(rawWords, 3))
  };

  const densityClean = {
    words: getSortedDensity(cleanWords),
    phrases2: getSortedDensity(generateNGrams(cleanWords, 2)),
    phrases3: getSortedDensity(generateNGrams(cleanWords, 3))
  };

  // Find longest word
  let longestWord = "";
  rawWords.forEach(w => {
    if (w.length > longestWord.length) {
      longestWord = w;
    }
  });

  // Get top 3 clean 1-gram keywords
  const topKeywords = (densityClean.words || []).slice(0, 3).map(item => item.word);

  return { 
    words, 
    characters, 
    sentences, 
    paragraphs, 
    readingTime,
    speakingTime,
    charsNoSpaces,
    avgWordLength,
    avgSentenceLength,
    densityAll,
    densityClean,
    longestWord,
    topKeywords
  };
}
