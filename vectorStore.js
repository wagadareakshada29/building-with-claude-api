const { generateEmbedding } = require("./embeddings");

class VectorStore {
  constructor() {
    this.items = [];
  }

  async add(text) {
    const embedding = await generateEmbedding(text);
    this.items.push({ text, embedding });
  }
}

module.exports = { VectorStore };