function chunkByChar(text, chunkSize = 8, overlap = 2) {
  if (overlap >= chunkSize) throw new Error("overlap must be smaller than chunkSize");
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start = end < text.length ? end - overlap : text.length;
  }
  return chunks;
}

function chunkBySection(text) {
  return text
    .split(/\n(?=## )/)          // keep "## " header inside each chunk
    .map(c => c.trim())
    .filter(c => c.length > 20); // drop title-only chunks like "# Report"
}

function chunkBySentence(text, maxSentences = 5, overlap = 1) {
  if (overlap >= maxSentences) throw new Error("overlap must be smaller than maxSentences");
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let start = 0;

  while (start < sentences.length) {
    const end = Math.min(start + maxSentences, sentences.length);
    chunks.push(sentences.slice(start, end).join(" "));
    if (end === sentences.length) break;
    start += maxSentences - overlap;
  }
  return chunks;
}

module.exports = { chunkByChar, chunkBySection, chunkBySentence };