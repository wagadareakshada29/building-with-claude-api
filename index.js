//multi turn conversations
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();
const model = "claude-sonnet-4-6";

// Adds a user message to the conversation history
function addUserMessage(messages, text) {
  messages.push({ role: "user", content: text });
}

// Adds Claude's reply to the conversation history
function addAssistantMessage(messages, text) {
  messages.push({ role: "assistant", content: text });
}

// Sends the FULL conversation so far, gets Claude's reply text back
async function chat(messages) {
  const message = await client.messages.create({
    model: model,
    max_tokens: 1000,
    messages: messages
  });
  return message.content[0].text;
}

async function main() {
  const messages = []; // empty conversation to start

  addUserMessage(messages, "Define quantum computing in one sentence");
  const answer = await chat(messages);
  console.log("Claude:", answer);

  addAssistantMessage(messages, answer); // save Claude's reply into history

  addUserMessage(messages, "Write another sentence");
  const finalAnswer = await chat(messages);
  console.log("Claude:", finalAnswer);
}

main();