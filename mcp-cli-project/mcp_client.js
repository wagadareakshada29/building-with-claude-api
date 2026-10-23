import {Client} from "@modelcontextprotocol/sdk/client/index.js";
import {StdioClientTransport} from "@modelcontextprotocol/sdk/client/stdio.js";

export class MCPClient
{
    constructor(command,args)
    {
        this.command=command;
        this.args=args;
        this.client=new Client({name:"doc_client",version:"1.0.0"});
    }
    async connect()
    {
        const transport=new StdioClientTransport({
            command:this.command,
            args:this.args,
        });
        await this.client.connect(transport);
    }
    async listTools()
    {
        const result=await this.client.listTools();
        return result.tools;
    }
    async callTool(name,args)
    {
        return await this.client.callTool({name,arguments:args});
    }
    async close()
    {
        await this.client.close();
    }
}