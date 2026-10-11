const { chunkBySection } = require("./chunking");
const { VectorStore } = require("./vectorStore");

const doc = `## Refunds
You can request a refund within 30 days. Refunds go to the original payment method.
## Parking
Visitor parking is free. Use lot B after 6pm.
## Support
Contact support by email or chat from 9am to 5pm.`;

(async () => {
  // 1. Chunk
  const chunks = chunkBySection(doc);
  console.log("Chunks:", chunks.length);              // expect 3

  // 2. Index: one add() call per chunk
  const vs = new VectorStore();
  for (const chunk of chunks) {
    await vs.add(chunk);
  }
  console.log("Stored items:", vs.items.length);      // expect 3
  console.log("Vector length:", vs.items[0].embedding.length);  // expect 1024

  // 3. Search
  const questions = [
    "How do I get my money back?",   // should rank Refunds first
    "Where can I park my car?",      // should rank Parking first
    "How can I reach someone?",      // should rank Support first
  ];

  for (const q of questions) {
    const top = await vs.search(q, 2);
    console.log("\nQ:", q);
    top.forEach(r =>
      console.log(`  ${r.score.toFixed(3)}  ${r.text.split("\n")[0]}`)
    );
  }
})();