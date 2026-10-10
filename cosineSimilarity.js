function cosineSimilarity(a, b) {
  let dot = 0;
  let lenA = 0;
  let lenB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    lenA += a[i] * a[i];
    lenB += b[i] * b[i];
  }

  return dot / (Math.sqrt(lenA) * Math.sqrt(lenB));
}

module.exports = { cosineSimilarity };