import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const docs = {
  "deposition.md": "This deposition covers the testimony of Angela Smith, P.E.",
  "report.pdf": "The report details the state of a 20m condenser tower.",
  "plan.md": "The plan outlines the steps for the project's implementation.",
};
const server=new McpServer({
    name:"DocumentMcp",
    version:"1.0.0",
});
server.registerTool(
  "read_doc_contents",
  {
    description: "Read the contents of a document and return it as a string.",
    inputSchema: {
      doc_id: z.string().describe("Id of the document to read"),
    },
  },
  async ({ doc_id }) => {
    if (!(doc_id in docs)) {
      throw new Error(`Doc with id ${doc_id} not found`);
    }
    return { content: [{ type: "text", text: docs[doc_id] }] };
  }
);
server.registerTool(
  "edit_document",
  {
    description:
    "Edit a document by replacing a string in the document's content with a new string.",
    inputSchema:
    {
      doc_id :z.string().describe("Id of the document that will be edited"),
      old_str :z.string().describe("The text to replace.Must match exactly including whitespace"),
      new_str : z.string().describe("The new text to insert in place of the old text"),
    },
  },
  async({doc_id,old_str,new_str})=>
    {
      if(!(doc_id in docs))
      {
        throw new Error(`Doc with id ${doc_id} not found`);
      }
     docs[doc_id]=docs[doc_id].replace(old_str,new_str);
     return {content :[{type:"text",text:"Document updated."}]};
    } 
);
const transport = new StdioServerTransport();
await server.connect(transport);