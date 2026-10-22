import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const res = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 100,
  messages: [{ role: "user", content: "what's 1+1?" }],
});
console.log(res.content[0].text);