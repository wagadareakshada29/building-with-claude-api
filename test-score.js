const { VectorStore } = require("./vectorStore");

(async () => {
  const store = new VectorStore();
  await store.add("Software Engineering: we studied infection vectors in distributed systems.");

  console.log("Items:", store.items.length);
  console.log("Text:", store.items[0].text);
  console.log("Embedding length:", store.items[0].embedding.length);
})();