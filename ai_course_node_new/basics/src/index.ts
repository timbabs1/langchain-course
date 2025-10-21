import { OpenAI } from "openai";
import { encoding_for_model } from "tiktoken";

const openai = new OpenAI();

async function main() {
  const response = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo",
      messages: [
        // {
        //   role: "system",
        //   content: `You respond like a cool bro, and you respond in JSON format, like this:
        //   coolnessLevel: 1-10,
        //   answer: your answer
        //   `,
        // },
        { role: "user", content: "Say something cool" },
      ],
      //n: 2,
      frequency_penalty: 1.5,
      seed: 5555,
    })
    .catch(console.error);
  console.log(response?.choices[0].message);
  console.log(response?.choices);
}

function encodePrompt(prompt: string) {
  const promptLocal = "How are you today?";
  const encoder = encoding_for_model("gpt-3.5-turbo");
  const words = encoder.encode(promptLocal);
  console.log("words", words);
}

//encodePrompt("How are you today?");
main();
