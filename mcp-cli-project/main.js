import "dotenv/config";
import readline from "node:readline/promises";
import Anthropic from "@anthropic-ai/sdk";
import { MCPClient } from "./mcp_client.js";

const anthropic = new Anthropic();
const mcp = new MCPClient("node", ["mcp_server.js"]);
await mcp.connect();

const tools = (await mcp.listTools()).map((t) => ({
  name: t.name,
  description: t.description,
  input_schema: t.inputSchema,
}));

const messages = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

while (true) {
  const question = await rl.question("> ");
  if (question === "exit") break;
  messages.push({ role: "user", content: question });

  let response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages,
    tools,
  });

  while (response.stop_reason === "tool_use") {
    messages.push({ role: "assistant", content: response.content });

    const results = [];
    for (const block of response.content) {
      if (block.type === "tool_use") {
        const r = await mcp.callTool(block.name, block.input);
        results.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: r.content[0].text,
        });
      }
    }
    messages.push({ role: "user", content: results });

    response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages,
      tools,
    });
  }

  messages.push({ role: "assistant", content: response.content });
  console.log(response.content.find((b) => b.type === "text")?.text);
}

rl.close();
await mcp.close();