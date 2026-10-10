const { generateEmbedding } = require("./embeddings");

(async () => {
  const vec = await generateEmbedding("How do I get a refund?");
  console.log("length:", vec.length);
  console.log("first 5:", vec.slice(0, 5));
})();