require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();
const model = "claude-sonnet-4-6";

function addUserMessage(messages, text) {
  messages.push({ role: "user", content: text });
}

async function chat(messages, system = null) {
  const params = { model, max_tokens: 1000, messages };
  if (system) params.system = system;
  const message = await client.messages.create(params);
  return message.content[0].text;
}

// The prompt you're testing/improving goes here
async function runPrompt(inputs) {
  const prompt = `Explain the concept of ${inputs.topic} to a student.`;
  const messages = [];
  addUserMessage(messages, prompt);
  return await chat(messages);
}

// Fixed set of test cases — reused every time you tweak the prompt
const testCases = [
  { topic: "photosynthesis" },
  { topic: "Newton's second law" },
  { topic: "recursion in programming" }
];

async function main() {
  for (const testCase of testCases) {
    console.log("=== INPUT:", testCase.topic, "===");
    const output = await runPrompt(testCase);
    console.log(output);
    console.log("\n---\n");
  }
}

main();