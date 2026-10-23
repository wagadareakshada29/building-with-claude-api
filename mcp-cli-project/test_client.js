import { MCPClient } from "./mcp_client.js";

const client = new MCPClient("node", ["mcp_server.js"]);
await client.connect();
console.log((await client.listTools()).map((t) => t.name));
const r = await client.callTool("read_doc_contents", { doc_id: "report.pdf" });
console.log(r.content[0].text);
await client.close();