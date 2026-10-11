require("dotenv").config();
const { VoyageAIClient } = require("voyageai");

const client = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });

// Embed ONE text -> returns a vector
async function generateEmbedding(text) {
  const result = await client.embed({
    input: [text],
    model: "voyage-3-large",
  });
  return result.data[0].embedding;
}

// Embed MANY chunks -> returns [{ text, embedding }, ...]
async function embedChunks(chunks) {
  const store = [];
  for (const text of chunks) {
    store.push({ text, embedding: await generateEmbedding(text) });
  }
  return store;
}

module.exports = { generateEmbedding, embedChunks };