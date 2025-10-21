import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
  maxTokens: 700,
  verbose: false,
});

const question = "What are the langchain libraries?";

async function main() {
  //create the loader:
  const loader = new CheerioWebBaseLoader(
    "https://js.langchain.com/v0.2/docs/introduction"
  );
  const docs = await loader.load();

  //split the docs
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  });

  const splittedDocs = await splitter.splitDocuments(docs);

  //store the data
  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
  await vectorStore.addDocuments(splittedDocs);

  // create data retriever
  const retriever = vectorStore.asRetriever({
    k: 2,
  });

  // get relevant document:
  const results = await retriever.invoke(question);
  const resultDocs = results.map((result) => result.pageContent);

  // build template
  const template = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the users question based on the following context: {context}",
    ],
    ["user", "{input}"],
  ]);

  // create chain
  const chain = template.pipe(model);

  // invoke
  const response = await chain.invoke({
    //context: resultDocs.join('\n'),
    context: resultDocs,
    input: question,
  });
  console.log(response.content);
}

main();
