//making a request to the claude
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic(); // automatically reads ANTHROPIC_API_KEY from .env
const model = "claude-sonnet-4-6";

async function main() {
  const message = await client.messages.create({
    model: model,
    max_tokens: 1000,
    messages: [
      { role: "user", content: "What is quantum computing? Answer in one sentence." }
    ]
  });

  console.log(message.content[0].text);
}

main();