require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const readline = require('readline');

const client = new Anthropic();
const model = "claude-sonnet-4-6";

function addUserMessage(messages, text) {
  messages.push({ role: "user", content: text });
}

function addAssistantMessage(messages, text) {
  messages.push({ role: "assistant", content: text });
}

async function chat(messages) {
  const message = await client.messages.create({
    model: model,
    max_tokens: 1000,
    messages: messages
  });
  return message.content[0].text;
}

// Set up terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Wraps rl.question in a Promise so we can use await
function askUser(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => resolve(answer));
  });
}

async function main() {
  const messages = [];

  while (true) {
    const userInput = await askUser("You: ");   // 1. get user input
    addUserMessage(messages, userInput);         // 2. add to messages

    const reply = await chat(messages);          // 3. call the API
    addAssistantMessage(messages, reply);        // 4. add reply to messages

    console.log("Claude:", reply);               // 5. print reply
    // 6. loop repeats automatically
  }
}

main();