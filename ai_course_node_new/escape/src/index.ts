import { HfInference } from "@huggingface/inference";
import { writeFile } from "fs";

const inference = new HfInference(process.env.HF_TOKEN);

async function embed() {
  const output = await inference.featureExtraction({
    inputs: "My cool Embeddings",
    model: "BAAI/bge-small-en-v1.5",
  });

  console.log(output);
}

async function translate() {
  const output = await inference.translation({
    inputs: "How is the weather in Paris?",
    model: "t5-base",
  });
  console.log(output);
}
async function translate2() {
  const output = await inference.translation({
    inputs: "How is the weather in Paris?",
    model: "facebook/nllb-200-distilled-600M",
    //@ts-ignore
    parameters: {
      src_lang: "en-Latn",
      tgt_lang: "spa-Latn",
    },
  });
  console.log(output);
}

async function answerQuestion() {
  const result = await inference.questionAnswering({
    inputs: {
      context: "Th quick brown fox jumps over the lazy dog",
      question: "What is the color of the fox ?",
      //question: "Is the dog lazy ?",
    },
  });

  console.log(result);
}

async function textToImage() {
  try {
    const result = await inference.textToImage({
      inputs: "Cat in the hat on a mat",
      model: "stabilityai/stable-diffusion-2",
      parameters: {
        negative_prompt: "blurry",
      },
    });
    const buffer = Buffer.from(await result.arrayBuffer());
    writeFile("image.png", buffer, () => {
      console.log("Image saved");
    });
  } catch (error) {
    console.log("Error in textToImage", error);
  }
}

//translate();
//answerQuestion();
textToImage();
