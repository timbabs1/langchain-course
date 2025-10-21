import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  StringOutputParser,
  CommaSeparatedListOutputParser,
} from "@langchain/core/output_parsers";

import { StructuredOutputParser } from "langchain/output_parsers";

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
  maxTokens: 700,
  verbose: false,
});

async function stringParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Write a short description for the following product: {product_name}."
  );

  const parser = new StringOutputParser();

  // creating a chain: connecting the model with the prompt

  const chain = prompt.pipe(model).pipe(parser);

  const response = await chain.invoke({
    product_name: "bicycle",
  });

  console.log(response);

  //console.log(wholePrompt);
}

async function commaSeparatedParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Provide the first 5 ingredients, separated by commas for: {word}."
  );

  const parser = new CommaSeparatedListOutputParser();

  // creating a chain: connecting the model with the prompt

  const chain = prompt.pipe(model).pipe(parser);

  const response = await chain.invoke({
    word: "bread",
  });

  console.log(response);
}

async function structuredParser() {
  const templatePrompt = ChatPromptTemplate.fromTemplate(`
        Extract information from the following phrase.
        Formatting instructions: {format_instructions}.
        Phrase: {phrase}.`);
  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "The name of the person",
    likes: "what the person likes",
  });
  const chain = templatePrompt.pipe(model).pipe(outputParser);

  const result = await chain.invoke({
    format_instructions: outputParser.getFormatInstructions(),
    phrase: "John likes to Pineapple pizza.",
  });
  console.log(result);
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

structuredParser().then(r => console.log("done")).catch(e => console.error('Parser error', e));
