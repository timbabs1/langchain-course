import { get } from "http";
import OpenAI from "openai";
import { encoding_for_model } from "tiktoken";

const openai = new OpenAI();
const encoder = encoding_for_model("gpt-3.5-turbo");

const MAX_TOKENS = 700;

const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: "You are a helpful chatbot",
  },
];

async function createChatCompletion(message: string) {
  const response = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo",
      messages: [
        ...context,
        {
          role: "user",
          content: message,
        },
      ],
    })
    .catch(console.error);
  const responseMessage = response?.choices[0].message.content;
  context.push({ role: "assistant", content: responseMessage });
  if (response?.usage && response?.usage.total_tokens > MAX_TOKENS) {
    deleteOlderMessages();
    console.log("You have used too many tokens. Exiting...");
    //process.exit(0);
  }
  console.log(response?.choices[0].message);
}

function deleteOlderMessages() {
  let contentLength = getContextLength();
  while (contentLength > MAX_TOKENS) {
    for (let i = 0; i < context.length; i++) {
      const message = context[i];
      if (message.role !== "system") {
        context.splice(i, 1);
        contentLength = getContextLength();
        console.log("Deleted message: ", message);
        console.log("Context length: ", contentLength);
        break;
      }
    }
  }
}
console.log("api key: ", process.env.OPENAI_API_KEY);

function getContextLength() {
  let length = 0;
  context.forEach((message) => {
    if (typeof message.content === "string") {
      length += encoder.encode(message.content).length;
    } else if (Array.isArray(message.content)) {
      message.content.forEach((subMessage) => {
        if (subMessage.type === "text") {
          length += encoder.encode(subMessage.text).length;
        }
      });
    }
  });
  return length;
}

process.stdin.addListener("data", async (data) => {
  const userInput = data.toString().trim();
  createChatCompletion(userInput);
});

console.log("api key: ", process.env.OPENAI_API_KEY);
