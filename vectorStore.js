const { generateEmbedding } = require("./embeddings");
const { cosineSimilarity } = require("./cosineSimilarity");

class VectorStore {
  constructor() {
    this.items = [];
  }

  async add(text) {
    const embedding = await generateEmbedding(text);
    this.items.push({ text, embedding });
  }

  async search(question, k = 3) {
    const qVec = await generateEmbedding(question);
    return this.items
      .map(item => ({ text: item.text, score: cosineSimilarity(qVec, item.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }
}

module.exports = { VectorStore };