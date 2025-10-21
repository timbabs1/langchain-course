import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
  maxTokens: 700,
  verbose: false,
});

async function fromTemplate() {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Write a short description for the following product: {product_name}."
  );

  const wholePrompt = await prompt.format({
    product_name: "bicycle",
  });

  // creating a chain: connecting the model with the prompt

  const chain = prompt.pipe(model);

  const response = await chain.invoke({
    product_name: "bicycle",
  });

  console.log(response.content);

  //console.log(wholePrompt);
}

async function fromMessage() {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Write a short description for the product provided by the user.",
    ],
    ["human", "{product_name}"],
  ]);

  const chain = prompt.pipe(model);
  const result = await chain.invoke({
    product_name: "bicycle",
  });

  console.log(result);
}

fromMessage();
