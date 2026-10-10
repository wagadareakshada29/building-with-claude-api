require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();
const model = "claude-sonnet-4-6";

// ---------- TOOL FUNCTION ----------
function getCurrentDatetime(dateFormat = "YYYY-MM-DD HH:mm:ss") {
  if (!dateFormat) {
    throw new Error("dateFormat cannot be empty");
  }
  const now = new Date();
  const map = {
    YYYY: now.getFullYear(),
    MM: String(now.getMonth() + 1).padStart(2, '0'),
    DD: String(now.getDate()).padStart(2, '0'),
    HH: String(now.getHours()).padStart(2, '0'),
    mm: String(now.getMinutes()).padStart(2, '0'),
    ss: String(now.getSeconds()).padStart(2, '0')
  };
  return dateFormat.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => map[match]);
}

// ---------- TOOL SCHEMA ----------
const getCurrentDatetimeSchema = {
  name: "get_current_datetime",
  description: "Returns the current date and time formatted according to the specified format. Use this whenever you need to know the current date, time, or both, before doing any date-related calculations. Returns a formatted date/time string.",
  input_schema: {
    type: "object",
    properties: {
      dateFormat: {
        type: "string",
        description: "A string specifying the format of the returned datetime, using placeholders like YYYY, MM, DD, HH, mm, ss.",
        default: "YYYY-MM-DD HH:mm:ss"
      }
    },
    required: []
  }
};

// ---------- HELPER FUNCTIONS ----------
function addUserMessage(messages, content) {
  messages.push({ role: "user", content: content });
}

function addAssistantMessage(messages, content) {
  messages.push({ role: "assistant", content: content });
}

// ---------- MAIN: FULL TOOL USE LOOP ----------
async function main() {
  const messages = [];
  addUserMessage(messages, "What is the exact time, formatted as HH:mm:ss?");

  // STEP 1: Ask Claude, giving it the tool
  const response = await client.messages.create({
    model: model,
    max_tokens: 1000,
    messages: messages,
    tools: [getCurrentDatetimeSchema]
  });

  // STEP 2: Save Claude's full reply
  addAssistantMessage(messages, response.content);

  // STEP 3: Check if Claude requested a tool
  const toolBlock = response.content.find(block => block.type === "tool_use");

  if (toolBlock) {
    // STEP 4: Actually run the real function
    const result = getCurrentDatetime(toolBlock.input.dateFormat);
    console.log("Function result:", result);

    // STEP 5: Send the result back as a tool_result block
    messages.push({
      role: "user",
      content: [{
        type: "tool_result",
        tool_use_id: toolBlock.id,
        content: result,
        is_error: false
      }]
    });

    // STEP 6: Call Claude again, now with the real result included
    const finalResponse = await client.messages.create({
      model: model,
      max_tokens: 1000,
      messages: messages,
      tools: [getCurrentDatetimeSchema]
    });

    // STEP 7: Print Claude's real final answer
    console.log("Claude's final answer:", finalResponse.content[0].text);
  } else {
    console.log("Claude's answer:", response.content[0].text);
  }
}

main();