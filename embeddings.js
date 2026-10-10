require("dotenv").config();
const { VoyageAIClient } = require("voyageai");

const client = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });

async function generateEmbedding(text) {
  const result = await client.embed({
    input: [text],
    model: "voyage-3-large",
  });
  return result.data[0].embedding;
}

module.exports = { generateEmbedding };