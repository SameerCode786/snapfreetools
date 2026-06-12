export function calculateTextStats(text) {
  const trimmedText = text.trim();
  const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
  const characters = text.length;
  const sentences = trimmedText ? trimmedText.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = trimmedText ? trimmedText.split(/\n+/).filter(Boolean).length : 0;
  
  // Average reading speed: 200 words per minute
  const readingTime = Math.ceil(words / 200);

  // Average speaking speed: 130 words per minute
  const speakingTime = Math.ceil(words / 130);

  const charsNoSpaces = text.replace(/\s/g, "").length;

  const avgWordLength = words > 0 ? parseFloat((charsNoSpaces / words).toFixed(1)) : 0;
  const avgSentenceLength = sentences > 0 ? parseFloat((words / sentences).toFixed(1)) : 0;

  // Keyword density
  const cleanText = text.toLowerCase().replace(/[^\w\s-]/g, "");
  const rawWords = cleanText.split(/\s+/).filter(w => w.length > 0);

  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by", "of", "is", "are", 
    "was", "were", "it", "its", "this", "that", "these", "those", "as", "from", "about", "your", "my", 
    "our", "their", "he", "she", "they", "we", "you", "i", "me", "him", "her", "us", "them", "has", "have", 
    "had", "do", "does", "did", "will", "would", "shall", "should", "can", "could", "may", "might", "must", 
    "if", "then", "else", "than", "so", "very", "too", "also", "just", "any", "some", "no", "not", "only", 
    "other", "been", "being", "here", "there", "when", "where", "why", "how", "all", "both", "each", "few", 
    "more", "most", "such", "own", "same", "so", "don", "now", "re", "ve", "ll", "d"
  ]);

  const wordCountsAll = {};
  const wordCountsClean = {};

  rawWords.forEach(w => {
    wordCountsAll[w] = (wordCountsAll[w] || 0) + 1;
    if (!stopWords.has(w) && w.length > 1) {
      wordCountsClean[w] = (wordCountsClean[w] || 0) + 1;
    }
  });

  const getSortedDensity = (countsObj, total) => {
    return Object.entries(countsObj)
      .map(([word, count]) => ({
        word,
        count,
        density: total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0
      }))
      .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
  };

  const densityAll = getSortedDensity(wordCountsAll, rawWords.length);
  const densityClean = getSortedDensity(wordCountsClean, rawWords.length);

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
    densityClean
  };
}
