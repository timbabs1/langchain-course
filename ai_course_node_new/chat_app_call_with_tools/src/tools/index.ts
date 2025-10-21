import { get } from "http";
import OpenAI from "openai";

const openai = new OpenAI();

function getTimeOfDay() {
  return (
    new Date().getHours() +
    ":" +
    new Date().getMinutes() +
    ":" +
    new Date().getSeconds()
  );
}

function getOrderStatus(orderId: string) {
  console.log(``);
  const orderAsNumber = parseInt(orderId);
  if (orderAsNumber % 2 === 0) {
    return "Order is in progress";
  } else {
    return "Order is complete";
  }
}

async function callOpenAIWithTools() {
  const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are helpful assistant that gives information about the time of day and order status",
    },
    {
      role: "user",
      content: "What is the status of order 1235?",
    },
  ];
  // configure chat tools (first openAI call)
  const response = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo-0613",
      messages: context,
      tools: [
        {
          type: "function",
          function: {
            name: "getTimeOfDay",
            description: "Get the current time of day",
          },
        },
        {
          type: "function",
          function: {
            name: "getOrderStatus",
            description: "Returns the status of an order",
            parameters: {
              type: "object",
              properties: {
                orderId: {
                  type: "string",
                  description: "The order ID to check the status of",
                },
              },
              required: ["orderId"],
            },
          },
        },
      ],
      tool_choice: "auto", // the engine will decide which tool to use
    })
    .catch(console.error);
  // decide if tool call is required
  const willInvokeFunction =
    response?.choices[0].finish_reason === "tool_calls";
  const toolCall = response?.choices[0].message.tool_calls![0];
  if (willInvokeFunction) {
    const toolName = toolCall?.function.name;
    if (toolName === "getTimeOfDay") {
      const toolResponse = getTimeOfDay();
      context.push(response?.choices[0].message);
      context.push({
        role: "tool",
        content: toolResponse,
        tool_call_id: toolCall?.id as string,
      });
      console.log("Tool response: ", toolResponse);
    }
    if (toolName === "getOrderStatus") {
      const rawArguments = toolCall?.function.arguments;
      const parsedArguments = JSON.parse(rawArguments as string);
      const toolResponse = getOrderStatus(parsedArguments.orderId);
      context.push(response?.choices[0].message);
      context.push({
        role: "tool",
        content: toolResponse,
        tool_call_id: toolCall?.id as string,
      });
      console.log("Tool response: ", toolResponse);
    }
    const a = 5;
  }

  const secondResponse = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo-0613",
      messages: context,
    })
    .catch(console.error);
  //console.log(response?.choices[0].message);
  console.log(secondResponse?.choices[0].message);
}

callOpenAIWithTools();

// configure chat tools (first openAI call)
// decide if tool call is required
// invoke the tool
// make a second openAI call with the tool response
