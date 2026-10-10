const { generateEmbedding } = require("./embeddings");
const { cosineSimilarity } = require("./cosineSimilarity");

(async () => {
  const a = await generateEmbedding("How do I get a refund?");
  const b = await generateEmbedding("What is your return policy?");
  const c = await generateEmbedding("Where is the parking lot?");

  console.log("refund vs return:", cosineSimilarity(a, b));
  console.log("refund vs parking:", cosineSimilarity(a, c));
})();