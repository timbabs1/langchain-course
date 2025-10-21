import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_KEY!,
});

// string value
// embedding value

// metadata - more info

type CoolType = {
  coolness: number;
  reference: string;
};

async function listIndexes() {
  const response = await pc.listIndexes();
  console.log(response);
}

// namespace: partition vectors from an index into smaller groups. Make operations limited to one namespace
async function createNameSpace() {
  const index = getIndex();
  const namespace = index.namespace("cool-namespace");
}

function generateNumberArray(length: number) {
  return Array.from({ length }, () => Math.random());
}

async function upsertVectors() {
  const embedding = generateNumberArray(1536);
  const index = getIndex();
  const upsertResult = await index.upsert([
    {
      id: "id-1",
      values: embedding,
      metadata: { coolness: 3, reference: "cool" },
    },
  ]);
  console.log(upsertResult);
}

async function queryVectors() {
  const index = getIndex();
  const queryResult = await index.query({
    id: "id-1",
    topK: 1,
    includeMetadata: true,
  });
  console.log(queryResult);
}

function getIndex() {
  const index = pc.index<CoolType>("cool-index");
  return index;
}

async function createIndex() {
  const response = await pc.createIndex({
    name: "cool-index",
    dimension: 1536,
    metric: "cosine",
    spec: {
      serverless: {
        cloud: "aws",
        region: "us-east-1",
      },
    },
  });
  console.log(response);
}

async function main() {
  await queryVectors();
}

main();
